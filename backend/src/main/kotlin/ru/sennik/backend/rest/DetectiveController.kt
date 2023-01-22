package ru.sennik.backend.rest

import mu.KLogging
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.RestController
import ru.sennik.backend.domain.detectivies.model.Detective
import ru.sennik.backend.domain.detectivies.service.DetectiveService
import ru.sennik.backend.generated.controller.DetectivesApi
import ru.sennik.backend.generated.dto.CreatureDto
import ru.sennik.backend.generated.dto.DetectiveRequestDto
import ru.sennik.backend.generated.dto.DetectiveResponseDto

/**
 * @author Natalia Nikonova
 */
@RestController
class DetectiveController(
    private val detectiveService: DetectiveService
) : DetectivesApi {

    override fun getDetectives(): ResponseEntity<List<DetectiveResponseDto>> {
        logger.info { "request received: getDetectives" }
        return ResponseEntity.ok(detectiveService.getDetectives().map { it.toDto() })
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

    override fun deleteDetective(detectiveId: Long): ResponseEntity<Boolean> {
        logger.info { "request received: deleteDetective: id=$detectiveId" }
        detectiveService.deleteDetective(detectiveId)
        return ResponseEntity.ok(true)
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
