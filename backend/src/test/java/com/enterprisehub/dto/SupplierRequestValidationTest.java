package com.enterprisehub.dto;

import com.enterprisehub.entity.enums.DocumentType;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

public class SupplierRequestValidationTest {

    private static ValidatorFactory vf;
    private static Validator validator;

    @BeforeAll
    static void init() {
        vf = Validation.buildDefaultValidatorFactory();
        validator = vf.getValidator();
    }

    @AfterAll
    static void tearDown() {
        vf.close();
    }

    @Test
    void shouldFail_WhenPfWithoutRgOrBirthDate() {
        SupplierRequest req = new SupplierRequest();
        req.setDocumentType(DocumentType.F);
        req.setDocumentNumber("12345678909");
        req.setName("Pessoa");
        req.setEmail("pessoa@example.com");
        req.setAddressZipCode("12345678");
        // missing rg and birthDate

        Set<ConstraintViolation<SupplierRequest>> violations = validator.validate(req);
        assertThat(violations).isNotEmpty();
        boolean hasPfMsg = violations.stream().anyMatch(v -> v.getMessage().contains("Individual suppliers must provide RG and birth date"));
        assertThat(hasPfMsg).isTrue();
    }

    @Test
    void shouldPass_WhenJWithoutRgAndBirthDate() {
        SupplierRequest req = new SupplierRequest();
        req.setDocumentType(DocumentType.J);
        req.setDocumentNumber("12345678000195");
        req.setName("Empresa");
        req.setEmail("contato@empresa.com");
        req.setAddressZipCode("12345678");

        Set<ConstraintViolation<SupplierRequest>> violations = validator.validate(req);
        assertThat(violations).isEmpty();
    }

    @Test
    void shouldFail_WhenDocumentNumberInvalid() {
        SupplierRequest req = new SupplierRequest();
        req.setDocumentType(DocumentType.F);
        req.setDocumentNumber("123"); // invalid
        req.setName("Pessoa");
        req.setEmail("pessoa@example.com");
        req.setAddressZipCode("12345678");
        req.setRg("RG123");
        req.setBirthDate(LocalDate.now().minusYears(20));

        Set<ConstraintViolation<SupplierRequest>> violations = validator.validate(req);
        assertThat(violations).isNotEmpty();
        boolean hasDocMsg = violations.stream().anyMatch(v -> v.getMessage().contains("Invalid CPF/CNPJ") || v.getPropertyPath().toString().equals("documentNumber"));
        assertThat(hasDocMsg).isTrue();
    }
}

