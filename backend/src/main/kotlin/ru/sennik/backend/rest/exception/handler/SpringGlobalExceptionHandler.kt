package ru.sennik.backend.rest.exception.handler

import io.jsonwebtoken.security.SignatureException
import mu.KLogging
import org.hibernate.exception.ConstraintViolationException
import org.springframework.beans.ConversionNotSupportedException
import org.springframework.beans.TypeMismatchException
import org.springframework.core.Ordered
import org.springframework.core.annotation.Order
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.converter.HttpMessageNotReadableException
import org.springframework.http.converter.HttpMessageNotWritableException
import org.springframework.orm.jpa.JpaSystemException
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
import ru.sennik.backend.generated.controller.NotFoundException
import ru.sennik.backend.generated.dto.ErrorDto
import ru.sennik.backend.rest.exception.AlreadyExistException
import ru.sennik.backend.rest.exception.ClientException
import ru.sennik.backend.rest.exception.WrongPasswordException
import ru.sennik.backend.rest.exception.WrongTokenException
import ru.sennik.backend.rest.exception.WrongTypeException
import java.lang.Exception
import java.util.*
import java.util.regex.Pattern

/**
 * @author Natalia Nikonova
 */
@RestControllerAdvice
@Order(Ordered.HIGHEST_PRECEDENCE)
@RequestMapping(produces = [MediaType.APPLICATION_JSON_VALUE])
class SpringGlobalExceptionHandler {
   @ExceptionHandler(RuntimeException::class)
   @ResponseStatus(code = HttpStatus.INTERNAL_SERVER_ERROR)
   fun handleServerException(ex: RuntimeException): ErrorDto {
      logger.error("Exception in occurred", ex)
      return ErrorDto(HttpStatus.INTERNAL_SERVER_ERROR.name, ex.message!!)
   }

   @ExceptionHandler(JpaSystemException::class)
   @ResponseStatus(code = HttpStatus.BAD_REQUEST)
   fun handlePSQLException(ex: JpaSystemException): ErrorDto {
      val pattern = Pattern.compile("ERROR: (.+) Where: PL/pgSQL function")
      val errorMessage = ex.rootCause?.message ?: ""
      val matcher = pattern.matcher(errorMessage)
      val message = if (matcher.find()) "Поля не прошли валидацию: ${matcher.group(1)}" else errorMessage
      return ErrorDto(HttpStatus.BAD_REQUEST.name, message)
   }
   @ExceptionHandler(AlreadyExistException::class)
   @ResponseStatus(code = HttpStatus.CONFLICT)
   fun handleAlreadyExistExceptionHandler(ex: AlreadyExistException): ErrorDto {
      logger.error("Exception in occurred", ex)
      SecurityContextHolder.clearContext()
      return ErrorDto(HttpStatus.CONFLICT.name, ex.message!!)
   }

   @ExceptionHandler(WrongTypeException::class)
   @ResponseStatus(code = HttpStatus.BAD_REQUEST)
   fun handleWrongTypeExceptionHandler(ex: WrongTypeException): ErrorDto {
      logger.error("Exception in occurred", ex)
      return ErrorDto(HttpStatus.BAD_REQUEST.name, ex.message!!)
   }

   @ExceptionHandler(NotFoundException::class)
   @ResponseStatus(code = HttpStatus.NOT_FOUND)
   fun handleNotFoundException(ex: NotFoundException): ErrorDto {
      return ErrorDto(HttpStatus.NOT_FOUND.name, ex.message!!)
   }

   @ExceptionHandler(ConstraintViolationException::class)
   @ResponseStatus(HttpStatus.BAD_REQUEST)
   fun handleConstraintViolationException(ex: ConstraintViolationException): ErrorDto {
      logger.error("Exception in occurred", ex)
      return createErrorResponse(ex)
   }

   @ExceptionHandler(HttpMediaTypeNotSupportedException::class)
   @ResponseStatus(HttpStatus.UNSUPPORTED_MEDIA_TYPE)
   fun handleHttpMediaTypeNotSupportedException(ex: HttpMediaTypeNotSupportedException): ErrorDto {
      return ErrorDto("UNSUPPORTED_MEDIA_TYPE", "Неподдерживаемый тип контента ${ex.contentType?.type}")
   }

   @ExceptionHandler(HttpMediaTypeNotAcceptableException::class)
   @ResponseStatus(HttpStatus.NOT_ACCEPTABLE)
   fun handleHttpMediaTypeNotAcceptableException(ex: HttpMediaTypeNotAcceptableException): ErrorDto {
      return ErrorDto("UNACCEPTABLE_MEDIA_TYPE", "Не поддерживаемый тип ответа: ${ex.message}")
   }

   @ExceptionHandler(MissingPathVariableException::class)
   @ResponseStatus(HttpStatus.BAD_REQUEST)
   fun handleMissingPathVariableException(ex: MissingPathVariableException): ErrorDto {
      return ErrorDto("MISSING_PARAMETER", "Пропущены параметры в пути: ${ex.variableName}")
   }

   @ExceptionHandler(MissingServletRequestParameterException::class)
   @ResponseStatus(HttpStatus.BAD_REQUEST)
   fun handleMissingServletRequestParameterException(
      ex: MissingServletRequestParameterException
   ): ErrorDto {
      return ErrorDto("MISSING_PARAMETER", "Пропущены параметры в запросе: ${ex.parameterName}")
   }

   @ExceptionHandler(ServletRequestBindingException::class)
   @ResponseStatus(HttpStatus.BAD_REQUEST)
   fun handleServletRequestBindingException(ex: ServletRequestBindingException): ErrorDto {
      return ErrorDto("BINDING_ERROR","${ex.message}")
   }

