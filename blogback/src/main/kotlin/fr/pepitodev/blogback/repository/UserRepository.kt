package fr.pepitodev.blogback.repository

import fr.pepitodev.blogback.models.User
import org.springframework.data.jpa.repository.JpaRepository

interface UserRepository: JpaRepository<User, Int> {
    fun findByEmail(email: String): User?
}