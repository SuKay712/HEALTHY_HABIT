package com.example.backend.service.impl;

import org.springframework.stereotype.Service;

import com.example.backend.service.TaskService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService {
  // Co cai @RequiredArgsConstructor khong can @AutoWired
  // private final TaskRepository taskRepository;
}
