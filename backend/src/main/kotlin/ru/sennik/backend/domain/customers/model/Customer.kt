package ru.sennik.backend.domain.customers.model

import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.userdetails.UserDetails
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.FetchType
import javax.persistence.GeneratedValue
import javax.persistence.GenerationType
import javax.persistence.Id
import javax.persistence.JoinColumn
import javax.persistence.Lob
import javax.persistence.ManyToOne
import javax.persistence.Table

@Entity
@Table(name = "customer")
class Customer: UserDetails {
    constructor(name: String, password: String, permission: Permission) {
        this.name = name
        this.password = password
        this.permission = permission
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    var id: Long? = null

    @Column(name = "name", nullable = false)
    var name: String
    @Column(name = "password", nullable = false)
    var password: String

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "permissions_id", nullable = false)
    var permission: Permission

    override fun getAuthorities(): MutableCollection<out GrantedAuthority> = mutableListOf(permission)

    override fun getPassword(): String = password

    override fun getUsername(): String = name

    override fun isAccountNonExpired(): Boolean = true

    override fun isAccountNonLocked(): Boolean = true

    override fun isCredentialsNonExpired(): Boolean = true

    override fun isEnabled(): Boolean = true
}
