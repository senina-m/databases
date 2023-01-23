package ru.sennik.backend.security

import io.jsonwebtoken.Jwts
import io.jsonwebtoken.SignatureAlgorithm
import io.jsonwebtoken.security.Keys
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.Authentication
import org.springframework.stereotype.Service
import ru.sennik.backend.domain.customers.service.CustomerService
import java.util.Date
import javax.servlet.http.HttpServletRequest

/**
 * @author Natalia Nikonova
 */
@Service
class JwtTokenService(
   private val customerService: CustomerService
) {
   fun createToken(id: Long, login: String): String {
      val claims = Jwts.claims().setSubject(id.toString())
      claims["login"] = login
      val now = Date()
      val expiration = Date(now.time + expirationTimeMillis)
      return Jwts.builder()
         .setClaims(claims)
         .setIssuedAt(now)
         .setExpiration(expiration)
         .signWith(key)
         .compact()
   }

   fun getCustomerIdByToken(token: String): Long =
      Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).body.subject.toLong()

   fun validateToken(token: String): Boolean =
      runCatching { getCustomerIdByToken(token) }.isSuccess

   fun resolveToken(req: HttpServletRequest): String? = req.getHeader("Authorization")
         ?.takeIf { it.startsWith("Bearer ") }
         ?.run { substring(7) }

   fun getAuthentication(token: String): Authentication {
      val userDetails = customerService.loadUserByUsername(customerService.getCustomer(getCustomerIdByToken(token)).name)
      return UsernamePasswordAuthenticationToken(userDetails, "", userDetails.authorities)
   }

   companion object {
      private const val expirationTimeMillis = 7_200_000
      private val key = Keys.secretKeyFor(SignatureAlgorithm.HS256);
   }
}
