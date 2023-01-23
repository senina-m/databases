package ru.sennik.backend.rest.exception

import com.fasterxml.jackson.databind.RuntimeJsonMappingException

/**
 * @author Natalia Nikonova
 */
class AlreadyExistException(message: String) : RuntimeException(message)

class WrongTypeException(field: String, value: String) :
    RuntimeException("Для поля $field значение $value не разрешено")

class WrongTokenException(message: String) : RuntimeException(message)

class WrongPasswordException(username: String) : RuntimeException("Неверный пароль для пользователя $username")
