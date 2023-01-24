package ru.sennik.backend.rest

import io.swagger.v3.oas.annotations.security.SecurityRequirement
import mu.KLogging
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.RestController
import ru.sennik.backend.domain.creatures.service.CreatureService
import ru.sennik.backend.domain.crime.model.Crime
import ru.sennik.backend.domain.crime.model.Dosseir
import ru.sennik.backend.domain.crime.service.CrimeService
import ru.sennik.backend.domain.location.model.Location
import ru.sennik.backend.generated.controller.CrimesApi
import ru.sennik.backend.generated.dto.BooleanResponseDto
import ru.sennik.backend.generated.dto.CrimeDto
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

    companion object: KLogging()
}
