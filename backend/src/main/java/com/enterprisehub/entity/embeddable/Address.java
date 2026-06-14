package com.enterprisehub.entity.embeddable;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Address {

    @Column(name = "address_zip_code", nullable = false)
    private String zipCode;

    @Column(name = "address_street")
    private String street;

    @Column(name = "address_neighborhood")
    private String neighborhood;

    @Column(name = "address_city")
    private String city;

    @Column(name = "address_state")
    private String state;

    @Column(name = "address_number")
    private String number;
}