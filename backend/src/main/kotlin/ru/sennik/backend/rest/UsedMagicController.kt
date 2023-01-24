package ru.sennik.backend.rest

import io.swagger.v3.oas.annotations.security.SecurityRequirement
import mu.KLogging
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.RestController
import ru.sennik.backend.domain.magic.used.service.UsedObviousMagicService
import ru.sennik.backend.generated.controller.UsedMagicsApi
import ru.sennik.backend.generated.dto.NumberResponseDto
import java.time.LocalDate

/**
 * @author Natalia Nikonova
 */
@SecurityRequirement(name="Authorization")
@RestController
class UsedMagicController(
   private val usedObviousMagicService: UsedObviousMagicService
) : UsedMagicsApi {
   override fun getMagicAmount(dateBegin: LocalDate, dateEnd: LocalDate): ResponseEntity<NumberResponseDto> {
      logger.info { "request received: getMagicAmount: dateBegin=$dateBegin, dateEnd=$dateEnd" }
      return ResponseEntity.ok(NumberResponseDto(usedObviousMagicService.getMagicAmount(dateBegin, dateEnd)))
   }

   companion object: KLogging()
}
