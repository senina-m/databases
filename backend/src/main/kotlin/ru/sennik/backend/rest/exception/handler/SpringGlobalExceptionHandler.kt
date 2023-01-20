package ru.sennik.backend.rest.exception.handler

import mu.KLogging
import org.hibernate.exception.ConstraintViolationException
import org.springframework.beans.ConversionNotSupportedException
import org.springframework.beans.TypeMismatchException
import org.springframework.core.Ordered
import org.springframework.core.annotation.Order
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.http.converter.HttpMessageNotReadableException
import org.springframework.http.converter.HttpMessageNotWritableException
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.validation.BindException
import org.springframework.web.HttpMediaTypeNotAcceptableException
import org.springframework.web.HttpMediaTypeNotSupportedException
import org.springframework.web.HttpRequestMethodNotSupportedException
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.MissingPathVariableException
import org.springframework.web.bind.MissingServletRequestParameterException
import org.springframework.web.bind.ServletRequestBindingException
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestControllerAdvice
import org.springframework.web.context.request.WebRequest
import org.springframework.web.context.request.async.AsyncRequestTimeoutException
import org.springframework.web.multipart.support.MissingServletRequestPartException
import org.springframework.web.servlet.NoHandlerFoundException
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler
import ru.sennik.backend.generated.dto.ErrorDto
import ru.sennik.backend.rest.exception.AlreadyExistException
import ru.sennik.backend.rest.exception.WrongTypeException
import java.lang.Exception
import java.util.*

/**
 * @author Natalia Nikonova
 */
@RestControllerAdvice
@Order(Ordered.HIGHEST_PRECEDENCE)
@RequestMapping(produces = [MediaType.APPLICATION_JSON_VALUE])
class SpringGlobalExceptionHandler : ResponseEntityExceptionHandler() {
   @ExceptionHandler(RuntimeException::class)
   @ResponseStatus(code = HttpStatus.INTERNAL_SERVER_ERROR)
   fun handleServerException(ex: RuntimeException): ResponseEntity<ErrorDto> {
      logger.error("Exception in occurred", ex)
      return createResponse(HttpStatus.INTERNAL_SERVER_ERROR.name, ex.message!!)
   }
   @ExceptionHandler(AlreadyExistException::class)
   @ResponseStatus(code = HttpStatus.CONFLICT)
   fun handleAlreadyExistExceptionHandler(ex: AlreadyExistException): ResponseEntity<ErrorDto> {
      logger.error("Exception in occurred", ex)
      SecurityContextHolder.clearContext()
      return createResponse(HttpStatus.CONFLICT.name, ex.message!!)
   }

   @ExceptionHandler(WrongTypeException::class)
   @ResponseStatus(code = HttpStatus.BAD_REQUEST)
   fun handleWrongTypeExceptionHandler(ex: WrongTypeException): ResponseEntity<ErrorDto> {
      logger.error("Exception in occurred", ex)
      return createResponse(HttpStatus.BAD_REQUEST.name, ex.message!!)
   }

   //TODO обработку NotFoundException здесь

   @ExceptionHandler(ConstraintViolationException::class)
   @ResponseStatus(HttpStatus.BAD_REQUEST)
   fun handleConstraintViolationException(ex: ConstraintViolationException): ResponseEntity<ErrorDto> {
      logger.error("Exception in occurred", ex)
      return createErrorResponse(ex)
   }

   override fun handleAsyncRequestTimeoutException(
      ex: AsyncRequestTimeoutException,
      headers: HttpHeaders,
      status: HttpStatus,
      webRequest: WebRequest
   ): ResponseEntity<Any>? {
      return createResponseAny("REQUEST_TIMEOUT", "Превышено время ожидания: ${ex.message}")
   }

   override fun handleBindException(
      ex: BindException,
      headers: HttpHeaders,
      status: HttpStatus,
      request: WebRequest
   ): ResponseEntity<Any> {
      return createErrorResponse(ex)
   }

   override fun handleConversionNotSupported(
      ex: ConversionNotSupportedException,
      headers: HttpHeaders,
      status: HttpStatus,
      request: WebRequest
   ): ResponseEntity<Any> {
      return createResponseAny("CONVERSION_ERROR", "Не найден конвертр для типа: ${ex.message}")
   }

   override fun handleHttpMediaTypeNotAcceptable(
      ex: HttpMediaTypeNotAcceptableException,
      headers: HttpHeaders,
      status: HttpStatus,
      request: WebRequest
   ): ResponseEntity<Any> {
      return createResponseAny("UNACCEPTABLE_MEDIA_TYPE", "Не поддерживаемый тип ответа: ${ex.message}")
   }

