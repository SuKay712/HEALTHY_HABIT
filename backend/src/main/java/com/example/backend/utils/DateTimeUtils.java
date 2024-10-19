package com.example.backend.utils;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.backend.model.Progress;

@Service
public class DateTimeUtils {

    public static Progress findMatchingProgress(List<Progress> progressList, LocalDateTime targetDate) {
      return progressList.stream()
              .filter(progress -> progress.getDate().toLocalDate().isEqual(targetDate.toLocalDate()))
              .findFirst()
              .orElse(null);
    }
}
