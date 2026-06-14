package com.enterprisehub.repository;

import com.enterprisehub.entity.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface SupplierRepository extends JpaRepository<Supplier, UUID> {
    List<Supplier> findByNameContainingIgnoreCaseAndDocumentNumberContaining(String name, String documentNumber);
    List<Supplier> findByNameContainingIgnoreCase(String name);
    List<Supplier> findByDocumentNumberContaining(String documentNumber);
    boolean existsByDocumentNumber(String documentNumber);
}