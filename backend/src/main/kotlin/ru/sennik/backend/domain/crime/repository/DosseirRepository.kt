package ru.sennik.backend.domain.crime.repository

import org.springframework.data.jpa.repository.JpaRepository
import ru.sennik.backend.domain.crime.model.Dosseir

interface DosseirRepository : JpaRepository<Dosseir, Long> {
    fun findByCrimeId(crimeId: Long): Dosseir?
}
