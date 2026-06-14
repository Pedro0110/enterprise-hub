package com.enterprisehub.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class CnpjValidator implements ConstraintValidator<Cnpj, String> {

    @Override
    public boolean isValid(String cnpj, ConstraintValidatorContext context) {
        if (cnpj == null || cnpj.isBlank()) return false;
        String numbers = cnpj.replaceAll("\\D", "");
        if (numbers.length() != 14) return false;

        try {
            return DocumentValidator.isValidCnpj(numbers);
        } catch (NumberFormatException e) {
            return false;
        }
    }
}