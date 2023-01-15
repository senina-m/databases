package ru.sennik.backend.domain.creatures.model

import java.time.LocalDate
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.GeneratedValue
import javax.persistence.GenerationType
import javax.persistence.Id
import javax.persistence.Lob
import javax.persistence.Table

@Entity
@Table(name = "creature")
class Creature(
    @Column(name = "name", nullable = false)
    var name: String,
    @Column(name = "birthday", nullable = false)
    var birthday: LocalDate,
    @Column(name = "race", nullable = false)
    var race: String,
    @Column(name = "sex", nullable = false)
    var sex: String
) {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    var id: Long? = null

    @Column(name = "death_date")
    var deathDate: LocalDate? = null
}
