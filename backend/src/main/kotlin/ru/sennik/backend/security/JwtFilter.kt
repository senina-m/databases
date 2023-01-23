package ru.sennik.backend.security

import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.web.util.matcher.AntPathRequestMatcher
import org.springframework.web.filter.OncePerRequestFilter
import org.springframework.web.servlet.HandlerExceptionResolver
import ru.sennik.backend.rest.exception.WrongTokenException
import javax.servlet.FilterChain
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

/**
 * @author Natalia Nikonova
 */
class JwtFilter(
   private val jwtTokenService: JwtTokenService,
   private val resolver: HandlerExceptionResolver,
) : OncePerRequestFilter() {

   override fun doFilterInternal(request: HttpServletRequest, response: HttpServletResponse, filterChain: FilterChain) {
      try {
         if (noFilter.any { it.matches(request) }) {
            filterChain.doFilter(request, response)
         } else {
            val token = jwtTokenService.resolveToken(request)
            token?.let {
               SecurityContextHolder.getContext().authentication = jwtTokenService.getAuthentication(it)
            } ?: throw WrongTokenException("Истекший или несуществующий JWT токен")
         }
      } catch (ex : Exception) {
         resolver.resolveException(request, response, null, ex)
      }
   }

   companion object {
      private val noFilter = listOf(
         AntPathRequestMatcher("/swagger-ui/**"),
         AntPathRequestMatcher("/v3/api-docs/**"),
         AntPathRequestMatcher("/api/v1/auth")
      )
   }
}