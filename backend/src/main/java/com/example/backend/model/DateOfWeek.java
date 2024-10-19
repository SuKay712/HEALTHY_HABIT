package com.example.backend.model;

public enum DateOfWeek {
  ALL(0),
  SUNDAY(1),
  MONDAY(2),
  TUESDAY(3),
  WEDNESDAY(4),
  THURSDAY(5),
  FRIDAY(6),
  SATURDAY(7);

  private final int value;

  DateOfWeek(int value) {
    this.value = value;
  }

  public int getValue() {
    return value;
  }

  public static DateOfWeek fromValue(int value) {
    for (DateOfWeek day : DateOfWeek.values()) {
      if (day.getValue() == value) {
        return day;
      }
    }
    throw new IllegalArgumentException("Invalid day value: " + value);
  }
}
