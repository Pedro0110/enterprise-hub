package com.enterprisehub.entity;

import com.enterprisehub.entity.pk.CompanySupplierId;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Entity
@Table(name = "company_supplier")
@EntityListeners(AuditingEntityListener.class)
public class CompanySupplier {

    @EmbeddedId
    @EqualsAndHashCode.Include
    private CompanySupplierId id = new CompanySupplierId();

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("idCompany")
    @JoinColumn(name = "id_company")
    private Company company;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("idSupplier")
    @JoinColumn(name = "id_supplier")
    private Supplier supplier;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    public CompanySupplier(Company company, Supplier supplier) {
        this.company = company;
        this.supplier = supplier;
        this.id = new CompanySupplierId(company.getIdCompany(), supplier.getIdSupplier());
    }
}