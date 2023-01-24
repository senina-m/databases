package ru.sennik.backend.domain.criminal.repository

import org.springframework.data.jpa.repository.JpaRepository
import ru.sennik.backend.domain.criminal.model.Criminal

interface CriminalRepository : JpaRepository<Criminal, Long> {
    fun findAllByCrimeId(crimeId: Long): List<Criminal>

    fun findByCrimeIdAndCreatureId(crimeId: Long, creatureId: Long): Criminal?
}
