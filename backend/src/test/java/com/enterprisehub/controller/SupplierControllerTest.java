package com.enterprisehub.controller;

import com.enterprisehub.dto.SupplierRequest;
import com.enterprisehub.dto.SupplierResponse;
import com.enterprisehub.exception.GlobalExceptionHandler;
import com.enterprisehub.exception.ResourceNotFoundException;
import com.enterprisehub.service.SupplierService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import tools.jackson.databind.ObjectMapper;

import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(SpringExtension.class)
@WebMvcTest(controllers = SupplierController.class)
@Import(GlobalExceptionHandler.class)
public class SupplierControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private SupplierService supplierService;

    @Test
    void shouldCreateSupplier_WhenValid() throws Exception {
        SupplierRequest req = new SupplierRequest();
        req.setDocumentNumber("12345678909");
        req.setDocumentType(com.enterprisehub.entity.enums.DocumentType.F);
        req.setName("Joao");
        req.setEmail("joao@example.com");
        req.setRg("RG123");
        req.setBirthDate(java.time.LocalDate.now().minusYears(30));
        req.setAddressZipCode("12345678");

        SupplierResponse resp = new SupplierResponse();
        resp.setIdSupplier(UUID.randomUUID());
        resp.setDocumentNumber(req.getDocumentNumber());
        resp.setName(req.getName());

        when(supplierService.create(any())).thenReturn(resp);

        mockMvc.perform(post("/suppliers")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.documentNumber").value(req.getDocumentNumber()));
    }

    @Test
    void shouldFindAll_WithFilters() throws Exception {
        SupplierResponse r = new SupplierResponse();
        r.setIdSupplier(UUID.randomUUID());
        r.setDocumentNumber("12345678909");
        r.setName("Joao");

        when(supplierService.findAll("Joao", "123")).thenReturn(List.of(r));

        mockMvc.perform(get("/suppliers?nome=Joao&documento=123"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Joao"));
    }

    @Test
    void shouldReturnNotFound_WhenGetByIdMissing() throws Exception {
        UUID id = UUID.randomUUID();
        when(supplierService.findById(id)).thenThrow(new ResourceNotFoundException("Supplier not found"));

        mockMvc.perform(get("/suppliers/" + id))
                .andExpect(status().isNotFound());
    }

    @Test
    void shouldDeleteSupplier_WhenExists() throws Exception {
        UUID id = UUID.randomUUID();
        Mockito.doNothing().when(supplierService).delete(id);

        mockMvc.perform(delete("/suppliers/" + id))
                .andExpect(status().isNoContent());
    }
}

