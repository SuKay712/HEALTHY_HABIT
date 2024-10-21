package com.example.backend.utils;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.backend.model.Progress;

@Service
public class DateTimeUtils {

  public static Progress findMatchingProgress(List<Progress> progressList, LocalDate targetDate) {
    return progressList.stream()
        .filter(progress -> progress.getDate().isEqual(targetDate))
        .findFirst()
        .orElse(null);
  }
}
