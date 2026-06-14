package com.enterprisehub.dto;

import com.enterprisehub.validation.Cnpj;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CompanyRequest {

    @NotBlank(message = "CNPJ is required")
    @Cnpj
    private String documentNumber;

    @NotBlank(message = "Trade name is required")
    private String tradeName;

    @NotBlank(message = "Postal code is required")
    @Size(min = 8, max = 9)
    private String addressZipCode;


    private String addressStreet;
    private String addressNeighborhood;
    private String addressCity;
    private String addressState;
    private String addressNumber;
}