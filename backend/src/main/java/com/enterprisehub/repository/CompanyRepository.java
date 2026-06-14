package com.enterprisehub.repository;

import com.enterprisehub.entity.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface CompanyRepository extends JpaRepository<Company, UUID> {
    boolean existsByDocumentNumber(String documentNumber);
}