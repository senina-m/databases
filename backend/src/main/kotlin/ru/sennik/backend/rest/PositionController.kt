package ru.sennik.backend.rest

import io.swagger.v3.oas.annotations.security.SecurityRequirement
import mu.KLogging
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.RestController
import ru.sennik.backend.domain.detectivies.model.Position
import ru.sennik.backend.domain.detectivies.service.PositionService
import ru.sennik.backend.generated.controller.PositionsApi
import ru.sennik.backend.generated.dto.PositionDto
import ru.sennik.backend.utils.createdResponseEntity

/**
 * @author Natalia Nikonova
 */
@SecurityRequirement(name="Authorization")
@RestController
class PositionController(
   private val positionService: PositionService
) : PositionsApi {
   override fun getPositions(): ResponseEntity<List<PositionDto>> {
      logger.info { "request received: getPositions" }
      return ResponseEntity.ok(positionService.getPositions().map { it.toDto() })
   }

   override fun getPosition(positionId: Int): ResponseEntity<PositionDto> {
      logger.info { "request received: getPosition: id=$positionId" }
      return ResponseEntity.ok(positionService.getPositionById(positionId).toDto())
   }

   override fun createPosition(positionDto: PositionDto): ResponseEntity<PositionDto> {
      logger.info { "request received: createPosition: dto=$positionDto" }
      return createdResponseEntity(positionService.createPosition(toEntity(positionDto)).toDto())
   }

   override fun updatePosition(positionId: Int, positionDto: PositionDto): ResponseEntity<PositionDto> {
      logger.info { "request received: updatePosition: id=$positionId, dto=$positionDto" }
      return ResponseEntity.ok(positionService.updatePosition(positionId, toEntity(positionDto)).toDto())
   }

   override fun deletePosition(positionId: Int): ResponseEntity<Boolean> {
      logger.info { "request received: deletePosition: id=$positionId" }
      positionService.deletePosition(positionId)
      return ResponseEntity.ok(true)
   }

   private fun toEntity(dto: PositionDto) = Position(
      name = dto.name
   )

   private fun Position.toDto() = PositionDto(
      id = id,
      name = name
   )

   companion object: KLogging()
}