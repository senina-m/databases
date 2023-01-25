package ru.sennik.backend.config

import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType
import io.swagger.v3.oas.annotations.security.SecurityScheme
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpMethod
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.builders.WebSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.servlet.HandlerExceptionResolver
import ru.sennik.backend.domain.customers.enums.PermissionType
import ru.sennik.backend.domain.customers.service.CustomerService
import ru.sennik.backend.security.JwtTokenService


/**
 * @author Natalia Nikonova
 */
@Configuration
@EnableWebSecurity
@SecurityScheme(
    name = "Authorization",
    type = SecuritySchemeType.HTTP,
    scheme = "bearer",
    bearerFormat = "JWT",
    `in` = SecuritySchemeIn.HEADER
)
class SecurityConfig(
    private val userDetailsService: CustomerService,
    private val jwtTokenService: JwtTokenService,
    @Qualifier("handlerExceptionResolver")
    private val resolver: HandlerExceptionResolver,
) : WebSecurityConfigurerAdapter() {

    override fun configure(web: WebSecurity?) {
        web?.ignoring()?.antMatchers("/swagger-ui/**", "/v3/api-docs/**")
    }

    override fun configure(http: HttpSecurity?) {
        if (http != null) {
            val corsConfiguration = CorsConfiguration()
            corsConfiguration.allowedHeaders = listOf("Authorization", "Cache-Control", "Content-Type")
            //corsConfiguration.allowedOrigins = listOf("*")
            corsConfiguration.allowedOriginPatterns = listOf("*")
            corsConfiguration.allowedMethods = listOf("GET", "POST", "PUT", "DELETE", "PUT","OPTIONS","PATCH", "DELETE")
            corsConfiguration.allowCredentials = true
            corsConfiguration.exposedHeaders = listOf("Authorization")
            http.httpBasic().disable()
            http.csrf().disable()
            http.cors().configurationSource { corsConfiguration }
            http.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)

            http
                .authorizeRequests()
                .antMatchers("/swagger-ui/**").permitAll()
                .antMatchers("/api/v1/auth").not().fullyAuthenticated()
                .antMatchers(HttpMethod.POST, "/api/v1/**").hasRole(PermissionType.ROLE_WRITER.role)
                .antMatchers(HttpMethod.PUT, "/api/v1/**").hasRole(PermissionType.ROLE_WRITER.role)
                .antMatchers(HttpMethod.DELETE, "/api/v1/**").hasRole(PermissionType.ROLE_WRITER.role)
                .antMatchers(HttpMethod.GET, "/api/v1/detectives/{detectiveId:\\d+}/salary/**").hasRole(PermissionType.ROLE_DETECTIVE.role)
                .antMatchers(HttpMethod.GET, "/api/v1/magicAmount").hasRole(PermissionType.ROLE_DETECTIVE.role)
                .antMatchers(HttpMethod.GET, "/api/v1/customers").hasRole(PermissionType.ROLE_WRITER.role)
                .antMatchers(HttpMethod.GET, "/api/v1/customers/**").hasRole(PermissionType.ROLE_WRITER.role)
                .anyRequest().authenticated()
            http.apply(JwtFilterConfig(jwtTokenService, resolver))
        }
    }

    override fun configure(auth: AuthenticationManagerBuilder?) {
        auth?.userDetailsService(userDetailsService)?.passwordEncoder(passwordEncoder())
    }

    @Bean
    override fun authenticationManagerBean(): AuthenticationManager {
        return super.authenticationManagerBean()
    }

    @Bean
    fun passwordEncoder(): PasswordEncoder {
        return BCryptPasswordEncoder()
    }
}
