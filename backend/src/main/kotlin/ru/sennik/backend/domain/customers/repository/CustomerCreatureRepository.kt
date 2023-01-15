package ru.sennik.backend.domain.customers.repository;

import org.springframework.data.jpa.repository.JpaRepository
import ru.sennik.backend.domain.customers.model.CustomerCreature

interface CustomerCreatureRepository : JpaRepository<CustomerCreature, Long> {
    fun findByCustomerId(customerId: Long): CustomerCreature?

    fun findByCreatureId(creatureId: Long): CustomerCreature?
}
