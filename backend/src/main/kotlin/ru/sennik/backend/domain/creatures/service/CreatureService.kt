package ru.sennik.backend.domain.creatures.service

import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import ru.sennik.backend.domain.creatures.repository.CreatureRepository
import ru.sennik.backend.generated.controller.NotFoundException

/**
 * @author Natalia Nikonova
 */
@Service
class CreatureService(
   private val repository: CreatureRepository
) {
   fun getCreatureById(id: Long) = repository.findByIdOrNull(id)
      ?: throw NotFoundException("Существо с id=$id не найдено")
}
