package com.example.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.backend.dto.request.CreateCommentRequest;
import com.example.backend.dto.request.LikeRequest;
import com.example.backend.dto.response.BaseResponse;

import lombok.RequiredArgsConstructor;

import com.example.backend.model.Comment;
import com.example.backend.service.CommentService;

@RestController
@RequestMapping("api/user")
@RequiredArgsConstructor
public class CommentController {

  private final CommentService commentService;

  @PostMapping(value = "/comment", consumes = "multipart/form-data")
  public ResponseEntity<BaseResponse<Comment>> createComment(
      @RequestParam("userId") String userId,
      @RequestParam("postId") String postId,
      @RequestParam("content") String content,
      @RequestParam(value = "image", required = false) MultipartFile image) {
    CreateCommentRequest req = CreateCommentRequest.builder()
        .userId(userId)
        .postId(postId)
        .content(content)
        .image(image)
        .build();
    return ResponseEntity.ok(commentService.createComment(req));
  }

  @PostMapping("/comment/like")
  public ResponseEntity<BaseResponse<Comment>> postMethodName(@RequestBody LikeRequest req) {
    return ResponseEntity.ok(commentService.likeComment(req));
  }

}
