package com.bwxor.backend.validator.impl;

import com.bwxor.backend.validator.StringValidator;

public class SlugValidator implements StringValidator {
    public boolean isValid(String str) {
        if (str.startsWith("-") || str.endsWith("-")) {
            return false;
        }

        boolean minusPreviously = false;

        for (int i = 0; i < str.length(); i++) {
            char ch = str.charAt(i);
            int code = (int) ch;

            if (!((code > 47 && code < 58) || // 0-9
                    (code > 64 && code < 91) || // A-Z
                    (code > 96 && code < 123) || // a-z
                    code == 45)) { // '-'
                return false;
            }

            if (code == 45) {
                if (minusPreviously) {
                    return true;
                }
                minusPreviously = true;
            } else {
                minusPreviously = false;
            }
        }

        return true;
    }
}
