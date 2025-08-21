package fr.pepitodev.blogback.services

import fr.pepitodev.blogback.models.Theme
import fr.pepitodev.blogback.repository.ThemeRepository
import org.springframework.stereotype.Service

@Service
class ThemeService(private val themeRepository: ThemeRepository) {
    fun saveTheme(name: Theme): Theme? {
        return this.themeRepository.save(name)
    }
    fun getAllTheme(): List<Theme> {
        return this.themeRepository.findAll()
    }
    fun deleteTheme(themeId: Int) {
        return this.themeRepository.deleteById(themeId)
    }
    fun getThemeNameById(themeId: Int): String? {
        val theme = themeRepository.findById(themeId).orElse(null)
        return theme?.name
    }
}