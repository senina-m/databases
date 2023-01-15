package ru.sennik.backend.domain.creatures.repository;

import org.springframework.data.jpa.repository.JpaRepository
import ru.sennik.backend.domain.creatures.model.Creature

interface CreatureRepository : JpaRepository<Creature, Long> {
}
