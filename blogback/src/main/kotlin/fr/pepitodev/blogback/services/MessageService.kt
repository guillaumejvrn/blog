package fr.pepitodev.blogback.services

import fr.pepitodev.blogback.models.MessageInput
import fr.pepitodev.blogback.repository.MessageRepository
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageRequest
import org.springframework.stereotype.Service

@Service
class MessageService(private val messageRepository: MessageRepository) {

    fun save(message: MessageInput): MessageInput{
        return this.messageRepository.save(message)
    }
    fun getMessages(page: Int, size: Int, themeID: Int): Page<MessageInput> {
        val pageable = PageRequest.of(page, size)
        return this.messageRepository.findAllByThemeIDOrderByTimestampDesc(themeID, pageable)
    }
    fun deleteMessage(messageId: Long) {
        this.messageRepository.deleteById(messageId)
    }
}