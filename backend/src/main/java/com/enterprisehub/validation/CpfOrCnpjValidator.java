package com.enterprisehub.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class CpfOrCnpjValidator implements ConstraintValidator<CpfOrCnpj, String> {

    @Override
    public boolean isValid(String doc, ConstraintValidatorContext context) {
        if (doc == null || doc.isBlank()) return false;
        String numbers = doc.replaceAll("\\D", "");
        if (numbers.length() == 11) return DocumentValidator.isValidCpf(numbers);
        if (numbers.length() == 14) return DocumentValidator.isValidCnpj(numbers);
        return false;
    }
}