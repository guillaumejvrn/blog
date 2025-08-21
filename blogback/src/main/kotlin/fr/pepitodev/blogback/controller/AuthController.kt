package fr.pepitodev.blogback.controller

import fr.pepitodev.blogback.dtos.LoginDTO
import fr.pepitodev.blogback.dtos.MessageKonsole
import fr.pepitodev.blogback.dtos.RegisterDto
import fr.pepitodev.blogback.models.User
import fr.pepitodev.blogback.services.UserService
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.SignatureAlgorithm
import io.jsonwebtoken.security.Keys
import jakarta.servlet.http.HttpServletResponse
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestHeader
import org.springframework.web.bind.annotation.RestController
import java.util.Date
import javax.crypto.SecretKey

@RestController
class AuthController(private val userService: UserService) {

    private val key: SecretKey = Keys.secretKeyFor(SignatureAlgorithm.HS512)

    fun verifyToken(jwt: String?): ResponseEntity<User?> {
        if (jwt.isNullOrBlank()) {
            return ResponseEntity.status(401).body(null)
        }

        return try {
            val token = jwt.removePrefix("Bearer ").trim()
            val body = Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).body

            val userId = body.issuer.toInt()
            val user = userService.getById(userId)
                ?: return ResponseEntity.status(401).body(null)

            ResponseEntity.ok(user)
        } catch (e: Exception) {
            ResponseEntity.status(401).body(null)
        }
    }

    @PostMapping("/register")
    fun register(@RequestBody body: RegisterDto): ResponseEntity<User> {
        val user = User().apply {
            name = body.name
            email = body.email
            password = body.password
            role = "USER"
        }
        return ResponseEntity.ok(this.userService.save(user))
    }

    @PostMapping("/login")
    fun login(@RequestBody body: LoginDTO, response: HttpServletResponse): ResponseEntity<Any> {
        val user = this.userService.findByEmail(body.email)
            ?: return ResponseEntity.badRequest().body(MessageKonsole("User not found!"))

        if (!user.comparePassword(body.password)) {
            return ResponseEntity.badRequest().body(MessageKonsole("Invalid password!"))
        }

        val issuer = user.id.toString()
        val expiration = Date(System.currentTimeMillis() + 24 * 60 * 60 * 1000 * 7) // 1 jour

        val jwt = Jwts.builder()
            .setIssuer(issuer)
            .setExpiration(expiration)
            .signWith(key, SignatureAlgorithm.HS512)
            .compact()

        return ResponseEntity.ok(mapOf("token" to jwt))

    }

    @GetMapping("/user")
    fun user(@RequestHeader("Authorization") jwt: String?): ResponseEntity<Any> {
        val userResponse = verifyToken(jwt)
        if (!userResponse.statusCode.is2xxSuccessful) {
            return ResponseEntity.status(userResponse.statusCode).body(MessageKonsole("Unauthenticated"))
        }

        return ResponseEntity.ok(userResponse.body)
    }

    @PostMapping("/userAdmin")
    fun userAdmin(@RequestHeader("Authorization") jwt: String?): ResponseEntity<Any> {
        val userResponse = verifyToken(jwt)
        if (!userResponse.statusCode.is2xxSuccessful) {
            return ResponseEntity.status(userResponse.statusCode).body(MessageKonsole("Unauthenticated"))
        }

        val user = userResponse.body
        if (user?.role != "ADMIN") {
            return ResponseEntity.status(403).body(MessageKonsole("Access denied"))
        }

        return ResponseEntity.ok(user)
    }
    
    @PostMapping("/stillLogged")
    fun stilllogged(@RequestHeader("Authorization") jwt: String?): ResponseEntity<Any>{
        val userResponse = verifyToken(jwt)
        if (!userResponse.statusCode.is2xxSuccessful){
            return ResponseEntity.status(userResponse.statusCode).body(MessageKonsole("Unauthenticated"))
        }
        return ResponseEntity.ok(MessageKonsole("authenticated"))
    }
}