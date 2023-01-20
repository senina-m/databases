package ru.sennik.backend.domain.detectivies.service

import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import ru.sennik.backend.domain.detectivies.model.Position
import ru.sennik.backend.domain.detectivies.repository.PositionRepository
import ru.sennik.backend.generated.controller.NotFoundException
import ru.sennik.backend.rest.exception.AlreadyExistException
import javax.transaction.Transactional

/**
 * @author Natalia Nikonova
 */
@Service
class PositionService(
   private val repository: PositionRepository
) {
   fun getPositions(): List<Position> = repository.findAll()

   fun getPositionById(id: Int) = repository.findByIdOrNull(id)
      ?: throw NotFoundException("Должность с id=$id не найдена")

   fun getPositionByName(name: String) = repository.findByName(name)
      ?: throw NotFoundException("Должность $name не найдена")

   @Transactional
   fun createPosition(position: Position): Position {
      checkUniqueName(position.name)
      return repository.save(position)
   }

   @Transactional
   fun updatePosition(id: Int, new: Position) =
      getPositionById(id).apply {
         checkUniqueName(new.name)
         name = new.name
      }

   @Transactional
   fun deletePosition(id: Int) =
      getPositionById(id).also { repository.delete(it) }

   fun checkUniqueName(name: String) = repository.findByName(name)
      ?.let { throw AlreadyExistException("Должность $name уже существует") }
}
