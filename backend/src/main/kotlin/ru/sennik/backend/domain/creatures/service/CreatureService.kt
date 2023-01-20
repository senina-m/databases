package ru.sennik.backend.domain.creatures.service

import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import ru.sennik.backend.domain.creatures.model.Creature
import ru.sennik.backend.domain.creatures.repository.CreatureRepository
import ru.sennik.backend.generated.controller.NotFoundException
import javax.transaction.Transactional

/**
 * @author Natalia Nikonova
 */
@Service
class CreatureService(
   private val repository: CreatureRepository
) {
   fun getCreatures(): List<Creature> = repository.findAll()

   fun getCreatureById(id: Long) = repository.findByIdOrNull(id)
      ?: throw NotFoundException("Существо с id=$id не найдено")

   fun createCreature(creature: Creature): Creature = repository.save(creature)

   @Transactional
   fun updateCreature(id: Long, creature: Creature): Creature =
      repository.save(creature.apply { this.id = getCreatureById(id).id })

   @Transactional
   fun deleteCreature(id: Long) {
      getCreatureById(id).also { repository.delete(it) }
   }
}
