package com.enterprisehub.dto;

import com.enterprisehub.entity.enums.DocumentType;
import com.enterprisehub.validation.CpfOrCnpj;
import com.enterprisehub.validation.DocumentValidator;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;

@Data
public class SupplierRequest {

    @NotBlank(message = "Document is required")
    @CpfOrCnpj
    private String documentNumber;

    @NotNull(message = "Document type is required")
    private DocumentType documentType;

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email")
    private String email;

    private String rg;
    private LocalDate birthDate;

    @NotBlank(message = "Postal code is required")
    private String addressZipCode;
    private String addressStreet;
    private String addressNeighborhood;
    private String addressCity;
    private String addressState;
    private String addressNumber;

    @AssertTrue(message = "Individual suppliers must provide RG and birth date")
    public boolean isPfValid() {
        if (documentType == DocumentType.F) {
            return rg != null && !rg.isBlank() && birthDate != null;
        }
        return true;
    }

    @AssertTrue(message = "Invalid document for type: CPF must have 11 digits and be valid; CNPJ must have 14 digits and be valid")
    public boolean isDocumentValidForType() {
        if (documentType == null || documentNumber == null) {
            return true;
        }
        String numbers = documentNumber.replaceAll("\\D", "");
        if (documentType == DocumentType.F) {
            return numbers.length() == 11 && DocumentValidator.isValidCpf(numbers);
        } else if (documentType == DocumentType.J) {
            return numbers.length() == 14 && DocumentValidator.isValidCnpj(numbers);
        }
        return false;
    }
}