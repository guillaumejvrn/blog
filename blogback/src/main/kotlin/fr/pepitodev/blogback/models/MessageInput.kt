package fr.pepitodev.blogback.models

import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import java.time.LocalDateTime

@Entity
class MessageInput {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null
    var themeID: Int? = null
    var content: String? = null
    var userId: Int? = null
    var timestamp: LocalDateTime? = null
    var fileNum : Int? = null
}