package com.enterprisehub.validation;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

public class CpfOrCnpjValidatorTest {

    private final CpfOrCnpjValidator validator = new CpfOrCnpjValidator();

    @Test
    void shouldReturnFalse_WhenNullOrBlank() {
        assertThat(validator.isValid(null, null)).isFalse();
        assertThat(validator.isValid("", null)).isFalse();
    }

    @Test
    void shouldValidateCpfAndCnpj_ByDelegation() {
        String[] docs = {
                "12345678909",
                "11144477735",
                "12345678000195", // cnpj-like
                "12.345.678/0001-95"
        };

        for (String d : docs) {
            String numbers = d.replaceAll("\\D", "");
            boolean expected;
            if (numbers.length() == 11) expected = DocumentValidator.isValidCpf(numbers);
            else if (numbers.length() == 14) expected = DocumentValidator.isValidCnpj(numbers);
            else expected = false;
            assertThat(validator.isValid(d, null)).isEqualTo(expected);
        }
    }
}

