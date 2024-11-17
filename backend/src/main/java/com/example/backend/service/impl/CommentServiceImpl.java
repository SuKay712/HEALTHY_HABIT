package com.example.backend.service.impl;

import java.io.IOException;
import java.util.Optional;

import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;

import com.example.backend.dto.request.CreateCommentRequest;
import com.example.backend.dto.request.LikeRequest;
import com.example.backend.dto.response.BaseResponse;
import com.example.backend.model.Comment;
import com.example.backend.model.Post;
import com.example.backend.model.User;
import com.example.backend.repository.CommentRepository;
import com.example.backend.repository.PostRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.CommentService;
import com.example.backend.utils.CloudinaryUtils;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {
  private final PostRepository postRepository;
  private final CommentRepository commentRepository;
  private final CloudinaryUtils cloudinaryUtils;
  private final UserRepository userRepository;

  @Override
  public BaseResponse<Comment> createComment(CreateCommentRequest req) {
    Optional<User> userOptional = userRepository.findById(req.getUserId());
    Post post = postRepository.findById(new ObjectId(req.getPostId())).orElse(null);
    try {
      User user = userOptional.get();
      String uploadedImage = null;
      if (req.getImage() != null && !req.getImage().isEmpty()) {
        uploadedImage = cloudinaryUtils.uploadImage(req.getImage());
      }
      Comment comment = Comment.builder()
        .userId(new ObjectId(req.getUserId()))
        .postId(new ObjectId(req.getPostId()))
        .content(req.getContent())
        .image(uploadedImage)
        .user(user)
        .build();
      commentRepository.save(comment);
      if (post == null) {
        return new BaseResponse<>(false, "Post not found!", null);
      }
      post.getComments().add(comment);
      postRepository.save(post);
      return new BaseResponse<>(true, "Create Comment Success!!!", comment);
    } catch (IOException ex) {
      return new BaseResponse<>(true, "Create Comment unSuccessfuly!", null);
    }
  }

  @Override
  public BaseResponse<Comment> likeComment(LikeRequest req) {
    Comment comment = commentRepository.findById(new ObjectId(req.getItemId())).orElse(null);
    if (!comment.getLikes().contains(req.getUserId())) {
      comment.getLikes().add(req.getUserId());
      commentRepository.save(comment);
      return new BaseResponse<>(true, "Liked comment successfuly", comment);
    }
    else{
      comment.getLikes().remove(req.getUserId());
      commentRepository.save(comment);
      return new BaseResponse<>(true, "Unliked post successfuly", comment);
    }
  }
}
