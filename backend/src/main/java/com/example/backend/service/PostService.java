package com.example.backend.service;

import java.util.List;

import com.example.backend.dto.request.CreatePostRequest;
import com.example.backend.dto.request.LikeRequest;
import com.example.backend.dto.request.UpdatePostRequest;
import com.example.backend.dto.response.BaseResponse;
import com.example.backend.model.Post;

public interface PostService {

  BaseResponse<Post> createPost(CreatePostRequest req);

  BaseResponse<Post> updatePost(UpdatePostRequest req);

  BaseResponse<List<Post>> getAllPostByUserId(String userId);

  BaseResponse<List<Post>> getAllPost();

  BaseResponse<List<Post>> getHotPosts();

  BaseResponse<Post> likePost(LikeRequest req);
}
