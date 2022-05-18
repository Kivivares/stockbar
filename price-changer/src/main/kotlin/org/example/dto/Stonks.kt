package org.example.dto

import kotlinx.datetime.LocalDateTime
import kotlinx.datetime.serializers.LocalDateComponentSerializer
import kotlinx.datetime.serializers.LocalDateTimeComponentSerializer
import kotlinx.serialization.Serializable
import java.math.BigDecimal

@Serializable
data class Stonks(
    val message: String?,
    val date: String,
    val categories: MutableMap<String, StonkCategory>,
    val runNumber: Long
)

@Serializable
data class StonkCategory(
    val name: String, val stonks: MutableList<Stonk>
)

@Serializable
data class Stonk(
    val name: String,
    @Serializable(with = BigDecimalSerializer::class)
    val price: BigDecimal
) {
    var dir: String? = null
}