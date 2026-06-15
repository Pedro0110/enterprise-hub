package com.enterprisehub.dto;

import com.enterprisehub.entity.enums.DocumentType;
import com.enterprisehub.validation.CpfOrCnpj;
import com.enterprisehub.validation.DocumentValidator;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;

@Data
public class SupplierRequest {

    @NotBlank(message = "Documento é obrigatório")
    @CpfOrCnpj
    private String documentNumber;

    @NotNull(message = "Tipo de documento é obrigatório")
    private DocumentType documentType;

    @NotBlank(message = "Nome é obrigatório")
    private String name;

    @NotBlank(message = "Email é obrigatório")
    @Email(message = "Email inválido")
    private String email;

    private String rg;
    private LocalDate birthDate;

    @NotBlank(message = "CEP é obrigatório")
    private String addressZipCode;
    private String addressStreet;
    private String addressNeighborhood;
    private String addressCity;
    private String addressState;
    private String addressNumber;

    @AssertTrue(message = "Fornecedores PF devem fornecer RG e data de nascimento")
    public boolean isPfValid() {
        if (documentType == DocumentType.F) {
            return rg != null && !rg.isBlank() && birthDate != null;
        }
        return true;
    }

    @AssertTrue(message = "Documento inválido para o tipo: CPF deve ter 11 dígitos e ser válido; CNPJ deve ter 14 dígitos e ser válido")
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