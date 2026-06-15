package com.enterprisehub.service;

import com.enterprisehub.dto.CompanyRequest;
import com.enterprisehub.dto.CompanyResponse;
import com.enterprisehub.dto.SupplierResponse;
import com.enterprisehub.entity.*;
import com.enterprisehub.entity.enums.DocumentType;
import com.enterprisehub.entity.pk.CompanySupplierId;
import com.enterprisehub.exception.BusinessException;
import com.enterprisehub.exception.ResourceNotFoundException;
import com.enterprisehub.mapper.CompanyMapper;
import com.enterprisehub.mapper.SupplierMapper;
import com.enterprisehub.repository.CompanyRepository;
import com.enterprisehub.repository.CompanySupplierRepository;
import com.enterprisehub.repository.SupplierRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.Period;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CompanyService {

    private final CompanyRepository companyRepository;
    private final SupplierRepository supplierRepository;
    private final CompanySupplierRepository companySupplierRepository;

    @Transactional
    public CompanyResponse create(CompanyRequest request) {
        log.info("Creating company (document={})", request.getDocumentNumber());

        if (companyRepository.existsByDocumentNumber(request.getDocumentNumber())) {
            throw new BusinessException("CNPJ already registered", HttpStatus.CONFLICT);
        }

        Company entity = CompanyMapper.toEntity(request, null);
        entity = companyRepository.saveAndFlush(entity);
        log.info("Company created with id={}", entity.getIdCompany());
        return CompanyMapper.toResponse(entity);
    }

    public List<CompanyResponse> findAll() {
        return companyRepository.findAll().stream()
                .map(CompanyMapper::toResponse)
                .collect(Collectors.toList());
    }

    public CompanyResponse findById(UUID id) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found"));
        return CompanyMapper.toResponse(company);
    }

    @Transactional
    public CompanyResponse update(UUID id, CompanyRequest request) {
        log.info("Updating company id={}", id);
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found"));
        Company updated = CompanyMapper.toEntity(request, null);
        updated.setIdCompany(company.getIdCompany());
        try {
            // persist changes now to catch constraint violations early
            updated = companyRepository.saveAndFlush(updated);
            log.info("Company updated id={}", updated.getIdCompany());
        } catch (DataIntegrityViolationException e) {
            throw new BusinessException("CNPJ already registered", HttpStatus.CONFLICT);
        }
        return CompanyMapper.toResponse(updated);
    }

    @Transactional
    public void delete(UUID id) {
        log.info("Deleting company id={}", id);
        if (!companyRepository.existsById(id)) {
            throw new ResourceNotFoundException("Company not found");
        }
        if (companySupplierRepository.existsByCompany_IdCompany(id)) {
            throw new BusinessException(
                    "Cannot delete company as it has linked suppliers. Remove the links first.",
                    HttpStatus.CONFLICT
            );
        }
        companyRepository.deleteById(id);
        log.info("Company deleted id={}", id);
    }

    @Transactional
    public void associateSupplier(UUID companyId, UUID supplierId) {
        log.info("Associating supplier {} to company {}", supplierId, companyId);
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found"));
        Supplier supplier = supplierRepository.findById(supplierId)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found"));

        if ("PR".equalsIgnoreCase(company.getAddress().getState()) &&
                supplier.getDocumentType() == DocumentType.F &&
                supplier.getBirthDate() != null &&
                Period.between(supplier.getBirthDate(), LocalDate.now()).getYears() < 18) {
            throw new BusinessException(
                    "Cannot associate underage individual supplier to companies located in Paraná",
                    HttpStatus.UNPROCESSABLE_CONTENT
            );
        }

        CompanySupplier cs = new CompanySupplier(company, supplier);
        companySupplierRepository.save(cs);
        log.info("Supplier {} associated to company {}", supplierId, companyId);
    }

    @Transactional
    public void dissociateSupplier(UUID companyId, UUID supplierId) {
        log.info("Dissociating supplier {} from company {}", supplierId, companyId);
        CompanySupplierId id = new CompanySupplierId(companyId, supplierId);
        if (!companySupplierRepository.existsById(id)) {
            throw new ResourceNotFoundException("Association not found");
        }
        companySupplierRepository.deleteById(id);
        log.info("Supplier {} dissociated from company {}", supplierId, companyId);
    }

    public List<SupplierResponse> getSuppliers(UUID companyId) {
        log.debug("Getting suppliers for company id={}", companyId);
        if (!companyRepository.existsById(companyId)) {
            throw new ResourceNotFoundException("Company not found");
        }
        return companySupplierRepository.findByCompany_IdCompany(companyId).stream()
                .map(cs -> SupplierMapper.toResponse(cs.getSupplier()))
                .collect(Collectors.toList());
    }
}