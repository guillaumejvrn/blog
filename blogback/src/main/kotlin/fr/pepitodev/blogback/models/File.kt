package fr.pepitodev.blogback.models

import jakarta.persistence.*

@Entity
@Table(name = "files")
data class File(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    val filename: String = "",

    val contentType: String = "",

    @Lob
    val data: ByteArray = ByteArray(0)
)