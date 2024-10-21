package com.example.backend.dto.request;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

import com.example.backend.model.enums.DateOfWeek;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateTaskRequest {
  private String userId;

  private String name;

  private String description;

  private String prize;

  private List<DateOfWeek> timer;

  private LocalDate dateStart;

  private LocalDate dateEnd;

  private String timeExpired;

  public void setDateStart(String dateStart) {
    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
    this.dateStart = LocalDate.parse(dateStart, formatter);
  }

  public void setDateEnd(String dateEnd) {
    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
    this.dateEnd = LocalDate.parse(dateEnd, formatter);
  }
}
