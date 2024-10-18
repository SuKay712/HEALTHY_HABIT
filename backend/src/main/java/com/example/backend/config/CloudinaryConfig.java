package com.example.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.cloudinary.Cloudinary;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;

@Configuration
@RequiredArgsConstructor
public class CloudinaryConfig {
  @Value("${CLOUDINARY_NAME}")
  private String cloudName;

  @Value("${CLOUDINARY_API_KEY}")
  private String apiKey;

  @Value("${CLOUDINARY_API_SECRET}")
  private String apiSecret;

  @Bean
  public Cloudinary cloudinary() {
    Cloudinary cloudinary = new Cloudinary();
    cloudinary.config.cloudName = cloudName;
    cloudinary.config.apiKey = apiKey;
    cloudinary.config.apiSecret = apiSecret;
    return cloudinary;
  }
}
