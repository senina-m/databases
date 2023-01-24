package ru.sennik.backend.domain.magic.used.model

import ru.sennik.backend.domain.magic.common.model.Magic
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
@Table(name = "magic")
class UsedMagic(
   var date: LocalDate,

   @Column(name = "criminals_id", nullable = false)
   var criminalsId: Long,

   @ManyToOne(fetch = FetchType.EAGER, optional = false)
   @JoinColumn(name = "magic_id", nullable = false)
   var magic: Magic
) {
   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   @Column(name = "id", nullable = false)
   var id: Long? = null
}
