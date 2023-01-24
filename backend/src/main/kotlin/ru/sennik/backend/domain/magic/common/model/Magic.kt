package ru.sennik.backend.domain.magic.common.model

import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.GeneratedValue
import javax.persistence.GenerationType
import javax.persistence.Id
import javax.persistence.Inheritance
import javax.persistence.InheritanceType
import javax.persistence.Table

/**
 * @author Natalia Nikonova
 */
@Entity
@Table(name = "magic")
@Inheritance(strategy = InheritanceType.JOINED)
class Magic(
   @Column(name = "name", nullable = false)
   var name: String
) {
   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   @Column(name = "id", nullable = false)
   var id: Int? = null
}
