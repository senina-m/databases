package ru.sennik.backend.domain.magic.used.service

import org.springframework.stereotype.Service
import ru.sennik.backend.domain.magic.used.repository.UsedMagicRepository
import ru.sennik.backend.rest.exception.ClientException
import java.time.LocalDate

/**
 * @author Natalia Nikonova
 */
@Service
class UsedObviousMagicService(
   private val usedRepository: UsedMagicRepository
) {

   fun getMagicAmount(dateBegin: LocalDate, dateEnd: LocalDate): Long {
      if (dateEnd <= dateBegin)
         throw ClientException("Некорректный период: дата конца $dateEnd не может быть меньше или равен $dateBegin")
      return usedRepository.findMagicAmount(dateBegin.toString(), dateEnd.toString()) ?: 0
   }
}
