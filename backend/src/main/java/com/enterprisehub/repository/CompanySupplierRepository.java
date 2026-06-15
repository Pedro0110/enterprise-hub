package com.enterprisehub.repository;

import com.enterprisehub.entity.CompanySupplier;
import com.enterprisehub.entity.pk.CompanySupplierId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface CompanySupplierRepository extends JpaRepository<CompanySupplier, CompanySupplierId> {
    boolean existsByCompany_IdCompany(UUID companyId);
    boolean existsBySupplier_IdSupplier(UUID supplierId);
    List<CompanySupplier> findByCompany_IdCompany(UUID companyId);
}