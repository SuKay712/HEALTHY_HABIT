package com.example.backend.dto.request;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import lombok.Data;
@Data
public class TaskInDateRequest {
  private LocalDate time;
  private String userId;
  public void setTime(String time) {
    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
    this.time = LocalDate.parse(time, formatter);
  }
}
