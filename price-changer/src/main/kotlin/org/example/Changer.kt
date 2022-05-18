package org.example

import java.sql.DriverManager
import java.sql.ResultSet
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import kotlinx.serialization.*
import kotlinx.serialization.json.*
import okhttp3.FormBody
import okhttp3.OkHttpClient
import okhttp3.Request
import org.example.dto.Config
import org.example.dto.Drink
import org.example.dto.Salestats
import org.example.dto.Stonks
import java.io.File
import java.math.BigDecimal
import java.net.URL
import java.sql.Connection
import java.sql.PreparedStatement
import kotlin.random.Random

const val CONFIG_FILE_NAME = "config.json"
const val NEW_PRICES_FILE_NAME = "newPrices.json"
const val DB_URL = "jdbc:mysql://somewhere"
const val DB_USERNAME = "db_user"
const val DB_PASSWORD = "db_password"

const val DEV = false

const val RUN_NUMBER = 0

fun main(args: Array<String>) {
    val config = readConfig()
    println(config)

    val eventStart = LocalDateTime.of(2022, 4, 26, 21, 0, 0)
    val minutesElapsed: Long = RUN_NUMBER * 15L
    val currentUpdateTime = eventStart.plusMinutes(minutesElapsed)
    val previousUpdateTime = currentUpdateTime.minusMinutes(15)

    val totalSales = getDrinkSales(config.drinks, eventStart, currentUpdateTime)
    val latestSales = getDrinkSales(config.drinks, previousUpdateTime, currentUpdateTime)

    println(totalSales)
    println(latestSales)
    val message = "Last hour"
    val newPrices = PriceCalculator.calculate(config.drinks, totalSales, latestSales, message, currentUpdateTime.plusMinutes(15), RUN_NUMBER.toLong())

    println(newPrices)

    File(NEW_PRICES_FILE_NAME).writeText(Json.encodeToString(newPrices))
    File("dump/" + currentUpdateTime + ".json").writeText(Json.encodeToString(newPrices))
}

fun formatTime(time: LocalDateTime) = time.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))

fun getDrinkSales(
    drinks: MutableList<Drink>,
    fromTime: LocalDateTime,
    toTime: LocalDateTime
): Map<String, BigDecimal> {
    val sales = mutableMapOf<String, BigDecimal>()

    if (DEV) {
        val random = Random
        //return drinks.associate { it.name to random.nextLong(0, 10).toBigDecimal() }
        return emptyMap()
    }

    println(fromTime.toString())
    println(toTime.toString())

    var connection: Connection? = null
    var statement: PreparedStatement? = null
    var resultSet: ResultSet? = null

    try {
        connection = getDbConnection()
        statement = connection.prepareStatement("SELECT getSalesAmount(?,?,?)")
        for (drink in drinks) {
            statement!!.setString(1, drink.name)
            statement.setString(2, formatTime(fromTime))
            statement.setString(3, formatTime(toTime))

            resultSet = statement.executeQuery()
            var result: String? = null
            while (resultSet.next()) {
                result = resultSet.getString(1)
            }
            resultSet.close()

            if (result == null) {
                println("Invalid DRINK - ${drink.name}")
                continue
            }
            sales[drink.name] = result.toBigDecimal()
        }
    } catch (e: Exception) {
        e.printStackTrace()
    } finally {
        resultSet?.close()
        statement?.close()
        connection?.close()
    }

    val salestats = Salestats(
        RUN_NUMBER.toLong(),
        fromTime.toString(),
        toTime.toString(),
        sales.mapValues { it.value.toLong() }
    )
    File("salestats/" + LocalDateTime.now() + ".json").writeText(Json.encodeToString(salestats))

    return sales
}

fun readConfig(): Config {
    val rawString = File(CONFIG_FILE_NAME).readText()
    return Json.decodeFromString(rawString)
}

fun getDbConnection(): Connection = DriverManager
    .getConnection(DB_URL, DB_USERNAME, DB_PASSWORD)

fun updatePrice(newPrices: Stonks) {
    if (DEV) {
        return
    }

    var connection: Connection? = null
    var statement: PreparedStatement? = null
    var resultSet: ResultSet? = null

    try {
        connection = getDbConnection()
        statement = connection.prepareStatement("SELECT updateProductPrice(?,?)")
        for (drink in newPrices.categories.flatMap { it.value.stonks }) {
            println(drink.price.toDouble())
            statement!!.setString(1, drink.name)
            statement.setDouble(2, drink.price.toDouble())

            resultSet = statement.executeQuery()
            var result: String? = null
            while (resultSet.next()) {
                result = resultSet.getString(1)
            }
            resultSet.close()

            if (result == null) {
                println("Failed to update DRINK - ${drink.name}")
                continue
            }
            println(result)
        }
    } catch (e: Exception) {
        e.printStackTrace()
    } finally {
        resultSet?.close()
        statement?.close()
        connection?.close()
    }
}

fun postStonks(stonks: Stonks) {
    // Create OkHttp Client
    val client = OkHttpClient()
    val sUrl = "http://localhost:5000/api/drinks/stonks"
    var result: String? = null
    try {
        // Create URL
        val url = URL(sUrl)
        // Build request
        val formBody = FormBody.Builder()
            .add("stonks", Json.encodeToString(stonks))
            .build()

        val request = Request.Builder()
            .url(url)
            .post(formBody)
            .build()
        // Execute request
        val response = client.newCall(request).execute()
        result = response.body?.string()
    } catch (err: Error) {
        print("Error when executing get request: " + err.localizedMessage)
    }
    println(result)
}