   override fun handleHttpMediaTypeNotSupported(
      ex: HttpMediaTypeNotSupportedException,
      headers: HttpHeaders,
      status: HttpStatus,
      request: WebRequest
   ): ResponseEntity<Any> {
      return createResponseAny("UNSUPPORTED_MEDIA_TYPE", "Не поддерживаемый тип запроса: ${ex.message}")
   }

   override fun handleHttpMessageNotReadable(
      ex: HttpMessageNotReadableException,
      headers: HttpHeaders,
      status: HttpStatus,
      request: WebRequest
   ): ResponseEntity<Any> {
      return createResponseAny("UNREADABLE_MESSAGE", "Нечитаемое сообщение: ${ex.message}")
   }

   override fun handleHttpMessageNotWritable(
      ex: HttpMessageNotWritableException,
      headers: HttpHeaders,
      status: HttpStatus,
      request: WebRequest
   ): ResponseEntity<Any> {
      return createResponseAny("UNWRITABLE_MESSAGE", "Незаписываемое сообщение: ${ex.message}")
   }

   override fun handleHttpRequestMethodNotSupported(
      ex: HttpRequestMethodNotSupportedException,
      headers: HttpHeaders,
      status: HttpStatus,
      request: WebRequest
   ): ResponseEntity<Any> {
      return createResponseAny("METHOD_NOT_ALLOWED", "Неподдерживаемый метод: ${ex.message}")
   }

   override fun handleMethodArgumentNotValid(
      ex: MethodArgumentNotValidException,
      headers: HttpHeaders,
      status: HttpStatus,
      request: WebRequest
   ): ResponseEntity<Any> {
      return createErrorResponse(ex)
   }

   override fun handleMissingPathVariable(
      ex: MissingPathVariableException,
      headers: HttpHeaders,
      status: HttpStatus,
      request: WebRequest
   ): ResponseEntity<Any> {
      return createResponseAny("MISSING_PARAMETER", "Пропущены параметры в пути: ${ex.message}")
   }

   override fun handleMissingServletRequestParameter(
      ex: MissingServletRequestParameterException,
      headers: HttpHeaders,
      status: HttpStatus,
      request: WebRequest
   ): ResponseEntity<Any> {
      return createResponseAny("MISSING_PARAMETER", "Пропущены параметры в запросе: ${ex.message}")
   }

   override fun handleMissingServletRequestPart(
      ex: MissingServletRequestPartException,
      headers: HttpHeaders,
      status: HttpStatus,
      request: WebRequest
   ): ResponseEntity<Any> {
      return createResponseAny("MISSING_REQUEST_PART", "Пропущена медиа часть запроса: ${ex.message}")
   }

   override fun handleNoHandlerFoundException(
      ex: NoHandlerFoundException,
      headers: HttpHeaders,
      status: HttpStatus,
      request: WebRequest
   ): ResponseEntity<Any> {
      return createResponseAny("REQUEST_HANDLER_NOT_FOUND", "Не найден обработчик: ${ex.message}")
   }

   override fun handleServletRequestBindingException(
      ex: ServletRequestBindingException,
      headers: HttpHeaders,
      status: HttpStatus,
      request: WebRequest
   ): ResponseEntity<Any> {
      return createResponseAny("BINDING_ERROR", "${ex.message}")
   }

   override fun handleTypeMismatch(
      ex: TypeMismatchException,
      headers: HttpHeaders,
      status: HttpStatus,
      request: WebRequest
   ): ResponseEntity<Any> {
      return createResponseAny("TYPE_MISMATCH", "Неверный тип поля: ${ex.message}")
   }

   override fun handleExceptionInternal(
      ex: Exception,
      body: Any?,
      headers: HttpHeaders,
      status: HttpStatus,
      request: WebRequest
   ): ResponseEntity<Any> {
      logger.error("Exception in occurred", ex)
      return createResponseAny(HttpStatus.INTERNAL_SERVER_ERROR.name, ex.message!!)
   }

   companion object : KLogging() {
      private fun createResponseAny(status: String, message: String): ResponseEntity<Any> =
         ResponseEntity.of(Optional.of(ErrorDto(status, message)))

      private fun createResponse(status: String, message: String): ResponseEntity<ErrorDto> =
         ResponseEntity.of(Optional.of(ErrorDto(status, message)))

      private fun createErrorResponse(ex: BindException): ResponseEntity<Any> {
         ex.fieldError?.let {
            return createResponseAny("BINDING_ERROR", "${it.field}: ${it.defaultMessage}")
         }
         ex.globalError?.let {
            return createResponseAny("BINDING_ERROR", "${it.objectName}: ${it.defaultMessage}")
         }
         return createResponseAny("BINDING_ERROR", "Невозможно определить неправильное поле")
      }

      private fun createErrorResponse(ex: ConstraintViolationException): ResponseEntity<ErrorDto> {
         return createResponse("PROPERTY_VALIDATION_ERROR", "${ex.message}; ${ex.constraintName}")
      }
   }
}
