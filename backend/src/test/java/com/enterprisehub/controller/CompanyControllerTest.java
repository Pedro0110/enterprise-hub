package com.enterprisehub.controller;

import com.enterprisehub.dto.CompanyRequest;
import com.enterprisehub.dto.CompanyResponse;
import com.enterprisehub.exception.GlobalExceptionHandler;
import com.enterprisehub.exception.BusinessException;
import com.enterprisehub.exception.ResourceNotFoundException;
import com.enterprisehub.service.CompanyService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpStatus;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import tools.jackson.databind.ObjectMapper;

import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(SpringExtension.class)
@WebMvcTest(controllers = CompanyController.class)
@Import(GlobalExceptionHandler.class)
public class CompanyControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private CompanyService companyService;

    @Test
    void shouldCreateCompany_WhenValidRequest() throws Exception {
        CompanyRequest req = new CompanyRequest();
        req.setDocumentNumber("12345678000195");
        req.setTradeName("Acme");
        req.setAddressZipCode("12345678");

        CompanyResponse resp = new CompanyResponse();
        resp.setIdCompany(UUID.randomUUID());
        resp.setDocumentNumber(req.getDocumentNumber());
        resp.setTradeName(req.getTradeName());

        when(companyService.create(any())).thenReturn(resp);

        mockMvc.perform(post("/companies")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.documentNumber").value(req.getDocumentNumber()));
    }

    @Test
    void shouldReturnBadRequest_WhenCnpjInvalid() throws Exception {
        CompanyRequest req = new CompanyRequest();
        req.setDocumentNumber("123");
        req.setTradeName("Acme");
        req.setAddressZipCode("123");

        mockMvc.perform(post("/companies")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Validation Failed"));
    }

    @Test
    void shouldGetCompanies_WhenCalled() throws Exception {
        CompanyResponse r = new CompanyResponse();
        r.setIdCompany(UUID.randomUUID());
        r.setDocumentNumber("12345678000195");
        r.setTradeName("Acme");

        when(companyService.findAll()).thenReturn(List.of(r));

        mockMvc.perform(get("/companies"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].documentNumber").value("12345678000195"));
    }

    @Test
    void shouldReturnNotFound_WhenGetByIdMissing() throws Exception {
        UUID id = UUID.randomUUID();
        when(companyService.findById(id)).thenThrow(new ResourceNotFoundException("Company not found"));

        mockMvc.perform(get("/companies/" + id))
                .andExpect(status().isNotFound());
    }

    @Test
    void shouldDeleteCompany_WhenExists() throws Exception {
        UUID id = UUID.randomUUID();
        Mockito.doNothing().when(companyService).delete(id);

        mockMvc.perform(delete("/companies/" + id))
                .andExpect(status().isNoContent());
    }

    @Test
    void shouldAssociateSupplier_WhenSuccess() throws Exception {
        UUID companyId = UUID.randomUUID();
        UUID supplierId = UUID.randomUUID();

        Mockito.doNothing().when(companyService).associateSupplier(companyId, supplierId);

        mockMvc.perform(post(String.format("/companies/%s/suppliers/%s", companyId, supplierId)))
                .andExpect(status().isOk());
    }

    @Test
    void shouldReturnUnprocessable_WhenAssociateUnderage() throws Exception {
        UUID companyId = UUID.randomUUID();
        UUID supplierId = UUID.randomUUID();
        doThrow(new BusinessException("Underage", HttpStatus.UNPROCESSABLE_ENTITY))
                .when(companyService).associateSupplier(companyId, supplierId);

        mockMvc.perform(post(String.format("/companies/%s/suppliers/%s", companyId, supplierId)))
                .andExpect(status().isUnprocessableEntity())
                .andExpect(jsonPath("$.status").value(HttpStatus.UNPROCESSABLE_ENTITY.value()));
    }
}

