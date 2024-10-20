package com.example.backend.dto.response;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;

import lombok.Data;

@Data
public class BaseResponse<T> {
  private final Boolean isSuccess;
  private final String message;
  @JsonFormat(pattern = "dd-MM-yyyy HH:mm:ss")
  @JsonDeserialize(using = LocalDateTimeDeserializer.class)
  @JsonSerialize(using = LocalDateTimeSerializer.class)
  private final LocalDateTime timeStamp;
  private final T data;

  public BaseResponse(Boolean isSuccess, String message, T data) {
    this.isSuccess = isSuccess;
    this.message = message;
    this.timeStamp = LocalDateTime.now();
    this.data = data;
  }
}