package ru.sennik.backend.domain.detectivies.repository;

import org.springframework.data.jpa.repository.JpaRepository
import ru.sennik.backend.domain.detectivies.model.Position

interface PositionRepository : JpaRepository<Position, Int> {
}
