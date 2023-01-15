package ru.sennik.backend.security

import ru.sennik.backend.domain.customers.service.CustomerService

/**
 * @author Natalia Nikonova
 */
class JwtTokenService(
   private val customerService: CustomerService
) {
}
