package org.example

import kotlinx.serialization.decodeFromString
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import org.example.dto.*
import java.io.File
import java.time.LocalDateTime

fun main(args: Array<String>) {
    val configRawString = File(CONFIG_FILE_NAME).readText()
    val config: Config = Json.decodeFromString(configRawString)
    val configString = StringBuilder()
    configString.appendLine("drink,category,minPrice")
    val order = mutableListOf<String>()
    for (drinkConfig in config.drinks) {
        val parts = mutableListOf<String>()
        parts += cleanName(drinkConfig.name)
        parts += drinkConfig.category
        parts += drinkConfig.minPrice.toPlainString()

        configString.appendLine(parts.joinToString(","))
        order += cleanName(drinkConfig.name)
    }
    File("data_clean/config.csv").writeText(configString.toString())


    val stonksRawString = File("stonks.json").readText()
    val stonkss: StonksData = Json { ignoreUnknownKeys = true }.decodeFromString(stonksRawString)

    val priceData = StringBuilder()
    priceData.appendLine("date,nextDate,runId," + order.joinToString(","))
    var runId = 0
    for (stonk in stonkss.data.distinctBy { it.date }) {
        val stonks = stonk.categories.flatMap { it.value.stonks }
            .associateBy { cleanName(it.name) }

        val parts = mutableListOf<String>()
        runId += 1
        parts += LocalDateTime.parse(stonk.date.dateData.substringBefore("Z")).minusMinutes(15).toString()
        parts += stonk.date.dateData.substringBefore("Z")
        parts += runId.toString()

        for (ord in order) {
            parts += stonks[ord]!!.price.numero
        }
        priceData.appendLine(parts.joinToString(","))
    }

    File("data_clean/prices.csv").writeText(priceData.toString())

    val saleData = StringBuilder()
    saleData.appendLine("date,nextDate,runId," + order.joinToString(","))
    val saleDataMap = mutableMapOf<String, MutableList<Pair<String, Salestats>>>()
    for (i in 16 downTo 1) {
        saleDataMap[i.toString()] = mutableListOf()
    }
    for (file in File("salestats").walkTopDown()) {
        if (file.isDirectory) {
            continue
        }
        val sales: Salestats = Json.decodeFromString(file.readText())
        if (sales.from != "2022-04-26T21:00") {
            continue
        }
        saleDataMap[sales.runNumber.toString()]!!.add(file.nameWithoutExtension to sales)
    }

    val saleList = mutableListOf<Salestats>()
    for (saleEntry in saleDataMap.entries) {
        val runNumber = saleEntry.key

        //println(saleEntry.value.size)
        val last = saleEntry.value.sortedBy { it.first }.last()

        saleList.add(last.second)
    }

    val stringList = mutableListOf<String>()
    var prev: Salestats? = null
    for (listEntry in saleList) {
        if (prev == null) {
            prev = listEntry
            continue
        }

        val parts = mutableListOf<String>()

        parts += listEntry.to
        parts += LocalDateTime.parse(listEntry.to).plusMinutes(15).toString()
        parts += (listEntry.runNumber + 1).toString()

        for (ord in order) {
            val prevSales = prev.sales[ord + " B"]!!
            val curSales = listEntry.sales[ord + " B"]!!
            parts += (prevSales - curSales).toString()
        }

        stringList.add(parts.joinToString(","))
        prev = listEntry
    }

    val parts = mutableListOf<String>()

    parts += LocalDateTime.parse(prev!!.to).minusMinutes(15).toString()
    parts += prev!!.to
    parts += (prev!!.runNumber).toString()

    for (ord in order) {
        parts += prev!!.sales[ord + " B"]!!.toString()
    }

    stringList.add(parts.joinToString(","))

    stringList.reversed().forEach { saleData.appendLine(it) }

    File("data_clean/sales.csv").writeText(saleData.toString())
}

fun cleanName(name: String) = name.substringBefore(" B")