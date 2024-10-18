package com.example.backend.service.impl;

import org.springframework.stereotype.Service;

import com.example.backend.service.NotificationService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {
  // Co cai @RequiredArgsConstructor khong can @AutoWired
  // private final NotificationRepository notificationRepository;
}
