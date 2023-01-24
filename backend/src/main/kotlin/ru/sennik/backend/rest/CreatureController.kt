package ru.sennik.backend.rest

import io.swagger.v3.oas.annotations.security.SecurityRequirement
import mu.KLogging
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.RestController
import ru.sennik.backend.domain.creatures.model.Creature
import ru.sennik.backend.domain.creatures.service.CreatureService
import ru.sennik.backend.generated.controller.CreaturesApi
import ru.sennik.backend.generated.dto.BooleanResponseDto
import ru.sennik.backend.generated.dto.CreatureDto
import ru.sennik.backend.utils.createdResponseEntity
import ru.sennik.backend.utils.successDeleteDto

/**
 * @author Natalia Nikonova
 */
@SecurityRequirement(name="Authorization")
@RestController
class CreatureController(
   private val creatureService: CreatureService
) : CreaturesApi {

   override fun getCreatures(): ResponseEntity<List<CreatureDto>> {
      logger.info { "request received: getCreatures" }
      return ResponseEntity.ok(creatureService.getCreatures().map { it.toDto() })
   }

   override fun getCreature(creatureId: Long): ResponseEntity<CreatureDto> {
      logger.info { "request received: getCreature: id=$creatureId" }
      return ResponseEntity.ok(creatureService.getCreatureById(creatureId).toDto())
   }

   override fun createCreature(creatureDto: CreatureDto): ResponseEntity<CreatureDto> {
      logger.info { "request received: createCreature: dto=$creatureDto" }
      return createdResponseEntity(creatureService.createCreature(toEntity(creatureDto)).toDto())
   }

   override fun updateCreature(creatureId: Long, creatureDto: CreatureDto): ResponseEntity<CreatureDto> {
      logger.info { "request received: updateCreature: id=$creatureId, dto=$creatureDto" }
      return ResponseEntity.ok(creatureService.updateCreature(creatureId, toEntity(creatureDto)).toDto())
   }

   override fun deleteCreature(creatureId: Long): ResponseEntity<BooleanResponseDto> {
      logger.info { "request received: deleteCreature: id=$creatureId" }
      creatureService.deleteCreature(creatureId)
      return successDeleteDto()
   }

   private fun toEntity(dto: CreatureDto) = Creature(
      name = dto.name,
      birthday = dto.birthday,
      race = dto.race,
      sex = dto.sex
   ).apply { deathDate = dto.deathDate }

   private fun Creature.toDto() = CreatureDto(
      id = id,
      name = name,
      birthday = birthday,
      deathDate = deathDate,
      race = race,
      sex = sex
   )

   companion object : KLogging()
}
