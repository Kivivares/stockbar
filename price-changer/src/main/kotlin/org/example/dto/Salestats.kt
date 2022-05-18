package org.example.dto

import kotlinx.datetime.LocalDateTime
import kotlinx.datetime.serializers.LocalDateComponentSerializer
import kotlinx.datetime.serializers.LocalDateTimeComponentSerializer
import kotlinx.serialization.Contextual
import kotlinx.serialization.Serializable
import java.math.BigDecimal

@Serializable
data class Salestats(
    val runNumber: Long,
    val from: String,
    val to: String,
    val sales: Map<String, Long>
)