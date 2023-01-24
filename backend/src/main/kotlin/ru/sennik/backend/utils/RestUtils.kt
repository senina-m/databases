package ru.sennik.backend.utils

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import ru.sennik.backend.generated.dto.BooleanResponseDto

/**
 * @author Natalia Nikonova
 */

fun <T> createdResponseEntity(dto: T) = ResponseEntity(dto, HttpStatus.CREATED)

fun successDeleteDto(): ResponseEntity<BooleanResponseDto> = ResponseEntity.ok(BooleanResponseDto(true))