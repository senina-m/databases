package ru.sennik.backend.domain.customers.repository;

import org.springframework.data.jpa.repository.JpaRepository
import ru.sennik.backend.domain.customers.model.Permission

interface PermissionRepository : JpaRepository<Permission, Int> {
    fun findByName(name: String): Permission?
}
