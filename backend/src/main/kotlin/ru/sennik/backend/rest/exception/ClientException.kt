package ru.sennik.backend.rest.exception

/**
 * @author Natalia Nikonova
 */
class AlreadyExistException(message: String) : RuntimeException(message)

class WrongTypeException(field: String, value: String) :
    RuntimeException("Для поля $field значение $value не разрешено")

class WrongTokenException(message: String) : RuntimeException(message)

class WrongPasswordException(username: String) : RuntimeException("Неверный пароль для пользователя $username")

class ClientException(message: String) : RuntimeException(message)
