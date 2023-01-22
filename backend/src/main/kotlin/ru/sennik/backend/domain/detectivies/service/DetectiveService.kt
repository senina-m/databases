package ru.sennik.backend.domain.detectivies.service

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import ru.sennik.backend.domain.creatures.service.CreatureService
import ru.sennik.backend.domain.customers.service.CustomerService
import ru.sennik.backend.domain.detectivies.model.Detective
import ru.sennik.backend.domain.detectivies.repository.DetectiveRepository
import ru.sennik.backend.generated.controller.NotFoundException
import ru.sennik.backend.rest.exception.AlreadyExistException
import javax.transaction.Transactional

/**
 * @author Natalia Nikonova
 */
@Service
class DetectiveService(
   private val repository: DetectiveRepository,
   private val positionService: PositionService,
   private val creatureService: CreatureService,
) {
   @Autowired
   private lateinit var customerService: CustomerService

   fun getDetectives(): List<Detective> = repository.findAll()

   fun getDetectiveById(id: Long) = repository.findByIdOrNull(id)
      ?: throw NotFoundException("Детектив c id=$id не найден")

   fun getDetectiveByCreatureId(creatureId: Long) = repository.findByCreatureId(creatureId)
      ?: throw NotFoundException("Существо с id=$creatureId не является детективом")

   @Transactional
   fun createDetective(creatureId: Long, positionName: String): Detective = repository.save(
         Detective(
            creature = creatureService.getCreatureById(creatureId),
            position = positionService.getPositionByName(positionName)
         ).also { checkExistsByCreatureId(creatureId) }
      )

   @Transactional
   fun updateDetective(id: Long, positionName: String): Detective =
      getDetectiveById(id).apply {
         if (position.name != positionName) {
            position = positionService.getPositionByName(positionName)
         }
      }

   @Transactional
   fun deleteDetective(id: Long) {
      getDetectiveById(id).also {
         customerService.deleteCustomerByCreatureIdIfExists(it.creature.id!!)
         repository.delete(it)
      }
   }

   private fun checkExistsByCreatureId(creatureId: Long) {
      repository.findByCreatureId(creatureId)
         ?.let { throw AlreadyExistException("Существо с id=$creatureId уже является детективом") }
   }
}
