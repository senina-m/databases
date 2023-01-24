package ru.sennik.backend.domain.detectivies.repository

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import ru.sennik.backend.domain.detectivies.model.Detective

interface DetectiveRepository : JpaRepository<Detective, Long> {
    fun findByCreatureId(creatureId: Long): Detective?

    @Query(
        nativeQuery = true,
        value = """
            select count_salary(cast(:dateBegin as date), cast(:dateEnd as date), :id)
        """
    )
    fun findSalary(id: Long, dateBegin: String, dateEnd: String): Long
}
