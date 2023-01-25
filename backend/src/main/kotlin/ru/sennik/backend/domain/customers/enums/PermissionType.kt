package ru.sennik.backend.domain.customers.enums

import ru.sennik.backend.rest.exception.WrongTypeException

/**
 * @author Natalia Nikonova
 */
enum class PermissionType(
   val value: String,
   val role: String,
) {
   ROLE_WRITER("writer", "WRITER"),
   ROLE_DETECTIVE("detective", "DETECTIVE");

   companion object {
      private val valueMap = values().associateBy { it.value }

      fun String.toPermissionType() = valueMap[this] ?: throw WrongTypeException("роль пользователя", this)
   }
}
