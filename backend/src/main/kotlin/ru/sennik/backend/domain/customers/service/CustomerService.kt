package ru.sennik.backend.domain.customers.service

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.repository.findByIdOrNull
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.BadCredentialsException
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import ru.sennik.backend.domain.creatures.service.CreatureService
import ru.sennik.backend.domain.customers.enums.PermissionType
import ru.sennik.backend.domain.customers.model.Customer
import ru.sennik.backend.domain.customers.model.CustomerCreature
import ru.sennik.backend.domain.customers.repository.CustomerCreatureRepository
import ru.sennik.backend.domain.customers.repository.CustomerRepository
import ru.sennik.backend.domain.detectivies.service.DetectiveService
import ru.sennik.backend.generated.controller.NotFoundException
import ru.sennik.backend.generated.dto.AuthRequestDto
import ru.sennik.backend.generated.dto.AuthResponseDto
import ru.sennik.backend.rest.exception.AlreadyExistException
import ru.sennik.backend.rest.exception.WrongPasswordException
import ru.sennik.backend.security.JwtTokenService
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
   @org.springframework.context.annotation.Lazy
   @Autowired
   private lateinit var detectiveService: DetectiveService

   @org.springframework.context.annotation.Lazy
   @Autowired
   private lateinit var passwordEncoder: PasswordEncoder

   override fun loadUserByUsername(username: String?): UserDetails = getCustomerByName(username)

   fun getCustomersWithCreaturesId(): List<CustomerCreature> = customerCreatureRepository.findAll()

   fun getCustomerWithCreatureId(customerId: Long): CustomerCreature =
      customerCreatureRepository.findByCustomerId(customerId)
         ?: throw NotFoundException("Пользователь с id=$customerId не найден")

   fun getCustomer(customerId: Long): Customer =
      customerRepository.findByIdOrNull(customerId)
         ?: throw NotFoundException("Пользователь с id=$customerId не найден")

   fun getCustomerByName(name: String?): Customer {
      return name?.let { customerRepository.findByName(name) }
         ?: throw NotFoundException("Пользователь с именем $name не найден")
   }

   @Transactional
   fun createCustomer(customerCreature: CustomerCreature): CustomerCreature {
      creatureService.getCreatureById(customerCreature.creatureId)
      checkExistsByName(customerCreature)
      checkExistsByCreatureId(customerCreature.creatureId)
      customerCreature.customer.apply {
         permission = permissionService.getPermissionByName(permission.name)
         password = passwordEncoder.encode(password)
      }
      checkDetective(customerCreature)
      return customerCreatureRepository.save(customerCreature.apply { customer = customerRepository.save(customer) })
   }

   @Transactional
   fun updateCustomer(customerId: Long, new: CustomerCreature): CustomerCreature =
      getCustomerWithCreatureId(customerId).apply {
         if (customer.name != new.customer.name) {
            checkExistsByName(new)
            customer.name = new.customer.name
         }
         if (creatureId != new.creatureId) {
            checkExistsByCreatureId(new.creatureId)
            creatureService.getCreatureById(new.creatureId)
            creatureId = new.creatureId
            checkDetective(this)
         }
         if (customer.permission.name != new.customer.permission.name) {
            customer.permission =
               permissionService.getPermissionByName(new.customer.permission.name)
            checkDetective(this)
         }
         customer.password = new.customer.password
      }

   @Transactional
   fun deleteCustomer(customerId: Long) {
      getCustomerWithCreatureId(customerId).apply {
         customerRepository.delete(customer)
      }
   }

   @Transactional
   fun deleteCustomerByCreatureIdIfExists(creatureId: Long) {
      customerCreatureRepository.findByCreatureId(creatureId)?.apply {
         customerRepository.delete(customer)
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

   private fun checkDetective(customerCreature: CustomerCreature) {
      if (customerCreature.customer.permission.name == PermissionType.ROLE_DETECTIVE) {
         detectiveService.getDetectiveByCreatureId(customerCreature.creatureId)
      }
   }
}
