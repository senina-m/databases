package ru.sennik.backend.rest

import io.swagger.v3.oas.annotations.security.SecurityRequirement
import mu.KLogging
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.RestController
import ru.sennik.backend.domain.detectivies.model.Detective
import ru.sennik.backend.domain.detectivies.service.DetectiveService
import ru.sennik.backend.generated.controller.DetectivesApi
import ru.sennik.backend.generated.dto.BooleanResponseDto
import ru.sennik.backend.generated.dto.CreatureDto
import ru.sennik.backend.generated.dto.DetectiveRequestDto
import ru.sennik.backend.generated.dto.DetectiveResponseDto
import ru.sennik.backend.generated.dto.NumberResponseDto
import ru.sennik.backend.utils.successDeleteDto

/**
 * @author Natalia Nikonova
 */
@SecurityRequirement(name="Authorization")
@RestController
class DetectiveController(
    private val detectiveService: DetectiveService
) : DetectivesApi {

    override fun getDetectives(creatureId: Long?): ResponseEntity<List<DetectiveResponseDto>> {
        logger.info { "request received: getDetectives" }
        return ResponseEntity.ok(
            (creatureId?.let { detectiveService.getDetectivesByCreatureId(it) }
                ?: detectiveService.getDetectives()).map { it.toDto() }
        )
    }

    override fun getDetective(detectiveId: Long): ResponseEntity<DetectiveResponseDto> {
        logger.info { "request received: getDetective: id=$detectiveId" }
        return ResponseEntity.ok(detectiveService.getDetectiveById(detectiveId).toDto())
    }

    override fun createDetective(detectiveRequestDto: DetectiveRequestDto): ResponseEntity<DetectiveResponseDto> {
        logger.info { "request received: createDetective: dto=$detectiveRequestDto" }
        return ResponseEntity.ok(
            detectiveService.createDetective(detectiveRequestDto.creatureId, detectiveRequestDto.position).toDto()
        )
    }

    override fun updateDetective(detectiveId: Long, body: String): ResponseEntity<DetectiveResponseDto> {
        logger.info { "request received: updateDetective: id=$detectiveId, dto=$body" }
        return ResponseEntity.ok(detectiveService.updateDetective(detectiveId, body).toDto())
    }

    override fun deleteDetective(detectiveId: Long): ResponseEntity<BooleanResponseDto> {
        logger.info { "request received: deleteDetective: id=$detectiveId" }
        detectiveService.deleteDetective(detectiveId)
        return successDeleteDto()
    }

    override fun getDetectiveSalary(detectiveId: Long, year: Int, month: Int): ResponseEntity<NumberResponseDto> {
        logger.info { "request received: deleteDetective: id=$detectiveId" }
        return ResponseEntity.ok(NumberResponseDto(detectiveService.calculateSalary(month, year, detectiveId)))
    }

    private fun Detective.toDto() = DetectiveResponseDto(
        id = id,
        position = position.name,
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
