package ru.sennik.backend.domain.customers.service

import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import ru.sennik.backend.domain.customers.model.Permission
import ru.sennik.backend.domain.customers.repository.PermissionRepository
import ru.sennik.backend.generated.controller.NotFoundException

/**
 * @author Natalia Nikonova
 */
@Service
class PermissionService(
   private val repository: PermissionRepository
) {
   fun getPermissions(): List<Permission> = repository.findAll()

   fun getPermissionById(id: Int) = repository.findByIdOrNull(id)
      ?: throw NotFoundException("Роль пользователя с id=$id не найдена")

   fun getPermissionByName(name: String) = repository.findByName(name)
      ?: throw NotFoundException("Роль с именем $name не найдена")
}
