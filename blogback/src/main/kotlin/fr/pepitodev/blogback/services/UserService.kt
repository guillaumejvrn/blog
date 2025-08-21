package fr.pepitodev.blogback.services

import fr.pepitodev.blogback.models.User
import fr.pepitodev.blogback.repository.UserRepository
import org.springframework.stereotype.Service

@Service
class UserService(private val userRepository: UserRepository) {

    fun save(user: User): User{
        return this.userRepository.save(user)
    }

    fun findByEmail(email: String): User? {
        return this.userRepository.findByEmail(email)
    }

    fun findById(id: Int): User? {
        return this.userRepository.findById(id).orElse(null)
    }

    fun getById(id: Int): User? {
        return this.userRepository.findById(id).orElse(null)
    }
}