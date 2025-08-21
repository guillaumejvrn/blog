package fr.pepitodev.blogback.controller

import fr.pepitodev.blogback.dtos.MessageKonsole
import fr.pepitodev.blogback.services.FileService
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile

@RestController
class FileController(
    private val authController: AuthController,
    private val fileService: FileService,
) {


    @PostMapping("/file/upload")
    fun uploadFile(@RequestHeader("Authorization") jwt: String? ,@RequestParam("file") file: MultipartFile): ResponseEntity<Any> {

        val userResponse = authController.verifyToken(jwt)
        if (!userResponse.statusCode.is2xxSuccessful){
            return ResponseEntity.status(userResponse.statusCode).body(MessageKonsole("Unauthenticated"))
        }
        val user = userResponse.body
        if (user?.role != "ADMIN") {
            return ResponseEntity.status(403).body(MessageKonsole("Access denied"))
        }


        val savedFile = fileService.saveFile(file)
        val response = mapOf("id" to savedFile.id)
        return ResponseEntity.ok(response)
    }

    @GetMapping("/file/{id}")
    fun getFile(@PathVariable id: Long): ResponseEntity<ByteArray> {
        val fileEntity = fileService.getFile(id)
            ?: return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null)

        val headers = HttpHeaders().apply {
            add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=${fileEntity.filename}")
            add(HttpHeaders.CONTENT_TYPE, fileEntity.contentType)
        }

        return ResponseEntity.ok()
            .headers(headers)
            .body(fileEntity.data)
    }
}