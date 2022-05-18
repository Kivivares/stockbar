package org.example.dto

import kotlinx.datetime.LocalDateTime
import kotlinx.datetime.serializers.LocalDateComponentSerializer
import kotlinx.datetime.serializers.LocalDateTimeComponentSerializer
import kotlinx.serialization.Serializable
import java.math.BigDecimal

@Serializable
data class StonksData(
    val data: MutableList<StonksMongo>
)

@Serializable
data class StonksMongo(
    val message: String?,
    val date: StonkDate,
    val categories: MutableMap<String, StonkCategoryMongo>
)

@Serializable
data class StonkCategoryMongo(
    val name: String, val stonks: MutableList<StonkMongo>
)

@Serializable
data class StonkMongo(
    val name: String,
    val price: StonkPrice
) {
    var dir: String? = null
}

@Serializable
data class StonkPrice(
    val numero: String
)

@Serializable
data class StonkDate(
    val dateData: String
)