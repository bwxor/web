package com.bwxor.backend.util;

public class PasswordValidator {
    private static final String UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private static final String LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
    private static final String DIGITS = "0123456789";
    private static final String SPECIAL_CHARACTERS = "!?@#$%^&*";

    public boolean validatePassword(String password) {
        boolean hasUppercase = false, hasLowerCase = false, hasDigit = false, hasSpecialChar = false;

        if (password.length() < 16) {
            return false;
        }

        for (int i = 0; i<password.length(); i++) {
            if (UPPERCASE.contains(password.substring(i, 1))) {
                hasUppercase = true;
            }
            else if (LOWERCASE.contains(password.substring(i, 1))) {
                hasLowerCase = true;
            }
            else if (DIGITS.contains(password.substring(i, 1))) {
                hasDigit = true;
            }
            else if (SPECIAL_CHARACTERS.contains(password.substring(i, 1))) {
                hasSpecialChar = true;
            }
        }

        return hasUppercase && hasLowerCase && hasDigit && hasSpecialChar;
    }
}
