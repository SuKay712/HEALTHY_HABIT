package com.example.backend.service;


import com.example.backend.dto.request.CreateCommentRequest;
import com.example.backend.dto.request.LikeRequest;
import com.example.backend.dto.response.BaseResponse;
import com.example.backend.model.Comment;

public interface CommentService {
  BaseResponse<Comment> createComment(CreateCommentRequest req);
  BaseResponse<Comment> likeComment(LikeRequest req);
}
