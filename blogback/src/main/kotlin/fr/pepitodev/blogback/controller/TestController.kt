package fr.pepitodev.blogback.controller

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class TestController {

    @GetMapping("/test")
    fun hello(): String {
        return "testdefou"
    }
}