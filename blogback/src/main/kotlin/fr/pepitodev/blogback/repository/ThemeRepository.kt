package fr.pepitodev.blogback.repository

import fr.pepitodev.blogback.models.Theme
import org.springframework.data.jpa.repository.JpaRepository


interface ThemeRepository: JpaRepository<Theme, Int> {
}