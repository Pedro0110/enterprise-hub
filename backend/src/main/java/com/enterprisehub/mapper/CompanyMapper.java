package com.enterprisehub.mapper;

import com.enterprisehub.dto.CompanyRequest;
import com.enterprisehub.dto.CompanyResponse;
import com.enterprisehub.entity.Company;
import com.enterprisehub.entity.embeddable.Address;

public class CompanyMapper {

    public static Company toEntity(CompanyRequest request, Address cepAddress) {
        Company company = new Company();
        company.setDocumentNumber(request.getDocumentNumber());
        company.setTradeName(request.getTradeName());
        company.setAddress(buildAddress(request, cepAddress));
        return company;
    }

    public static CompanyResponse toResponse(Company entity) {
        CompanyResponse response = new CompanyResponse();
        response.setIdCompany(entity.getIdCompany());
        response.setDocumentNumber(entity.getDocumentNumber());
        response.setTradeName(entity.getTradeName());
        if (entity.getAddress() != null) {
            response.setAddressZipCode(entity.getAddress().getZipCode());
            response.setAddressStreet(entity.getAddress().getStreet());
            response.setAddressNeighborhood(entity.getAddress().getNeighborhood());
            response.setAddressCity(entity.getAddress().getCity());
            response.setAddressState(entity.getAddress().getState());
            response.setAddressNumber(entity.getAddress().getNumber());
        }
        response.setCreatedAt(entity.getCreatedAt());
        response.setUpdatedAt(entity.getUpdatedAt());
        return response;
    }

    private static Address buildAddress(CompanyRequest request, Address cepAddress) {
        Address address = new Address();
        address.setZipCode(request.getAddressZipCode());
        if (request.getAddressStreet() != null) {
            address.setStreet(request.getAddressStreet());
        } else if (cepAddress != null) {
            address.setStreet(cepAddress.getStreet());
        }

        if (request.getAddressNeighborhood() != null) {
            address.setNeighborhood(request.getAddressNeighborhood());
        } else if (cepAddress != null) {
            address.setNeighborhood(cepAddress.getNeighborhood());
        }

        if (request.getAddressCity() != null) {
            address.setCity(request.getAddressCity());
        } else if (cepAddress != null) {
            address.setCity(cepAddress.getCity());
        }

        if (request.getAddressState() != null) {
            address.setState(request.getAddressState());
        } else if (cepAddress != null) {
            address.setState(cepAddress.getState());
        }
        address.setNumber(request.getAddressNumber());
        return address;
    }
}