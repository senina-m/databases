package ru.sennik.backend.domain.customers.enums

import ru.sennik.backend.rest.exception.WrongTypeException

/**
 * @author Natalia Nikonova
 */
enum class PermissionType(
   val value: String
) {
   ROLE_WRITER("Летописец"),
   ROLE_DETECTIVE("Детектив");

   companion object {
      private val valueMap = values().associateBy { it.value }

      fun String.toPermissionType() = valueMap[this] ?: throw WrongTypeException("роль пользователя", this)
   }
}
