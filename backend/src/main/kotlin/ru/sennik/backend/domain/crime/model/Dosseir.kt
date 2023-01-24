package ru.sennik.backend.domain.crime.model

import ru.sennik.backend.domain.customers.model.CustomerCreature
import java.time.LocalDate
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
@Table(name = "dosseir")
class Dosseir(
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "crime_id", nullable = false)
    var crime: Crime,

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "author_id", nullable = false)
    var author: CustomerCreature
) {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    var id: Long? = null

    @Column(name = "create_date", nullable = false)
    var createDate: LocalDate = LocalDate.now()
}
