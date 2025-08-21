package fr.pepitodev.blogback.repository

import fr.pepitodev.blogback.models.File
import org.springframework.data.jpa.repository.JpaRepository

interface FileRepository: JpaRepository<File, Long> {
}