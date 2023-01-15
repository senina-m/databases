package ru.sennik.backend.rest.exception.handler

import org.springframework.core.Ordered
import org.springframework.core.annotation.Order
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.ResponseBody
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler
import ru.sennik.backend.generated.dto.ErrorDto
import ru.sennik.backend.rest.exception.AlreadyExistException

/**
 * @author Natalia Nikonova
 */
@ControllerAdvice
@Order(Ordered.HIGHEST_PRECEDENCE)
@ResponseBody
class SpringGlobalExceptionHandler : ResponseEntityExceptionHandler() {
   @ExceptionHandler(value = [AlreadyExistException::class])
   fun alreadyExistExceptionHandler(ex: AlreadyExistException): ResponseEntity<ErrorDto> {
      logger.error("Exception in occurred", ex)
      SecurityContextHolder.clearContext()
      return ResponseEntity(ErrorDto(HttpStatus.CONFLICT.name, ex.message!!), HttpStatus.CONFLICT)
   }
}
