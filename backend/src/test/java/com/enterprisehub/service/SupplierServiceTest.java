package com.enterprisehub.service;

import com.enterprisehub.dto.SupplierRequest;
import com.enterprisehub.entity.Supplier;
import com.enterprisehub.entity.enums.DocumentType;
import com.enterprisehub.exception.BusinessException;
import com.enterprisehub.repository.CompanySupplierRepository;
import com.enterprisehub.repository.SupplierRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class SupplierServiceTest {

    @Mock
    private SupplierRepository supplierRepository;

    @Mock
    private CompanySupplierRepository companySupplierRepository;

    @InjectMocks
    private SupplierService supplierService;

    private SupplierRequest pfRequest;
    private SupplierRequest pjRequest;

    @BeforeEach
    void setup() {
        pfRequest = new SupplierRequest();
        pfRequest.setDocumentNumber("12345678909");
        pfRequest.setDocumentType(DocumentType.F);
        pfRequest.setName("Joao");
        pfRequest.setEmail("joao@example.com");
        pfRequest.setRg("MG123456");
        pfRequest.setBirthDate(LocalDate.now().minusYears(30));
        pfRequest.setAddressZipCode("12345678");

        pjRequest = new SupplierRequest();
        pjRequest.setDocumentNumber("12345678000195");
        pjRequest.setDocumentType(DocumentType.J);
        pjRequest.setName("Empresa");
        pjRequest.setEmail("contato@empresa.com");
        pjRequest.setAddressZipCode("12345678");
    }

    @Test
    void shouldCreatePfSupplier_WhenValid() {
        when(supplierRepository.existsByDocumentNumber(pfRequest.getDocumentNumber())).thenReturn(false);
        Supplier saved = new Supplier();
        saved.setIdSupplier(UUID.randomUUID());
        saved.setDocumentNumber(pfRequest.getDocumentNumber());
        saved.setName(pfRequest.getName());
        when(supplierRepository.saveAndFlush(any(Supplier.class))).thenReturn(saved);

        var resp = supplierService.create(pfRequest);

        assertThat(resp).isNotNull();
        assertThat(resp.getDocumentNumber()).isEqualTo(pfRequest.getDocumentNumber());
    }

    @Test
    void shouldCreatePjSupplier_WhenValidWithoutRgBirth() {
        when(supplierRepository.existsByDocumentNumber(pjRequest.getDocumentNumber())).thenReturn(false);
        Supplier saved = new Supplier();
        saved.setIdSupplier(UUID.randomUUID());
        saved.setDocumentNumber(pjRequest.getDocumentNumber());
        saved.setName(pjRequest.getName());
        when(supplierRepository.saveAndFlush(any(Supplier.class))).thenReturn(saved);

        var resp = supplierService.create(pjRequest);

        assertThat(resp).isNotNull();
        assertThat(resp.getDocumentNumber()).isEqualTo(pjRequest.getDocumentNumber());
    }

    @Test
    void shouldThrowBusinessException_WhenDocumentDuplicated() {
        when(supplierRepository.existsByDocumentNumber(pfRequest.getDocumentNumber())).thenReturn(true);

        assertThatThrownBy(() -> supplierService.create(pfRequest))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("CPF/CNPJ already registered");
    }

    @Test
    void shouldFilterByNameAndDocument() {
        Supplier s1 = new Supplier();
        s1.setIdSupplier(UUID.randomUUID());
        s1.setDocumentNumber("11122233344");
        s1.setName("Maria Silva");

        when(supplierRepository.findByNameContainingIgnoreCaseAndDocumentNumberContaining("Maria", "111"))
                .thenReturn(List.of(s1));

        var list = supplierService.findAll("Maria", "111");

        assertThat(list).hasSize(1);
        assertThat(list.get(0).getName()).isEqualTo("Maria Silva");
    }

}


