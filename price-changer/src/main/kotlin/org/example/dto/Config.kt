package org.example.dto

import kotlinx.serialization.Serializable
import java.math.BigDecimal

@Serializable
data class Config(
    val drinks: MutableList<Drink> = mutableListOf()
)

@Serializable
data class Drink(
    val name: String,
    val category: String,
    @Serializable(with = BigDecimalSerializer::class)
    val minPrice: BigDecimal
)
