package ru.sennik.backend.domain.creatures.model

import ru.sennik.backend.generated.dto.CreatureDto.Sex
import java.time.LocalDate
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.EnumType
import javax.persistence.Enumerated
import javax.persistence.GeneratedValue
import javax.persistence.GenerationType
import javax.persistence.Id
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
    @Enumerated(EnumType.STRING)
    @Column(name = "sex", nullable = false)
    var sex: Sex
) {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    var id: Long? = null

    @Column(name = "death_date")
    var deathDate: LocalDate? = null
}