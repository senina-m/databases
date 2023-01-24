package ru.sennik.backend.domain.criminal.service

import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import ru.sennik.backend.domain.creatures.service.CreatureService
import ru.sennik.backend.domain.crime.service.CrimeService
import ru.sennik.backend.domain.criminal.model.Criminal
import ru.sennik.backend.domain.criminal.repository.CriminalRepository
import ru.sennik.backend.generated.controller.NotFoundException
import ru.sennik.backend.rest.exception.AlreadyExistException
import javax.transaction.Transactional

/**
 * @author Natalia Nikonova
 */
@Service
class CriminalService(
   private val repository: CriminalRepository,
   private val creatureService: CreatureService,
   private val crimeService: CrimeService,
) {
   fun getAllCriminalsByCrime(crimeId: Long) = repository.findAllByCrimeId(crimeId).also {
      if (it.isEmpty()) {
         crimeService.getCrimeById(crimeId)
      }
   }

   fun getCriminal(crimeId: Long, criminalId: Long) = repository
      .findByIdOrNull(criminalId)
      ?.takeIf { it.crimeId == crimeId }
      ?: throw NotFoundException("Преступник с id=$criminalId не найден у преступления с id=$crimeId, или их не существует")

   @Transactional
   fun createCriminal(crimeId: Long, creatureId: Long, isProved: Boolean): Criminal =
      repository.findByCrimeIdAndCreatureId(crimeId, creatureId)?.let {
         throw AlreadyExistException(
            "Существо с id=$creatureId уже является преступником для преступления с id=$crimeId"
         )
      } ?: repository.save(
         Criminal(
            crimeId = crimeId.also { crimeService.getCrimeById(crimeId) },
            isProved = isProved,
            creature = creatureService.getCreatureById(creatureId)
         )
      )

   @Transactional
   fun updateCriminal(crimeId: Long, criminalId: Long, isProved: Boolean): Criminal =
      getCriminal(crimeId, criminalId).apply { this.isProved = isProved }

   @Transactional
   fun deleteCriminal(crimeId: Long, criminalId: Long) {
      getCriminal(crimeId, criminalId).also { repository.delete(it) }
   }
}
