package ru.sennik.backend.config

import org.springframework.context.annotation.Configuration
import org.springframework.web.servlet.config.annotation.CorsRegistry
import org.springframework.web.servlet.config.annotation.EnableWebMvc
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer


/**
 * @author Natalia Nikonova
 */
@Configuration
@EnableWebMvc
class WebConfig : WebMvcConfigurer {
   override fun addCorsMappings(registry: CorsRegistry) {
      registry.addMapping("/**")
   }
}
