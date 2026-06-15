package com.enterprisehub.validation;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

public class CnpjValidatorTest {

    private final CnpjValidator validator = new CnpjValidator();

    @Test
    void shouldReturnFalse_WhenNullOrBlank() {
        assertThat(validator.isValid(null, null)).isFalse();
        assertThat(validator.isValid("", null)).isFalse();
        assertThat(validator.isValid("   ", null)).isFalse();
    }

    @Test
    void shouldDelegateToDocumentValidator_ForSeveralInputs() {
        // prepare a few inputs (masked and unmasked). We'll compare with DocumentValidator behavior
        String[] inputs = {
                "12345678000195",
                "12.345.678/0001-95",
                "11111111111111",
                "00000000000000"
        };

        for (String in : inputs) {
            String numbers = in.replaceAll("\\D", "");
            boolean expected = DocumentValidator.isValidCnpj(numbers);
            assertThat(validator.isValid(in, null)).isEqualTo(expected);
        }
    }
}

