package com.enterprisehub.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class CompanyResponse {
    private UUID idCompany;
    private String documentNumber;
    private String tradeName;
    private String addressZipCode;
    private String addressStreet;
    private String addressNeighborhood;
    private String addressCity;
    private String addressState;
    private String addressNumber;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}