package ru.sennik.backend.domain.customers.model

import org.springframework.security.core.GrantedAuthority
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.GeneratedValue
import javax.persistence.GenerationType
import javax.persistence.Id
import javax.persistence.Lob
import javax.persistence.Table

@Entity
@Table(name = "permissions")
class Permission : GrantedAuthority {
    constructor(name: String) {
        this.name = name
    }
    @Column(name = "name", nullable = false)
    var name: String

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    var id: Int? = null

    override fun getAuthority(): String = name
}
