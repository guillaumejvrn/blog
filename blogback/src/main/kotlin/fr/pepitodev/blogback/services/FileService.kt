package fr.pepitodev.blogback.services

import fr.pepitodev.blogback.models.File
import fr.pepitodev.blogback.repository.FileRepository
import org.springframework.stereotype.Service
import org.springframework.web.multipart.MultipartFile

@Service
class FileService(private val fileRepository: FileRepository) {
    fun saveFile(file: MultipartFile): File {
        val fileEntity = File(
            filename = file.originalFilename ?: "unknown",
            contentType = file.contentType ?: "application/octet-stream",
            data = file.bytes
        )
        return fileRepository.save(fileEntity)
    }
    fun getFile(id: Long): File? {
        return fileRepository.findById(id).orElse(null)
    }
}