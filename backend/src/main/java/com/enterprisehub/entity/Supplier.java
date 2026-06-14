package com.enterprisehub.entity;

import com.enterprisehub.entity.embeddable.Address;
import com.enterprisehub.entity.enums.DocumentType;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Entity
@Table(name = "supplier")
@EntityListeners(AuditingEntityListener.class)
public class Supplier {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @EqualsAndHashCode.Include
    private UUID idSupplier;

    @Column(unique = true, nullable = false, length = 18)
    private String documentNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 1)
    private DocumentType documentType;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String email;

    private String rg;

    private LocalDate birthDate;

    @Embedded
    private Address address;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

}