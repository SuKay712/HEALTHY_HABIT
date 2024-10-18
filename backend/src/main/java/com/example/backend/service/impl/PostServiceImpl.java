package com.example.backend.service.impl;

import org.springframework.stereotype.Service;

import com.example.backend.service.PostService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PostServiceImpl implements PostService {
  // Co cai @RequiredArgsConstructor khong can @AutoWired
  // private final PostRepository postRepository;
}
