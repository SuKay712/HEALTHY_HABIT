package com.example.backend.service;

import java.util.List;

import com.example.backend.dto.request.CreatePostRequest;
import com.example.backend.dto.request.UpdatePostRequest;
import com.example.backend.dto.response.BaseResponse;
import com.example.backend.model.Post;

public interface PostService {

  BaseResponse<Post> createPost(CreatePostRequest req);

  BaseResponse<Post> updatePost(UpdatePostRequest req);

  BaseResponse<List<Post>> getAllPost(String userId);
}
