package com.example.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.backend.dto.request.CreatePostRequest;
import com.example.backend.dto.request.LikeRequest;
import com.example.backend.dto.request.SaveRequest;
import com.example.backend.dto.request.UpdatePostRequest;
import com.example.backend.dto.response.BaseResponse;
import com.example.backend.dto.response.PagedAllPostsResponse;
import com.example.backend.model.Post;
import com.example.backend.service.PostService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("api/user")
@RequiredArgsConstructor
public class PostController {

  private final PostService postService;

  @PostMapping(value = "/post", consumes = "multipart/form-data")
  public ResponseEntity<BaseResponse<Post>> createPost(
      @RequestParam("userId") String userId,
      @RequestParam("content") String content,
      @RequestParam(value = "image", required = false) MultipartFile image,
      @RequestParam("isPrivate") String isPrivate) {
    System.out.println("CHECK: " + content);
    CreatePostRequest req = CreatePostRequest.builder()
        .userId(userId)
        .content(content)
        .image(image)
        .isPrivate(isPrivate)
        .build();
    return ResponseEntity.ok(postService.createPost(req));
  }

  @PutMapping(value = "/post", consumes = "multipart/form-data")
  public ResponseEntity<BaseResponse<Post>> updatePost(
      @RequestParam("postId") String postId,
      @RequestParam("content") String content,
      @RequestParam(value = "image", required = false) MultipartFile image,
      @RequestParam("isDeleteImage") String isDeleteImage) {
    UpdatePostRequest req = UpdatePostRequest.builder()
        .postId(postId)
        .content(content)
        .image(image)
        .isDeleteImage(Boolean.parseBoolean(isDeleteImage))
        .build();
    return ResponseEntity.ok(postService.updatePost(req));
  }

  @GetMapping("/post")
  public ResponseEntity<BaseResponse<List<Post>>> getPosts(@RequestParam String param) {
    return ResponseEntity.ok(postService.getAllPostByUserId(param));
  }

  @GetMapping("/allPost")
  public ResponseEntity<BaseResponse<PagedAllPostsResponse>> getAllPosts(
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "2") int size) {
    return ResponseEntity.ok(postService.getAllPost(page, size));
  }

  @GetMapping("/hotPost")
  public ResponseEntity<BaseResponse<List<Post>>> getHotPosts() {
    return ResponseEntity.ok(postService.getHotPosts());
  }

  @PostMapping("/post/like")
  public ResponseEntity<BaseResponse<Post>> postMethodName(@RequestBody LikeRequest req) {
    return ResponseEntity.ok(postService.likePost(req));
  }

  @PostMapping("/post/save")
  public ResponseEntity<BaseResponse<Post>> savePost(@RequestBody SaveRequest req) {
    return ResponseEntity.ok(postService.savePost(req));
  }
}
