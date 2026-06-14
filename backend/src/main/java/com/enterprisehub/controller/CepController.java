package com.enterprisehub.controller;

import com.enterprisehub.dto.CepResponse;
import com.enterprisehub.service.CepService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/cep")
@RequiredArgsConstructor
public class CepController {

    private final CepService cepService;

    @GetMapping("/{cep}")
    public ResponseEntity<CepResponse> getCep(@PathVariable String cep) {
        CepResponse dto = cepService.fetchCep(cep);
        return ResponseEntity.ok(dto);
    }
}

