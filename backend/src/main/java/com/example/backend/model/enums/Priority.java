package com.example.backend.model.enums;

public enum Priority {
  HIGH("Cao"),
  MEDIUM("Trung bình"),
  LOW("Thấp");

  private final String value;

  Priority(String description) {
    this.value = description;
  }

  public String getValue() {
    return value;
  }
}
