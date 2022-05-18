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
import org.example.dto.Stonks
import java.io.File
import java.math.BigDecimal
import java.net.URL
import java.sql.Connection
import java.sql.PreparedStatement
import kotlin.random.Random

fun main(args: Array<String>) {
    val rawString = File(NEW_PRICES_FILE_NAME).readText()
    val newPrices: Stonks = Json.decodeFromString(rawString)

    val previousUpdateTime = LocalDateTime.parse(newPrices.date).minusMinutes(2 * 15)
    println(previousUpdateTime)

    val previousPrices: Stonks? = try {
        Json.decodeFromString(File("dump/" + previousUpdateTime + ".json").readText())
    } catch (e: Exception) {
        null
    }

    val prevMap = previousPrices?.categories?.flatMap { it.value.stonks }?.associateBy { it.name } ?: emptyMap()

    newPrices.categories.onEach {
        it.value.stonks.onEach {
            val prevPrice = prevMap[it.name]?.price
            it.dir = when {
                prevPrice == null -> "equal"
                prevPrice > it.price -> "lower"
                prevPrice < it.price -> "higher"
                else -> "equal"
            }
        }
    }

    println(newPrices)

    postStonks(newPrices)

    updatePrice(newPrices)
}

