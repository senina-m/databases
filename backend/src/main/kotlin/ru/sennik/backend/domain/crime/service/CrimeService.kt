package ru.sennik.backend.domain.crime.service

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.repository.findByIdOrNull
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Service
import ru.sennik.backend.domain.crime.model.Crime
import ru.sennik.backend.domain.crime.model.Dosseir
import ru.sennik.backend.domain.crime.repository.CrimeRepository
import ru.sennik.backend.domain.crime.repository.DosseirRepository
import ru.sennik.backend.domain.customers.service.CustomerService
import ru.sennik.backend.domain.detectivies.service.DetectiveService
import ru.sennik.backend.domain.location.service.LocationService
import ru.sennik.backend.generated.controller.NotFoundException
import ru.sennik.backend.rest.exception.AlreadyExistException
import javax.transaction.Transactional

/**
 * @author Natalia Nikonova
 */
@Service
class CrimeService(
   private val locationService: LocationService,
   private val repository: CrimeRepository,
   private val dosseirRepository: DosseirRepository,
   private val customerService: CustomerService,
) {
   @org.springframework.context.annotation.Lazy
   @Autowired
   private lateinit var detectiveService: DetectiveService
   fun getCrimes(): List<Dosseir> = dosseirRepository.findAll()

   fun getCrimesByMainDetectiveId(id: Long): List<Crime> = repository.findAllByMainDetectiveId(id)

   fun getCrimeById(crimeId: Long): Dosseir = dosseirRepository.findByCrimeId(crimeId)
      ?: throw NotFoundException("Преступление с id=$crimeId не найдено")

   @Transactional
   fun createCrime(crime: Crime): Dosseir {
      crime.apply {
         location = locationService.findOrSave(location.name)
         detectiveService.getDetectiveById(mainDetectiveId)
      }
      checkUniqueTitle(crime.title)
      val dosseir = Dosseir(
         crime = repository.save(crime),
         author = customerService.getCustomerCreatureByName(SecurityContextHolder.getContext().authentication.name)
      )
      return dosseirRepository.save(dosseir)
   }

   @Transactional
   fun updateCrime(id: Long, crime: Crime): Dosseir =
      getCrimeById(id).apply {
         this.crime.apply {
            if (location.name != crime.location.name) {
               location = locationService.findOrSave(crime.location.name)
            }
            if (mainDetectiveId != crime.mainDetectiveId) {
               detectiveService.getDetectiveById(crime.mainDetectiveId)
               mainDetectiveId = crime.mainDetectiveId
            }
            if (title != crime.title) {
               checkUniqueTitle(crime.title)
               title = crime.title
            }
            description = crime.description
            dateBegin = crime.dateBegin
            dateEnd = crime.dateEnd
            isSolved = crime.isSolved
            damageDescription = crime.description
         }
      }

   @Transactional
   fun deleteCrime(crimeId: Long) {
      getById(crimeId).also { repository.delete(it) }
   }

   private fun getById(id: Long) = repository.findByIdOrNull(id)
      ?: throw NotFoundException("Преступление с id=$id не найдено")

   private fun checkUniqueTitle(title: String) {
      repository.findByTitle(title)
         ?.let { throw AlreadyExistException("Преступление с названием $title уже существует") }
   }
}
