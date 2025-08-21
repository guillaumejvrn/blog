package fr.pepitodev.blogback.repository

import fr.pepitodev.blogback.models.MessageInput
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface MessageRepository : JpaRepository<MessageInput, Long> {
    fun findAllByThemeIDOrderByTimestampDesc(themeID: Int, pageable: Pageable): Page<MessageInput>
}