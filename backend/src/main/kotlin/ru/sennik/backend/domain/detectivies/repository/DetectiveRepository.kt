package ru.sennik.backend.domain.detectivies.repository

import org.springframework.data.jpa.repository.JpaRepository
import ru.sennik.backend.domain.detectivies.model.Detective

interface DetectiveRepository : JpaRepository<Detective, Long> {
    fun findByCreatureId(creatureId: Long): Detective?
}
