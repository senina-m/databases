package ru.sennik.backend.domain.customers.model

import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.FetchType
import javax.persistence.GeneratedValue
import javax.persistence.GenerationType
import javax.persistence.Id
import javax.persistence.JoinColumn
import javax.persistence.OneToOne
import javax.persistence.Table

@Entity
@Table(name = "customer_creature")
class CustomerCreature(
    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "customer_id", nullable = false)
    var customer: Customer,
    @Column(name = "creature_id", nullable = false)
    var creatureId: Long
) {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    var id: Long? = null
}
