package ru.sennik.backend.utils

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity

/**
 * @author Natalia Nikonova
 */

fun <T> createdResponseEntity(dto: T) = ResponseEntity(dto, HttpStatus.CREATED)
