package ru.sennik.backend.domain.location.repository

import org.springframework.data.jpa.repository.JpaRepository
import ru.sennik.backend.domain.location.model.Location

interface LocationRepository : JpaRepository<Location, Int> {
    fun findByName(name: String): Location?
}
