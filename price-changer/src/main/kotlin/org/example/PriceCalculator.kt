package org.example

import org.example.dto.Drink
import org.example.dto.Stonk
import org.example.dto.StonkCategory
import org.example.dto.Stonks
import java.math.BigDecimal
import java.math.RoundingMode
import java.time.LocalDateTime

val PRICE_DELTA = BigDecimal.valueOf(1.7)

object PriceCalculator {
    fun calculate(
        drinks: List<Drink>,
        totalSales: Map<String, BigDecimal>,
        latestSales: Map<String, BigDecimal>,
        message: String?,
        time: LocalDateTime,
        runNumber: Long
    ): Stonks {
        val allTotalSales = totalSales.values.sumOf { it }
        val allLatestSales = latestSales.values.sumOf { it }
        val numberOfDrinks = drinks.size.toBigDecimal()

        val updatedPrices = Stonks(message, time.toString(), mutableMapOf(), runNumber)
        for (drink in drinks) {
            val totalSale = totalSales[drink.name] ?: BigDecimal.ZERO
            val latestSale = latestSales[drink.name] ?: BigDecimal.ZERO

            val minPrice = drink.minPrice
            val basePrice = drink.minPrice.add(PRICE_DELTA)
            val maxPrice = basePrice.add(PRICE_DELTA)

            var newPrice = basePrice

            if (allTotalSales.equals(BigDecimal.ZERO)) {
                val category = updatedPrices.categories.getOrPut(
                    drink.category
                ) { StonkCategory(drink.category, mutableListOf()) }

                category.stonks.add(Stonk(drink.name, newPrice))
                continue
            }

            val changeFromTotal = if (!allTotalSales.equals(BigDecimal.ZERO)) {
                totalSale.minus(
                    allTotalSales.divide(numberOfDrinks, 4, RoundingMode.HALF_UP)
                ).divide(allTotalSales, 4, RoundingMode.HALF_UP)
            } else {
                BigDecimal.ZERO
            }
            val changeFromLatest = if (!allLatestSales.equals(BigDecimal.ZERO)) {
                latestSale.minus(
                    allLatestSales.divide(numberOfDrinks, 4, RoundingMode.HALF_UP)
                ).divide(allLatestSales, 4, RoundingMode.HALF_UP)
            } else {
                BigDecimal.ZERO
            }

            var totalChange = changeFromTotal.add(changeFromLatest)
            totalChange = totalChange.multiply(BigDecimal.valueOf(3))

            val priceChange = if (totalChange < BigDecimal.ZERO) {
                basePrice.minus(minPrice).multiply(totalChange)
            } else {
                maxPrice.minus(basePrice).multiply(totalChange)
            }

            newPrice = basePrice.plus(priceChange)

            if (newPrice > maxPrice) {
                newPrice = maxPrice
            }

            if (newPrice < drink.minPrice) {
                newPrice = drink.minPrice
            }

            newPrice = newPrice.setScale(2, RoundingMode.HALF_UP)

            val category = updatedPrices.categories.getOrPut(
                drink.category
            ) { StonkCategory(drink.category, mutableListOf()) }

            category.stonks.add(Stonk(drink.name, newPrice))
        }

        return updatedPrices
    }
}