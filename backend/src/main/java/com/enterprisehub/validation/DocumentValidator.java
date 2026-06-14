package com.enterprisehub.validation;

public class DocumentValidator {

    public static boolean isValidCpf(String cpf) {
        if (cpf == null || cpf.isBlank()) return false;
        String numbers = cpf.replaceAll("\\D", "");
        if (numbers.length() != 11 || numbers.matches("(\\d)\\1{10}")) return false;

        int[] weights1 = {10, 9, 8, 7, 6, 5, 4, 3, 2};
        int[] weights2 = {11, 10, 9, 8, 7, 6, 5, 4, 3, 2};
        try {
            int sum = 0;
            for (int i = 0; i < 9; i++) sum += (numbers.charAt(i) - '0') * weights1[i];
            int digit1 = (sum % 11) < 2 ? 0 : 11 - (sum % 11);

            sum = 0;
            for (int i = 0; i < 10; i++) sum += (numbers.charAt(i) - '0') * weights2[i];
            int digit2 = (sum % 11) < 2 ? 0 : 11 - (sum % 11);

            return digit1 == (numbers.charAt(9) - '0') && digit2 == (numbers.charAt(10) - '0');
        } catch (NumberFormatException e) {
            return false;
        }
    }

    public static boolean isValidCnpj(String cnpj) {
        if (cnpj == null || cnpj.isBlank()) return false;
        String numbers = cnpj.replaceAll("\\D", "");
        if (numbers.length() != 14) return false;

        int[] weights1 = {5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2};
        int[] weights2 = {6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2};
        try {
            int sum = 0;
            for (int i = 0; i < 12; i++) sum += (numbers.charAt(i) - '0') * weights1[i];
            int digit1 = (sum % 11) < 2 ? 0 : 11 - (sum % 11);

            sum = 0;
            for (int i = 0; i < 13; i++) sum += (numbers.charAt(i) - '0') * weights2[i];
            int digit2 = (sum % 11) < 2 ? 0 : 11 - (sum % 11);

            return digit1 == (numbers.charAt(12) - '0') && digit2 == (numbers.charAt(13) - '0');
        } catch (NumberFormatException e) {
            return false;
        }
    }
}