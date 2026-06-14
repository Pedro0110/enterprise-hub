package com.enterprisehub.dto;

import com.enterprisehub.entity.enums.DocumentType;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class SupplierResponse {
    private UUID idSupplier;
    private String documentNumber;
    private DocumentType documentType;
    private String name;
    private String email;
    private String rg;
    private LocalDate birthDate;
    private String addressZipCode;
    private String addressStreet;
    private String addressNeighborhood;
    private String addressCity;
    private String addressState;
    private String addressNumber;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}