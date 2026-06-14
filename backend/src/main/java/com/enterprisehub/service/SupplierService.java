package com.enterprisehub.service;

import com.enterprisehub.dto.SupplierRequest;
import com.enterprisehub.dto.SupplierResponse;
import com.enterprisehub.entity.Supplier;
import com.enterprisehub.exception.BusinessException;
import com.enterprisehub.exception.ResourceNotFoundException;
import com.enterprisehub.mapper.SupplierMapper;
import com.enterprisehub.repository.CompanySupplierRepository;
import com.enterprisehub.repository.SupplierRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class SupplierService {

    private final SupplierRepository supplierRepository;
    private final CompanySupplierRepository companySupplierRepository;

    @Transactional
    public SupplierResponse create(SupplierRequest request) {
        log.info("Creating supplier (document={})", request.getDocumentNumber());

        if (supplierRepository.existsByDocumentNumber(request.getDocumentNumber())) {
            throw new BusinessException("CPF/CNPJ already registered", HttpStatus.CONFLICT);
        }

        Supplier entity = SupplierMapper.toEntity(request);
        entity = supplierRepository.saveAndFlush(entity);
        log.info("Supplier created with id={}", entity.getIdSupplier());
        return SupplierMapper.toResponse(entity);
    }

    public List<SupplierResponse> findAll(String nome, String documento) {
        log.debug("Finding suppliers by name='{}' document='{}'", nome, documento);
        List<Supplier> suppliers;
        if (nome != null && documento != null) {
            suppliers = supplierRepository.findByNameContainingIgnoreCaseAndDocumentNumberContaining(nome, documento);
        } else if (nome != null) {
            suppliers = supplierRepository.findByNameContainingIgnoreCase(nome);
        } else if (documento != null) {
            suppliers = supplierRepository.findByDocumentNumberContaining(documento);
        } else {
            suppliers = supplierRepository.findAll();
        }
        return suppliers.stream().map(SupplierMapper::toResponse).collect(Collectors.toList());
    }

    public SupplierResponse findById(UUID id) {
        log.debug("Finding supplier by id={}", id);
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found"));
        return SupplierMapper.toResponse(supplier);
    }

    @Transactional
    public SupplierResponse update(UUID id, SupplierRequest request) {
        log.info("Updating supplier id={}", id);
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found"));
        Supplier updated = SupplierMapper.toEntity(request);
        updated.setIdSupplier(supplier.getIdSupplier());
        try {
            updated = supplierRepository.saveAndFlush(updated);
            log.info("Supplier updated id={}", updated.getIdSupplier());
        } catch (DataIntegrityViolationException e) {
            throw new BusinessException("CPF/CNPJ already registered", HttpStatus.CONFLICT);
        }
        return SupplierMapper.toResponse(updated);
    }

    @Transactional
    public void delete(UUID id) {
        log.info("Deleting supplier id={}", id);
        if (!supplierRepository.existsById(id)) {
            throw new ResourceNotFoundException("Supplier not found");
        }
        if (companySupplierRepository.existsBySupplier_IdSupplier(id)) {
            throw new BusinessException(
                    "Cannot delete supplier as it has linked companies. Remove the links first.",
                    HttpStatus.CONFLICT
            );
        }
        supplierRepository.deleteById(id);
        log.info("Supplier deleted id={}", id);
    }
}