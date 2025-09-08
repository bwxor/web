package com.bwxor.backend.reqres;

public record ServiceResponse<T>(T item, ServiceError serviceError) {
    public static <T> ServiceResponse<T> ofItem(T item) {
        return new ServiceResponse<>(item, null);
    }

    public static <T> ServiceResponse<T> ofError(Class<T> clazz, String errorMessage) {
        return new ServiceResponse<>(null,
                new ServiceError(errorMessage));
    }

    public boolean ok() {
        return serviceError == null;
    }
}
