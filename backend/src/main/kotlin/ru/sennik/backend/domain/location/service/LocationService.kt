package ru.sennik.backend.domain.location.service

import org.springframework.stereotype.Service
import ru.sennik.backend.domain.location.model.Location
import ru.sennik.backend.domain.location.repository.LocationRepository
import javax.transaction.Transactional

/**
 * @author Natalia Nikonova
 */
@Service
class LocationService(
   private val repository: LocationRepository
) {

   @Transactional
   fun findOrSave(name: String): Location =
      repository.findByName(name)
         ?: repository.save(Location(name))
}
