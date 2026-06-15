package com.enterprisehub.service;

import com.enterprisehub.dto.CompanyRequest;
import com.enterprisehub.entity.Company;
import com.enterprisehub.entity.Supplier;
import com.enterprisehub.entity.embeddable.Address;
import com.enterprisehub.entity.enums.DocumentType;
import com.enterprisehub.entity.pk.CompanySupplierId;
import com.enterprisehub.exception.BusinessException;
import com.enterprisehub.exception.ResourceNotFoundException;
import com.enterprisehub.repository.CompanyRepository;
import com.enterprisehub.repository.CompanySupplierRepository;
import com.enterprisehub.repository.SupplierRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;

import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class CompanyServiceTest {

    @Mock
    private CompanyRepository companyRepository;

    @Mock
    private SupplierRepository supplierRepository;

    @Mock
    private CompanySupplierRepository companySupplierRepository;

    @InjectMocks
    private CompanyService companyService;

    @Captor
    private ArgumentCaptor<Company> companyCaptor;

    private CompanyRequest request;

    @BeforeEach
    void setup() {
        request = new CompanyRequest();
        request.setDocumentNumber("12345678000195");
        request.setTradeName("Acme Ltda");
        request.setAddressZipCode("12345678");
    }

    @Test
    void shouldCreateCompany_WhenValidRequest() {
        when(companyRepository.existsByDocumentNumber(request.getDocumentNumber())).thenReturn(false);
        Company saved = new Company();
        saved.setIdCompany(UUID.randomUUID());
        saved.setDocumentNumber(request.getDocumentNumber());
        saved.setTradeName(request.getTradeName());
        when(companyRepository.saveAndFlush(any(Company.class))).thenReturn(saved);

        var resp = companyService.create(request);

        assertThat(resp).isNotNull();
        assertThat(resp.getDocumentNumber()).isEqualTo(request.getDocumentNumber());
        verify(companyRepository).saveAndFlush(companyCaptor.capture());
        assertThat(companyCaptor.getValue().getTradeName()).isEqualTo("Acme Ltda");
    }

    @Test
    void shouldThrowBusinessException_WhenCnpjDuplicated() {
        when(companyRepository.existsByDocumentNumber(request.getDocumentNumber())).thenReturn(true);

        assertThatThrownBy(() -> companyService.create(request))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("CNPJ already registered");
    }

    @Test
    void shouldDeleteCompany_WhenNoLinkedSuppliers() {
        UUID id = UUID.randomUUID();
        when(companyRepository.existsById(id)).thenReturn(true);
        when(companySupplierRepository.existsByCompany_IdCompany(id)).thenReturn(false);

        companyService.delete(id);

        verify(companyRepository).deleteById(id);
    }

    @Test
    void shouldThrowBusinessException_WhenDeleteWithLinkedSuppliers() {
        UUID id = UUID.randomUUID();
        when(companyRepository.existsById(id)).thenReturn(true);
        when(companySupplierRepository.existsByCompany_IdCompany(id)).thenReturn(true);

        assertThatThrownBy(() -> companyService.delete(id))
                .isInstanceOf(BusinessException.class)
                .satisfies(ex -> assertThat(((BusinessException) ex).getStatus()).isEqualTo(HttpStatus.CONFLICT));
    }

    @Test
    void shouldThrowResourceNotFound_WhenDeleteNonExistent() {
        UUID id = UUID.randomUUID();
        when(companyRepository.existsById(id)).thenReturn(false);

        assertThatThrownBy(() -> companyService.delete(id))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void shouldPreventAssociateUnderageSupplier_ToCompanyInParana() {
        UUID companyId = UUID.randomUUID();
        UUID supplierId = UUID.randomUUID();

        Company company = new Company();
        company.setIdCompany(companyId);
        Address addr = new Address();
        addr.setState("PR");
        company.setAddress(addr);

        Supplier supplier = new Supplier();
        supplier.setIdSupplier(supplierId);
        supplier.setDocumentType(DocumentType.F);
        supplier.setBirthDate(LocalDate.now().minusYears(16));

        when(companyRepository.findById(companyId)).thenReturn(Optional.of(company));
        when(supplierRepository.findById(supplierId)).thenReturn(Optional.of(supplier));

        assertThatThrownBy(() -> companyService.associateSupplier(companyId, supplierId))
                .isInstanceOf(BusinessException.class)
                .satisfies(ex -> assertThat(((BusinessException) ex).getStatus().value()).isIn(422, 422));
    }

    @Test
    void shouldAssociateSupplier_WhenValid() {
        UUID companyId = UUID.randomUUID();
        UUID supplierId = UUID.randomUUID();

        Company company = new Company();
        company.setIdCompany(companyId);
        Address addr = new Address();
        addr.setState("SP");
        company.setAddress(addr);

        Supplier supplier = new Supplier();
        supplier.setIdSupplier(supplierId);
        supplier.setDocumentType(DocumentType.F);
        supplier.setBirthDate(LocalDate.now().minusYears(30));

        when(companyRepository.findById(companyId)).thenReturn(Optional.of(company));
        when(supplierRepository.findById(supplierId)).thenReturn(Optional.of(supplier));

        companyService.associateSupplier(companyId, supplierId);

        verify(companySupplierRepository).save(any());
    }

    @Test
    void shouldDissociateSupplier_WhenExists() {
        UUID companyId = UUID.randomUUID();
        UUID supplierId = UUID.randomUUID();
        CompanySupplierId id = new CompanySupplierId(companyId, supplierId);

        when(companySupplierRepository.existsById(id)).thenReturn(true);

        companyService.dissociateSupplier(companyId, supplierId);

        verify(companySupplierRepository).deleteById(id);
    }

    @Test
    void shouldThrowResourceNotFound_WhenDissociateMissing() {
        UUID companyId = UUID.randomUUID();
        UUID supplierId = UUID.randomUUID();
        CompanySupplierId id = new CompanySupplierId(companyId, supplierId);

        when(companySupplierRepository.existsById(id)).thenReturn(false);

        assertThatThrownBy(() -> companyService.dissociateSupplier(companyId, supplierId))
                .isInstanceOf(ResourceNotFoundException.class);
    }
}

