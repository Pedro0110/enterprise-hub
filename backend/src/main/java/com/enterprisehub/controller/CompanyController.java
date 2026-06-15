package com.enterprisehub.controller;

import com.enterprisehub.dto.CompanyRequest;
import com.enterprisehub.dto.CompanyResponse;
import com.enterprisehub.dto.SupplierResponse;
import com.enterprisehub.service.CompanyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/companies")
@RequiredArgsConstructor
@Slf4j
public class CompanyController {

    private final CompanyService companyService;

    @PostMapping
    public ResponseEntity<CompanyResponse> create(@Valid @RequestBody CompanyRequest request) {
        log.info("HTTP POST /companies create request (document={})", request.getDocumentNumber());
        return ResponseEntity.status(HttpStatus.CREATED).body(companyService.create(request));
    }

    @GetMapping
    public ResponseEntity<List<CompanyResponse>> findAll() {
        return ResponseEntity.ok(companyService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CompanyResponse> findById(@PathVariable UUID id) {
        return ResponseEntity.ok(companyService.findById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CompanyResponse> update(@PathVariable UUID id, @Valid @RequestBody CompanyRequest request) {
        return ResponseEntity.ok(companyService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        companyService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{companyId}/suppliers/{supplierId}")
    public ResponseEntity<Void> associateSupplier(@PathVariable UUID companyId, @PathVariable UUID supplierId) {
        log.info("HTTP POST /companies/{}/suppliers/{} - associate", companyId, supplierId);
        companyService.associateSupplier(companyId, supplierId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{companyId}/suppliers/{supplierId}")
    public ResponseEntity<Void> dissociateSupplier(@PathVariable UUID companyId, @PathVariable UUID supplierId) {
        companyService.dissociateSupplier(companyId, supplierId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{companyId}/suppliers")
    public ResponseEntity<List<SupplierResponse>> getSuppliers(@PathVariable UUID companyId) {
        return ResponseEntity.ok(companyService.getSuppliers(companyId));
    }
}