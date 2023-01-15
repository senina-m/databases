package ru.sennik.backend.rest

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.RestController
import ru.sennik.backend.domain.customers.model.Permission
import ru.sennik.backend.domain.customers.service.PermissionService
import ru.sennik.backend.generated.controller.PermissionsApi
import ru.sennik.backend.generated.dto.PermissionDto

/**
 * @author Natalia Nikonova
 */
@RestController
class PermissionController(
    private val permissionService: PermissionService
) : PermissionsApi {

    override fun getPermissions(): ResponseEntity<List<PermissionDto>> {
        return ResponseEntity.ok(permissionService.getPermissions().map { it.toDto() })
    }

    override fun getPermission(permissionId: Int): ResponseEntity<PermissionDto> {
        return ResponseEntity.ok(permissionService.getPermissionById(permissionId).toDto())
    }

    private fun Permission.toDto() = PermissionDto(
        id = id,
        name = name
    )
}
