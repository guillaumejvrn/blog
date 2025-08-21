package fr.pepitodev.blogback.controller

import fr.pepitodev.blogback.dtos.DeleteMessageTdo
import fr.pepitodev.blogback.dtos.GetUserById
import fr.pepitodev.blogback.dtos.MessageContentDto
import fr.pepitodev.blogback.dtos.MessageKonsole
import fr.pepitodev.blogback.models.MessageInput
import fr.pepitodev.blogback.services.MessageService
import fr.pepitodev.blogback.services.UserService
import org.springframework.data.domain.Page
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.time.LocalDateTime

@RestController
class MessageController(
    private val authController: AuthController,
    private val MessageService: MessageService,
    private val messageService: MessageService,
    private val userService: UserService
) {

    @PostMapping("/sendMessage")
    fun sendMessage(@RequestHeader("Authorization") jwt: String?, @RequestBody body:MessageContentDto): ResponseEntity<Any> {
        val userResponse = authController.verifyToken(jwt)
        if (!userResponse.statusCode.is2xxSuccessful){
            return ResponseEntity.status(userResponse.statusCode).body(MessageKonsole("Unauthenticated"))
        }
        val user = userResponse.body
        if (user?.role != "ADMIN") {
            return ResponseEntity.status(403).body(MessageKonsole("Access denied"))
        }

        val messgae = MessageInput().apply {
            content = body.messageContent
            fileNum = body.fileNum.toIntOrNull()
            userId = userResponse.body!!.id
            timestamp = LocalDateTime.now()
            themeID = body.themeID
        }

        return ResponseEntity.ok(this.MessageService.save(messgae))
    }

    @GetMapping("/getMessages")
    fun getMessage(@RequestParam page: Int, @RequestParam size: Int, @RequestParam themeID: Int): ResponseEntity<Any> {
        val messages: Page<MessageInput> = messageService.getMessages(page, size, themeID)
        return ResponseEntity.ok(messages)
    }

    @PostMapping("/getUserById")
    fun getUserById(@RequestBody body: GetUserById): ResponseEntity<Any>{
        val user = userService.getById(body.userId.toInt())
        if(user != null){
            return ResponseEntity.ok(user)
        } else {
            return ResponseEntity.status(404).body(MessageKonsole("User not found"))
        }
    }
    @PostMapping("/deleteMessage")
    fun deleteMessage(@RequestHeader("Authorization") jwt: String?, @RequestBody body: DeleteMessageTdo): ResponseEntity<Any> {
        val userResponse = authController.verifyToken(jwt)
        if (!userResponse.statusCode.is2xxSuccessful) {
            return ResponseEntity.status(userResponse.statusCode).body(MessageKonsole("Unauthenticated"))
        }
        val user = userResponse.body
        if (user?.role != "ADMIN") {
            return ResponseEntity.status(403).body(MessageKonsole("Access denied"))
        }
        messageService.deleteMessage(body.messageId!!)
        return ResponseEntity.ok(MessageKonsole("Message deleted successfully"))
    }

}