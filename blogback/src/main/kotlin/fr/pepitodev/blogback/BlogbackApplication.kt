package fr.pepitodev.blogback

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration
import org.springframework.boot.runApplication

@SpringBootApplication(exclude = [SecurityAutoConfiguration::class])
class BlogbackApplication

fun main(args: Array<String>) {
    runApplication<BlogbackApplication>(*args)
}
