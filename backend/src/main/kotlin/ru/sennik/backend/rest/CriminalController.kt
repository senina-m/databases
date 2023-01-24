package ru.sennik.backend.rest

import io.swagger.v3.oas.annotations.security.SecurityRequirement
import mu.KLogging
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.RestController
import ru.sennik.backend.domain.criminal.model.Criminal
import ru.sennik.backend.domain.criminal.service.CriminalService
import ru.sennik.backend.generated.controller.CriminalsApi
import ru.sennik.backend.generated.dto.BooleanResponseDto
import ru.sennik.backend.generated.dto.CreatureDto
import ru.sennik.backend.generated.dto.CriminalRequestDto
import ru.sennik.backend.generated.dto.CriminalResponseDto
import ru.sennik.backend.generated.dto.IsProvedObjectDto
import ru.sennik.backend.utils.createdResponseEntity
import ru.sennik.backend.utils.successDeleteDto

/**
 * @author Natalia Nikonova
 */
@SecurityRequirement(name="Authorization")
@RestController
class CriminalController(
   private val criminalService: CriminalService
) : CriminalsApi {
   override fun getCriminals(crimeId: Long, isProved: Boolean?): ResponseEntity<List<CriminalResponseDto>> {
      logger.info { "request received: getCriminals: crimeId=$crimeId" }
      return ResponseEntity.ok(criminalService.getAllCriminalsByCrime(crimeId).map { it.toDto() })
   }

   override fun getCriminal(crimeId: Long, criminalId: Long): ResponseEntity<CriminalResponseDto> {
      logger.info { "request received: getCriminal: crimeId=$crimeId, criminalId=$criminalId" }
      return ResponseEntity.ok(criminalService.getCriminal(crimeId, criminalId).toDto())
   }

   override fun createCriminal(
      crimeId: Long,
      criminalRequestDto: CriminalRequestDto
   ): ResponseEntity<CriminalResponseDto> {
      logger.info { "request received: createCriminal: crimeId=$crimeId, dto=$criminalRequestDto" }
      return createdResponseEntity(
         criminalService.createCriminal(crimeId, criminalRequestDto.creatureId, criminalRequestDto.isProved).toDto()
      )
   }

   override fun updateCriminal(
      crimeId: Long,
      criminalId: Long,
      isProvedObjectDto: IsProvedObjectDto
   ): ResponseEntity<CriminalResponseDto> {
      logger.info { "request received: getCriminal: crimeId=$crimeId, criminalId=$criminalId" }
      return ResponseEntity.ok(criminalService.updateCriminal(crimeId, criminalId, isProvedObjectDto.isProved).toDto())
   }

   override fun deleteCriminal(crimeId: Long, criminalId: Long): ResponseEntity<BooleanResponseDto> {
      logger.info { "request received: deleteCriminal: crimeId=$crimeId, criminalId=$criminalId" }
      criminalService.deleteCriminal(crimeId, criminalId)
      return successDeleteDto()
   }

   private fun Criminal.toDto() = CriminalResponseDto(
      id = id!!,
      isProved = isProved,
      creature = CreatureDto(
         id = creature.id,
         name = creature.name,
         birthday = creature.birthday,
         deathDate = creature.deathDate,
         race = creature.race,
         sex = creature.sex
      )
   )

   companion object: KLogging()
}
