package com.enterprisehub.service;

import com.enterprisehub.dto.CepResponse;
import com.enterprisehub.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
@Slf4j
public class CepService {

    private final RestTemplate restTemplate;
    @Value("${app.cep.url:http://viacep.com.br/ws/%s/json/}")
    private String cepBaseUrl;

    public CepResponse fetchCep(String cep) {
        String normalized = cep.replaceAll("\\D", "");
        String url = String.format(cepBaseUrl.trim(), normalized);

        log.debug("Consulting postal code {} via {}", normalized, url);
        try {
            ResponseEntity<CepResponse> response = restTemplate.getForEntity(url, CepResponse.class);
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                return response.getBody();
            }
            throw new BusinessException("Postal code not found", HttpStatus.NOT_FOUND);
        } catch (RestClientException e) {
            log.error("Error consulting postal code service for {}: {}", normalized, e.getMessage());
            throw new BusinessException("Postal code service unavailable", HttpStatus.SERVICE_UNAVAILABLE);
        }
    }

}