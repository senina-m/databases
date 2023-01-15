package ru.sennik.backend.domain.customers.service

import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.stereotype.Service
import ru.sennik.backend.domain.creatures.service.CreatureService
import ru.sennik.backend.domain.customers.model.CustomerCreature
import ru.sennik.backend.domain.customers.repository.CustomerCreatureRepository
import ru.sennik.backend.domain.customers.repository.CustomerRepository
import ru.sennik.backend.generated.controller.NotFoundException
import ru.sennik.backend.rest.exception.AlreadyExistException
import javax.transaction.Transactional

/**
 * @author Natalia Nikonova
 */
@Service
class CustomerService(
   private val customerRepository: CustomerRepository,
   private val customerCreatureRepository: CustomerCreatureRepository,
   private val permissionService: PermissionService,
   private val creatureService: CreatureService,
) : UserDetailsService {
   override fun loadUserByUsername(username: String?): UserDetails {
      return username?.let { customerRepository.findByName(username) }
         ?: throw NotFoundException("Пользователь с именем $username не найден")
   }

   fun getCustomersWithCreaturesId(): List<CustomerCreature> = customerCreatureRepository.findAll()

   fun getCustomerWithCreatureId(customerId: Long): CustomerCreature =
      customerCreatureRepository.findByCustomerId(customerId)
         ?: throw NotFoundException("Пользователь с id=$customerId не найден")

   @Transactional
   fun createCustomer(customerCreature: CustomerCreature): CustomerCreature {
      checkExistsByName(customerCreature)
      checkExistsByCreatureId(customerCreature.creatureId)
      customerCreature.customer.permission =
         permissionService.getPermissionByName(customerCreature.customer.permission.name)
      creatureService.getCreatureById(customerCreature.creatureId) // todo шифрование пароля и проверка детектива
      return customerCreatureRepository.save(customerCreature.apply { customer = customerRepository.save(customer) })
   }

   fun updateCustomer(customerId: Long, new: CustomerCreature): CustomerCreature =
      getCustomerWithCreatureId(customerId).apply {
         if (customer.name != new.customer.name) {
            checkExistsByName(new)
         }
      }

   private fun checkExistsByName(customerCreature: CustomerCreature) {
      customerCreature.customer.name.let { name ->
         customerRepository.findByName(name)
            ?.let { throw AlreadyExistException("Пользователь с логином $it уже существует") }
      }
   }

   private fun checkExistsByCreatureId(creatureId: Long)  {
      customerCreatureRepository.findByCreatureId(creatureId)
         ?.let { throw AlreadyExistException("Пользователь для сущетсва с id=$creatureId уже существует") }
   }
}
