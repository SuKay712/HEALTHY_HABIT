package com.example.backend.service.impl;

import org.springframework.stereotype.Service;

import com.example.backend.service.CommentService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {
  // Co cai @RequiredArgsConstructor khong can @AutoWired
  // private final CommentRepository commentRepository;
}
