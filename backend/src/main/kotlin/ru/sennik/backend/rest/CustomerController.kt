package ru.sennik.backend.rest

import mu.KLogging
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.RestController
import ru.sennik.backend.domain.customers.enums.PermissionType.Companion.toPermissionType
import ru.sennik.backend.domain.customers.model.Customer
import ru.sennik.backend.domain.customers.model.CustomerCreature
import ru.sennik.backend.domain.customers.model.Permission
import ru.sennik.backend.domain.customers.service.CustomerService
import ru.sennik.backend.generated.controller.CustomersApi
import ru.sennik.backend.generated.dto.AuthRequestDto
import ru.sennik.backend.generated.dto.AuthResponseDto
import ru.sennik.backend.generated.dto.CustomerDto
import ru.sennik.backend.security.AuthorizationService
import ru.sennik.backend.utils.createdResponseEntity

/**
 * @author Natalia Nikonova
 */
@RestController
class CustomerController(
    private val customerService: CustomerService,
    private val authService: AuthorizationService,
) : CustomersApi {

    override fun authorization(authRequestDto: AuthRequestDto): ResponseEntity<AuthResponseDto> {
        logger.info { "request received: authorization: login=${authRequestDto.name}" }
        return ResponseEntity.ok(authService.login(authRequestDto))
    }
    override fun getCustomers(): ResponseEntity<List<CustomerDto>> {
        logger.info { "request received: getCustomers" }
        return ResponseEntity.ok(customerService.getCustomersWithCreaturesId().map { it.toDto() })
    }

    override fun getCustomer(customerId: Long): ResponseEntity<CustomerDto> {
        logger.info { "request received: getCustomer: customerId=$customerId" }
        return ResponseEntity.ok(customerService.getCustomerWithCreatureId(customerId).toDto())
    }

    override fun createCustomer(customerDto: CustomerDto): ResponseEntity<CustomerDto> {
        logger.info { "request received: createCustomer: dto=$customerDto" }
        return createdResponseEntity(customerService.createCustomer(toEntity(customerDto)).toDto())
    }

    override fun updateCustomer(customerId: Long, customerDto: CustomerDto): ResponseEntity<CustomerDto> {
        logger.info { "request received: updateCustomer: customerId=$customerId, dto=$customerDto" }
        return ResponseEntity.ok(customerService.updateCustomer(customerId, toEntity(customerDto)).toDto())
    }

    override fun deleteCustomer(customerId: Long): ResponseEntity<Boolean> {
        logger.info { "request received: deleteCustomer: customerId=$customerId" }
        customerService.deleteCustomer(customerId)
        return ResponseEntity.ok(true)
    }

    private fun CustomerCreature.toDto() = CustomerDto(
        id = customer.id,
        name = customer.name,
        password = customer.password,
        permission = customer.permission.name.value,
        creatureId = creatureId
    )

    private fun toEntity(dto: CustomerDto) = CustomerCreature(
        creatureId = dto.creatureId,
        customer = Customer(
            name = dto.name,
            password = dto.password,
            permission = Permission(dto.permission.toPermissionType())
        )
    )

    companion object: KLogging()
}
