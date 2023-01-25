package ru.sennik.backend.domain.crime.repository

import org.springframework.data.jpa.repository.JpaRepository
import ru.sennik.backend.domain.crime.model.Crime

interface CrimeRepository : JpaRepository<Crime, Long> {
    fun findByTitle(title: String): Crime?

    fun findAllByMainDetectiveId(mainDetectiveId: Long): List<Crime>
}
