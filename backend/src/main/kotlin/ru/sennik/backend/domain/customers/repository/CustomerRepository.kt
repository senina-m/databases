package ru.sennik.backend.domain.customers.repository;

import org.springframework.data.jpa.repository.JpaRepository
import ru.sennik.backend.domain.customers.model.Customer

interface CustomerRepository : JpaRepository<Customer, Long> {
    fun findByName(name: String): Customer?
}
