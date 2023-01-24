package ru.sennik.backend.domain.detectivies.repository

import org.springframework.data.jpa.repository.JpaRepository
import ru.sennik.backend.domain.detectivies.model.TakePart

interface TakePartRepository : JpaRepository<TakePart, Long> {
    fun findByCrimeId(crimeId: Long): List<TakePart>

    fun findByCrimeIdAndDetectiveId(crimeId: Long, detectiveId: Long): TakePart?
}
