package ru.sennik.backend.domain.crime.model

import ru.sennik.backend.domain.location.model.Location
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
@Table(name = "crime")
class Crime(
   @Column(name = "title", nullable = false)
   var title: String,

   @Column(name = "description", nullable = false)
   var description: String,

   @Column(name = "date_begin", nullable = false)
   var dateBegin: LocalDate,

   @Column(name = "main_detective_id", nullable = false)
   var mainDetectiveId: Long,

   @Column(name = "is_solved", nullable = false)
   var isSolved: Boolean,

   @ManyToOne(fetch = FetchType.EAGER)
   @JoinColumn(name = "location_id", nullable = false)
   var location: Location
) {
   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   @Column(name = "id", nullable = false)
   var id: Long? = null

   @Column(name = "date_end", nullable = true)
   var dateEnd: LocalDate? = null

   @Column(name = "damage_description", nullable = true)
   var damageDescription: String? = null
}
