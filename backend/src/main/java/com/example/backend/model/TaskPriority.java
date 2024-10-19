package com.example.backend.model;

public enum TaskPriority {
  HIGH("Cao"),
  MEDIUM("Trung bình"),
  LOW("Thấp");

  private final String value;

  TaskPriority(String description) {
    this.value = description;
  }

  public String getValue() {
    return value;
  }
}
