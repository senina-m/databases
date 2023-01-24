package ru.sennik.backend.security

import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.BadCredentialsException
import org.springframework.security.authentication.InternalAuthenticationServiceException
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Service
import ru.sennik.backend.domain.customers.service.CustomerService
import ru.sennik.backend.generated.dto.AuthRequestDto
import ru.sennik.backend.generated.dto.AuthResponseDto
import ru.sennik.backend.rest.exception.WrongPasswordException

/**
 * @author Natalia Nikonova
 */
@Service
class AuthorizationService(
    private val jwtTokenService: JwtTokenService,
    private val authenticationManager: AuthenticationManager,
    private val customerService: CustomerService,
) {
    fun login(dto: AuthRequestDto): AuthResponseDto {
        try {
            val authentication = authenticationManager.authenticate(UsernamePasswordAuthenticationToken(dto.name, dto.password))
            SecurityContextHolder.getContext().authentication = authentication
            val customerCreature = customerService.getCustomerCreatureByName(dto.name)
            val token = jwtTokenService.createToken(customerCreature.customer.id!!, dto.name)
            return AuthResponseDto(
                name = dto.name,
                permission = customerCreature.customer.permission.name.value,
                token = token,
                creatureId = customerCreature.creatureId
            )
        } catch (ex: BadCredentialsException) {
            throw WrongPasswordException(dto.name)
        } catch (ex: InternalAuthenticationServiceException) {
            throw ex.cause ?: ex
        }
    }
}