   @ExceptionHandler(ConversionNotSupportedException::class)
   @ResponseStatus(HttpStatus.BAD_REQUEST)
   fun handleConversionNotSupportedException(ex: ConversionNotSupportedException): ErrorDto {
      return ErrorDto("CONVERSION_ERROR", "Не найден конвертр для типа: ${ex.message}")
   }

   @ExceptionHandler(HttpMessageNotReadableException::class)
   @ResponseStatus(HttpStatus.BAD_REQUEST)
   fun handleHttpMessageNotReadableException(ex: HttpMessageNotReadableException): ErrorDto {
      return ErrorDto("UNREADABLE_MESSAGE", "Нечитаемое сообщение: ${ex.message}")
   }

   @ExceptionHandler(MissingServletRequestPartException::class)
   @ResponseStatus(HttpStatus.BAD_REQUEST)
   fun handleMissingServletRequestPartException(ex: MissingServletRequestPartException): ErrorDto {
      return ErrorDto("MISSING_REQUEST_PART","Пропущена медиа часть запроса: ${ex.message}")
   }

   @ExceptionHandler(BindException::class)
   @ResponseStatus(HttpStatus.BAD_REQUEST)
   fun handleBindException(ex: BindException): ErrorDto {
      return createErrorResponse(ex)
   }

   @ExceptionHandler(NoHandlerFoundException::class)
   @ResponseStatus(HttpStatus.NOT_FOUND)
   fun handleNoHandlerFoundException(ex: NoHandlerFoundException): ErrorDto {
      return ErrorDto("REQUEST_HANDLER_NOT_FOUND", "Не найден обработчик: ${ex.message}")
   }

   @ExceptionHandler(AsyncRequestTimeoutException::class)
   @ResponseStatus(HttpStatus.REQUEST_TIMEOUT)
   fun handleAsyncRequestTimeoutException(ex: AsyncRequestTimeoutException): ErrorDto {
      return ErrorDto("REQUEST_TIMEOUT", "Превышено время ожидания: ${ex.message}")
   }

   @ExceptionHandler(HttpMessageNotWritableException::class)
   @ResponseStatus(HttpStatus.BAD_REQUEST)
   fun handleHttpMessageNotWritableException(ex: HttpMessageNotWritableException): ErrorDto {
      return ErrorDto("UNWRITABLE_MESSAGE", "Незаписываемое сообщение: ${ex.message}")
   }

   @ExceptionHandler(HttpRequestMethodNotSupportedException::class)
   @ResponseStatus(HttpStatus.METHOD_NOT_ALLOWED)
   fun handleHttpRequestMethodNotSupportedException(ex: HttpRequestMethodNotSupportedException): ErrorDto {
      return ErrorDto("METHOD_NOT_ALLOWED", "Неподдерживаемый метод: ${ex.message}")
   }

   @ExceptionHandler(MethodArgumentNotValidException::class)
   @ResponseStatus(HttpStatus.BAD_REQUEST)
   fun handleMethodArgumentNotValid(
      ex: MethodArgumentNotValidException,
      headers: HttpHeaders,
      status: HttpStatus,
      request: WebRequest
   ): ErrorDto {
      return createErrorResponse(ex)
   }

   @ExceptionHandler(TypeMismatchException::class)
   @ResponseStatus(HttpStatus.BAD_REQUEST)
   fun handleTypeMismatchException(ex: TypeMismatchException): ErrorDto {
      return ErrorDto("TYPE_MISMATCH", "Неверный тип поля: ${ex.message}")
   }

   @ExceptionHandler(Exception::class)
   @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
   fun handleExceptionInternal(ex: Exception): ErrorDto {
      logger.error("Exception in occurred", ex)
      return ErrorDto("TYPE_MISMATCH", "${ex.message}")
   }

   @ExceptionHandler(WrongTokenException::class)
   @ResponseStatus(HttpStatus.UNAUTHORIZED)
   fun handleWrongTokenException(ex: WrongTokenException): ErrorDto {
      return ErrorDto("WRONG_TOKEN_ERROR", ex.message!!)
   }

   @ExceptionHandler(WrongPasswordException::class)
   @ResponseStatus(HttpStatus.BAD_REQUEST)
   fun handleWrongPasswordException(ex: WrongPasswordException): ErrorDto {
      return ErrorDto("BAD_REQUEST", ex.message!!)
   }

   @ExceptionHandler(ClientException::class)
   @ResponseStatus(HttpStatus.BAD_REQUEST)
   fun handleClientException(ex: ClientException): ErrorDto {
      return ErrorDto("BAD_REQUEST", ex.message!!)
   }

   @ExceptionHandler(SignatureException::class)
   @ResponseStatus(HttpStatus.UNAUTHORIZED)
   fun handleSignatureException(ex: SignatureException): ErrorDto {
      return ErrorDto("UNAUTHORIZED", "Невалидный или истекший JWT токен")
   }

   companion object : KLogging() {
      private fun createErrorResponse(ex: BindException): ErrorDto {
         ex.fieldError?.let {
            return ErrorDto("BINDING_ERROR", "${it.field}: ${it.defaultMessage}")
         }
         ex.globalError?.let {
            return ErrorDto("BINDING_ERROR", "${it.objectName}: ${it.defaultMessage}")
         }
         return ErrorDto("BINDING_ERROR", "Невозможно определить неправильное поле")
      }

      private fun createErrorResponse(ex: ConstraintViolationException): ErrorDto {
         return ErrorDto("PROPERTY_VALIDATION_ERROR", "${ex.message}; ${ex.constraintName}")
      }
   }
}
