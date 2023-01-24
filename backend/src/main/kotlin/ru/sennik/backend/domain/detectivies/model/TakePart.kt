package ru.sennik.backend.domain.detectivies.model

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
@Table(name = "take_part")
class TakePart(
   @Column(name = "crime_id", nullable = false)
   var crimeId: Long,

   @ManyToOne(fetch = FetchType.EAGER)
   @JoinColumn(name = "detective_id", nullable = false)
   var detective: Detective
) {
   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   @Column(name = "id", nullable = false)
   var id: Long? = null
}
