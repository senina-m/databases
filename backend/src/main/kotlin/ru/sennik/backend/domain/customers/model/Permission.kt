package ru.sennik.backend.domain.customers.model

import org.springframework.security.core.GrantedAuthority
import ru.sennik.backend.domain.customers.enums.PermissionType
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.EnumType
import javax.persistence.Enumerated
import javax.persistence.GeneratedValue
import javax.persistence.GenerationType
import javax.persistence.Id
import javax.persistence.Lob
import javax.persistence.Table

@Entity
@Table(name = "permissions")
class Permission : GrantedAuthority {
    constructor(name: PermissionType) {
        this.name = name
    }

    @Column(name = "name", nullable = false)
    @Enumerated(value = EnumType.STRING)
    var name: PermissionType

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    var id: Int? = null

    override fun getAuthority(): String = name.name
}
