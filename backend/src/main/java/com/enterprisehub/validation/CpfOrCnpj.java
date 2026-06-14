package com.enterprisehub.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = CpfOrCnpjValidator.class)
@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
public @interface CpfOrCnpj {
    String message() default "Invalid CPF/CNPJ";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}