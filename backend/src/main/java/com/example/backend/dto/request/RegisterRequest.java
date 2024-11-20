package com.example.backend.dto.request;

import java.time.LocalDate;

import org.springframework.format.annotation.DateTimeFormat;

import lombok.Data;

@Data
public class RegisterRequest {
    private String username;
    private String password;
    private String displayName;
    private String email;
    private boolean sex;
    @DateTimeFormat(pattern = "dd MM yy")  
    private LocalDate birthday;
}
