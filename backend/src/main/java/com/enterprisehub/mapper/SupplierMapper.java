package com.enterprisehub.mapper;

import com.enterprisehub.dto.SupplierRequest;
import com.enterprisehub.dto.SupplierResponse;
import com.enterprisehub.entity.Supplier;
import com.enterprisehub.entity.embeddable.Address;

public class SupplierMapper {

    public static Supplier toEntity(SupplierRequest request) {
        Supplier supplier = new Supplier();
        supplier.setDocumentNumber(request.getDocumentNumber());
        supplier.setDocumentType(request.getDocumentType());
        supplier.setName(request.getName());
        supplier.setEmail(request.getEmail());
        supplier.setRg(request.getRg());
        supplier.setBirthDate(request.getBirthDate());
        supplier.setAddress(buildAddress(request));
        return supplier;
    }

    public static SupplierResponse toResponse(Supplier entity) {
        SupplierResponse response = new SupplierResponse();
        response.setIdSupplier(entity.getIdSupplier());
        response.setDocumentNumber(entity.getDocumentNumber());
        response.setDocumentType(entity.getDocumentType());
        response.setName(entity.getName());
        response.setEmail(entity.getEmail());
        response.setRg(entity.getRg());
        response.setBirthDate(entity.getBirthDate());
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

    private static Address buildAddress(SupplierRequest request) {
        Address address = new Address();
        address.setZipCode(request.getAddressZipCode());
        address.setStreet(request.getAddressStreet());
        address.setNeighborhood(request.getAddressNeighborhood());
        address.setCity(request.getAddressCity());
        address.setState(request.getAddressState());
        address.setNumber(request.getAddressNumber());
        return address;
    }
}