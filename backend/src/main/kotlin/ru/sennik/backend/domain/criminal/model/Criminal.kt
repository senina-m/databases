package ru.sennik.backend.domain.criminal.model

import ru.sennik.backend.domain.creatures.model.Creature
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.FetchType
import javax.persistence.GeneratedValue
import javax.persistence.GenerationType
import javax.persistence.Id
import javax.persistence.JoinColumn
import javax.persistence.ManyToOne
import javax.persistence.Table

/**
 * @author Natalia Nikonova
 */
@Entity
@Table(name = "criminals")
class Criminal(
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "creature_id", nullable = false)
    var creature: Creature,

    @Column(name = "is_proved", nullable = false)
    var isProved: Boolean,

    @Column(name = "crime_id", nullable = false)
    var crimeId: Long
) {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    var id: Long? = null
}
