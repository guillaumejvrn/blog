package fr.pepitodev.blogback.controller

import fr.pepitodev.blogback.dtos.idThemeTdo
import fr.pepitodev.blogback.dtos.MessageKonsole
import fr.pepitodev.blogback.dtos.ThemeDto
import fr.pepitodev.blogback.dtos.ThemeNameResponse
import fr.pepitodev.blogback.models.Theme
import fr.pepitodev.blogback.services.ThemeService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestHeader
import org.springframework.web.bind.annotation.RestController

@RestController
class ThemeController(
        private val themeService: ThemeService,
        private val authController: AuthController
) {
    @PostMapping("/createTheme")
    fun createTheme(@RequestHeader("Authorization") jwt: String?, @RequestBody body: ThemeDto): ResponseEntity<Any> {
        val userResponse = authController.verifyToken(jwt)
        if (!userResponse.statusCode.is2xxSuccessful) {
            return ResponseEntity.ok(MessageKonsole("Unauthentificated"))
        }
        val user = userResponse.body
        if (user?.role != "ADMIN") {
            return ResponseEntity.status(403).body(MessageKonsole("Access denied"))
        }

        val theme = Theme().apply {
            name = body.theme
        }
        return ResponseEntity.ok(this.themeService.saveTheme(theme))
    }

    @PostMapping("/getTheme")
    fun getTheme():ResponseEntity<Any> {
        return ResponseEntity.ok(this.themeService.getAllTheme())
    }

    @PostMapping("/deleteTheme")
    fun deleteTheme(@RequestHeader("Authorization") jwt: String?, @RequestBody body:idThemeTdo):ResponseEntity<Any>{
        val userResponse = authController.verifyToken(jwt)
        if (!userResponse.statusCode.is2xxSuccessful) {
            return ResponseEntity.ok(MessageKonsole("Unauthentificated"))
        }
        val user = userResponse.body
        if (user?.role != "ADMIN") {
            return ResponseEntity.status(403).body(MessageKonsole("Access denied"))
        }

        themeService.deleteTheme(body.themeId!!)
        return ResponseEntity.ok(MessageKonsole("theme delete successfully"))
    }

    @PostMapping("/getThemeById")
    fun getThemeById(@RequestBody body: idThemeTdo): ResponseEntity<Any>{
        val themeName = themeService.getThemeNameById(body.themeId!!)
        return if (themeName != null) {
            ResponseEntity.ok(ThemeNameResponse(themeName))
        } else {
            ResponseEntity.status(404).body(MessageKonsole("Theme not found"))
        }
    }
}