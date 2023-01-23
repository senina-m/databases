package ru.sennik.backend.security

import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.BadCredentialsException
import org.springframework.security.authentication.InternalAuthenticationServiceException
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.crypto.password.PasswordEncoder
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
            val customer = customerService.getCustomerByName(dto.name)
            val token = jwtTokenService.createToken(customer.id!!, dto.name)
            return AuthResponseDto(name = dto.name, permission = customer.permission.name.value, token = token)
        } catch (ex: BadCredentialsException) {
            throw WrongPasswordException(dto.name)
        } catch (ex: InternalAuthenticationServiceException) {
            throw ex.cause ?: ex
        }
    }
}
