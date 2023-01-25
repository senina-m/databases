package ru.sennik.backend.domain.detectivies.service

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.repository.findByIdOrNull
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Service
import ru.sennik.backend.domain.creatures.service.CreatureService
import ru.sennik.backend.domain.crime.service.CrimeService
import ru.sennik.backend.domain.customers.service.CustomerService
import ru.sennik.backend.domain.detectivies.model.Detective
import ru.sennik.backend.domain.detectivies.repository.DetectiveRepository
import ru.sennik.backend.generated.controller.NotFoundException
import ru.sennik.backend.rest.exception.AlreadyExistException
import ru.sennik.backend.rest.exception.ClientException
import java.time.LocalDate
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
   @org.springframework.context.annotation.Lazy
   @Autowired
   private lateinit var customerService: CustomerService

   @org.springframework.context.annotation.Lazy
   @Autowired
   private lateinit var crimeService: CrimeService

   fun getDetectives(): List<Detective> = repository.findAll()

   fun getDetectivesByCreatureId(creatureId: Long): List<Detective> =
      repository.findByCreatureId(creatureId)?.let { listOf(it) }
         ?: emptyList()

   fun getDetectiveById(id: Long) = repository.findByIdOrNull(id)
      ?: throw NotFoundException("Детектив c id=$id не найден")

   fun getDetectiveByCreatureId(creatureId: Long) = repository.findByCreatureId(creatureId)
      ?: throw ClientException("Существо с id=$creatureId не является детективом")

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
      getDetectiveById(id).also { detective ->
         crimeService.getCrimesByMainDetectiveId(id)
            .takeIf { it.isNotEmpty() }
            ?.let {
               throw ClientException(
                  "Нельзя удалить детектива ${detective.creature.name} так как является ответственным за преступления"
               )
            }
         customerService.deleteCustomerByCreatureIdIfExists(detective.creature.id!!)
         repository.delete(detective)
      }
   }

   @Transactional
   fun calculateSalary(month: Int, year: Int, detectiveId: Long): Long {
      val detective = getDetectiveById(detectiveId)
      val customerName = SecurityContextHolder.getContext().authentication.name
      val creatureId = customerService.getCustomerCreatureByName(customerName).creatureId
      if (detective.creature.id != creatureId) {
         throw ClientException("Любопытство - порок, чужую зарплату смотреть запрещено")
      }
      val dateBegin = LocalDate.of(year, month, 1)
      val dateEnd = dateBegin.plusMonths(1)
      return repository.findSalary(detectiveId, dateBegin.toString(), dateEnd.toString())
   }

   private fun checkExistsByCreatureId(creatureId: Long) {
      repository.findByCreatureId(creatureId)
         ?.let { throw AlreadyExistException("Существо с id=$creatureId уже является детективом") }
   }
}
