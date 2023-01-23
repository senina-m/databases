package ru.sennik.backend.config

import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.context.annotation.Configuration
import org.springframework.security.config.annotation.SecurityConfigurerAdapter
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.web.DefaultSecurityFilterChain
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter
import org.springframework.web.servlet.HandlerExceptionResolver
import ru.sennik.backend.security.JwtFilter
import ru.sennik.backend.security.JwtTokenService

/**
 * @author Natalia Nikonova
 */
class JwtFilterConfig(
   private val jwtTokenService: JwtTokenService,
   private val resolver: HandlerExceptionResolver,
) : SecurityConfigurerAdapter<DefaultSecurityFilterChain, HttpSecurity>() {
   override fun configure(builder: HttpSecurity?) {
      val customFilter = JwtFilter(jwtTokenService, resolver)
      builder?.addFilterBefore(customFilter, UsernamePasswordAuthenticationFilter::class.java)
   }
}
