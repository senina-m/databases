package ru.sennik.backend.rest

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.RestController
import ru.sennik.backend.domain.customers.model.Customer
import ru.sennik.backend.domain.customers.model.CustomerCreature
import ru.sennik.backend.domain.customers.model.Permission
import ru.sennik.backend.domain.customers.service.CustomerService
import ru.sennik.backend.generated.controller.CustomersApi
import ru.sennik.backend.generated.dto.CustomerDto

/**
 * @author Natalia Nikonova
 */
@RestController
class CustomerController(
    private val customerService: CustomerService
) : CustomersApi {
    override fun getCustomers(): ResponseEntity<List<CustomerDto>> {
        return ResponseEntity.ok(customerService.getCustomersWithCreaturesId().map { it.toDto() })
    }

    override fun getCustomer(customerId: Long): ResponseEntity<CustomerDto> {
        return ResponseEntity.ok(customerService.getCustomerWithCreatureId(customerId).toDto())
    }

    override fun createCustomer(customerDto: CustomerDto): ResponseEntity<CustomerDto> {
        return super.createCustomer(customerDto)
    }

    private fun CustomerCreature.toDto() = CustomerDto(
        id = customer.id,
        name = customer.name,
        password = customer.password,
        permission = customer.permission.name,
        creatureId = creatureId
    )

    private fun toEntity(dto: CustomerDto) = CustomerCreature(
        creatureId = dto.creatureId,
        customer = Customer(
            name = dto.name,
            password = dto.password,
            permission = Permission(dto.permission)
        )
    )
}
