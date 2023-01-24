package ru.sennik.backend.domain.magic.used.repository

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import ru.sennik.backend.domain.magic.used.model.UsedMagic

interface UsedMagicRepository : JpaRepository<UsedMagic, Long> {
    @Query(
        nativeQuery = true,
        value = """
            select count_world_heart_damage_per_dates(cast(:dateBegin as date), cast(:dateEnd as date))
        """
    )
    fun findMagicAmount(dateBegin: String, dateEnd: String): Long?
}
