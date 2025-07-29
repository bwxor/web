package com.bwxor.backend.dto;

public class ProfileDto {
    private String email;
    private boolean isAdmin;
    private int birthYear;
    private String biography;

    public ProfileDto(String email, boolean isAdmin, int birthYear, String biography) {
        this.email = email;
        this.isAdmin = isAdmin;
        this.birthYear = birthYear;
        this.biography = biography;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public boolean isAdmin() {
        return isAdmin;
    }

    public void setAdmin(boolean admin) {
        isAdmin = admin;
    }

    public int getBirthYear() {
        return birthYear;
    }

    public void setBirthYear(int birthYear) {
        this.birthYear = birthYear;
    }

    public String getBiography() {
        return biography;
    }

    public void setBiography(String biography) {
        this.biography = biography;
    }
}
