package ru.sennik.backend.rest

import io.swagger.v3.oas.annotations.security.SecurityRequirement
import mu.KLogging
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.RestController
import ru.sennik.backend.domain.creatures.service.CreatureService
import ru.sennik.backend.domain.crime.model.Crime
import ru.sennik.backend.domain.crime.model.Dosseir
import ru.sennik.backend.domain.crime.service.CrimeService
import ru.sennik.backend.domain.detectivies.model.TakePart
import ru.sennik.backend.domain.detectivies.service.TakePartService
import ru.sennik.backend.domain.location.model.Location
import ru.sennik.backend.generated.controller.CrimesApi
import ru.sennik.backend.generated.dto.BooleanResponseDto
import ru.sennik.backend.generated.dto.CreatureDto
import ru.sennik.backend.generated.dto.CrimeDto
import ru.sennik.backend.generated.dto.DetectiveIdObjectDto
import ru.sennik.backend.generated.dto.DetectiveResponseDto
import ru.sennik.backend.utils.createdResponseEntity
import ru.sennik.backend.utils.successDeleteDto

/**
 * @author Natalia Nikonova
 */
@SecurityRequirement(name="Authorization")
@RestController
class CrimeController(
    private val crimeService: CrimeService,
    private val creatureService: CreatureService,
    private val takePartService: TakePartService,
) : CrimesApi {

    override fun getCrimes(
        description: String?,
        mainDetectiveId: Long?,
        takePartDetectiveId: Long?,
        creatureId: Long?
    ): ResponseEntity<List<CrimeDto>> {
        logger.info { "request received: getCrimes" }
        return ResponseEntity.ok(crimeService.getCrimes().map { it.toDto() })
    }

    override fun getCrime(crimeId: Long): ResponseEntity<CrimeDto> {
        logger.info { "request received: getCrime" }
        return ResponseEntity.ok(crimeService.getCrimeById(crimeId).toDto())
    }

    override fun createCrime(crimeDto: CrimeDto): ResponseEntity<CrimeDto> {
        logger.info { "request received: createCrime: dto=$crimeDto" }
        return createdResponseEntity(crimeService.createCrime(toEntity(crimeDto)).toDto())
    }

    override fun updateCrime(crimeId: Long, crimeDto: CrimeDto): ResponseEntity<CrimeDto> {
        logger.info { "request received: createCrime: id=$crimeId dto=$crimeDto" }
        return ResponseEntity.ok(crimeService.updateCrime(crimeId, toEntity(crimeDto)).toDto())
    }

    override fun deleteCrime(crimeId: Long): ResponseEntity<BooleanResponseDto> {
        logger.info { "request received: deleteCrime: id=$crimeId" }
        crimeService.deleteCrime(crimeId)
        return successDeleteDto()
    }

    override fun getTakePartDetectives(crimeId: Long): ResponseEntity<List<DetectiveResponseDto>> {
        logger.info { "request received: getTakePartDetectives: crimeId=$crimeId" }
        return ResponseEntity.ok(takePartService.getAllTakePartDetectives(crimeId).map { it.toDto() })
    }

    override fun getTakePartDetective(crimeId: Long, detectiveId: Long): ResponseEntity<DetectiveResponseDto> {
        logger.info { "request received: getTakePartDetective: crimeId=$crimeId detectiveId=$detectiveId" }
        return ResponseEntity.ok(takePartService.getTakePartDetective(crimeId, detectiveId).toDto())
    }

    override fun createTakePartDetective(
        crimeId: Long,
        detectiveIdObjectDto: DetectiveIdObjectDto
    ): ResponseEntity<DetectiveResponseDto> {
        logger.info { "request received: createTakePartDetective: crimeId=$crimeId detectiveId=$detectiveIdObjectDto" }
        return createdResponseEntity(takePartService.createTakePart(crimeId, detectiveIdObjectDto.detectiveId).toDto())
    }

    override fun deleteTakePartDetective(crimeId: Long, detectiveId: Long): ResponseEntity<BooleanResponseDto> {
        logger.info { "request received: deleteTakePartDetective: crimeId=$crimeId detectiveId=$detectiveId" }
        takePartService.deleteTakePart(crimeId, detectiveId)
        return successDeleteDto()
    }

    private fun toEntity(dto: CrimeDto) = Crime(
        title = dto.title,
        description = dto.description,
        dateBegin = dto.dateBegin,
        mainDetectiveId = dto.mainDetectiveId,
        isSolved = dto.isSolved,
        location = Location(dto.location)
    ).apply {
        dateEnd = dto.dateEnd
        damageDescription = dto.damageDescription
    }

    private fun Dosseir.toDto() = CrimeDto(
        id = crime.id,
        author = creatureService.getCreatureById(author.creatureId).name,
        createDate = createDate,
        title = crime.title,
        description = crime.description,
        dateBegin = crime.dateBegin,
        isSolved = crime.isSolved,
        location = crime.location.name,
        mainDetectiveId = crime.mainDetectiveId,
        dateEnd = crime.dateEnd,
        damageDescription = crime.damageDescription
    )

    private fun TakePart.toDto() = DetectiveResponseDto(
        id = detective.id,
        position = detective.position.name,
        creature = CreatureDto(
            id = detective.creature.id,
            name = detective.creature.name,
            birthday = detective.creature.birthday,
            race = detective.creature.race,
            sex = detective.creature.sex,
            deathDate = detective.creature.deathDate
        )
    )

    companion object: KLogging()
}
