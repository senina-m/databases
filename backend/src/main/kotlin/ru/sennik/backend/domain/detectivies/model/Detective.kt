package ru.sennik.backend.domain.detectivies.model

import ru.sennik.backend.domain.creatures.model.Creature
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.FetchType
import javax.persistence.GeneratedValue
import javax.persistence.GenerationType
import javax.persistence.Id
import javax.persistence.JoinColumn
import javax.persistence.ManyToOne
import javax.persistence.OneToOne
import javax.persistence.Table

@Entity
@Table(name = "detective")
class Detective(
    @OneToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "creature_id", nullable = false)
    var creature: Creature,

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "position_id", nullable = false)
    var position: Position
) {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    var id: Long? = null
}
