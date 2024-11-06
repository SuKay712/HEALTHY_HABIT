package com.example.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.backend.dto.request.CreatePostRequest;
import com.example.backend.dto.request.UpdatePostRequest;
import com.example.backend.dto.response.BaseResponse;
import com.example.backend.model.Post;
import com.example.backend.service.PostService;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("api/user")
@RequiredArgsConstructor
public class PostController {

  private final PostService postService;

  @PostMapping(value = "/post", consumes = "multipart/form-data")
  public ResponseEntity<BaseResponse<Post>> createPost(
      @RequestPart("userId") String userId,
      @RequestPart("content") String content,
      @RequestPart("image") MultipartFile image) {
    CreatePostRequest req = CreatePostRequest.builder()
        .userId(userId)
        .content(content)
        .image(image)
        .build();
    return ResponseEntity.ok(postService.createPost(req));
  }

  @PutMapping(value = "/post", consumes = "multipart/form-data")
  public ResponseEntity<BaseResponse<Post>> updatePost(
      @RequestPart("postId") String postId,
      @RequestPart("content") String content,
      @RequestPart(value = "image", required = false) MultipartFile image,
      @RequestPart("isDeleteImage") String isDeleteImage) {
    UpdatePostRequest req = UpdatePostRequest.builder()
        .postId(postId)
        .content(content)
        .image(image)
        .isDeleteImage(Boolean.parseBoolean(isDeleteImage))
        .build();
    return ResponseEntity.ok(postService.updatePost(req));
  }

  @GetMapping("/post")
  public ResponseEntity<BaseResponse<List<Post>>> getMethodName(@RequestParam String param) {
    return ResponseEntity.ok(postService.getAllPost(param));
  }

}
