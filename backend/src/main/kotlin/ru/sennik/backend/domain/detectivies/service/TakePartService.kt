package ru.sennik.backend.domain.detectivies.service

import org.springframework.stereotype.Service
import ru.sennik.backend.domain.crime.service.CrimeService
import ru.sennik.backend.domain.detectivies.model.TakePart
import ru.sennik.backend.domain.detectivies.repository.TakePartRepository
import ru.sennik.backend.generated.controller.NotFoundException
import ru.sennik.backend.rest.exception.AlreadyExistException
import javax.transaction.Transactional

/**
 * @author Natalia Nikonova
 */
@Service
class TakePartService(
   private val repository: TakePartRepository,
   private val detectiveService: DetectiveService,
   private val crimeService: CrimeService,
) {
   fun getAllTakePartDetectives(crimeId: Long) = repository.findByCrimeId(crimeId).also {
      if (it.isEmpty()) {
         crimeService.getCrimeById(crimeId)
      }
   }

   fun getTakePartDetective(crimeId: Long, detectiveId: Long) =
      repository.findByCrimeIdAndDetectiveId(crimeId, detectiveId)
         ?: throw NotFoundException("Детектив с id=$detectiveId не участвовал в раскрытии преступления с id=$crimeId, или их не существует")

   @Transactional
   fun createTakePart(crimeId: Long, detectiveId: Long): TakePart =
      repository.findByCrimeIdAndDetectiveId(crimeId, detectiveId)
         ?.let {
            throw AlreadyExistException(
               "Детектив с id=$detectiveId уже принимает участие в раскрытии преступления с id=$crimeId"
            )
         }
         ?: repository.save(
            TakePart(
               detective = detectiveService.getDetectiveById(detectiveId),
               crimeId = crimeId.also { crimeService.getCrimeById(crimeId) })
         )

   @Transactional
   fun deleteTakePart(crimeId: Long, detectiveId: Long) {
      getTakePartDetective(crimeId, detectiveId).also { repository.delete(it) }
   }
}
