package com.example.backend.config;

import java.util.Properties;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

@Configuration
public class EmailConfig {
  @Value("${MAIL_HOST}")
  private String mailHost;
  @Value("${MAIL_PORT}")
  private String mailPort;
  @Value("${MAIL_USERNAME}")
  private String mailUsername;
  @Value("${MAIL_PASSWORD}")
  private String mailPassword;

  @Bean
  public JavaMailSender getJavaMailSender() {
    JavaMailSenderImpl javaMailSender = new JavaMailSenderImpl();
    javaMailSender.setHost(mailHost);
    javaMailSender.setPort(Integer.parseInt(mailPort));
    javaMailSender.setUsername(mailUsername);
    javaMailSender.setPassword(mailPassword);

    Properties props = javaMailSender.getJavaMailProperties();
    props.put("mail.smtp.starttls.enable", "true");
    return javaMailSender;
  }
}
