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
import com.example.backend.service.NotificationService;
import com.example.backend.utils.CloudinaryUtils;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {
  private final PostRepository postRepository;
  private final CommentRepository commentRepository;
  private final CloudinaryUtils cloudinaryUtils;
  private final UserRepository userRepository;
  private final NotificationService notificationService;

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
      notificationService.sendCommentNotification(
            post.getUserId().toString(), // ID của người sở hữu bài viết
            req.getPostId(),             // ID bài viết
            req.getUserId()              // ID người bình luận
        );
      return new BaseResponse<>(true, "Create Comment Success!!!", comment);
    } catch (IOException ex) {
      return new BaseResponse<>(true, "Create Comment unSuccessfuly!", null);
    }
  }

  @Override
  public BaseResponse<Comment> likeComment(LikeRequest req) {
    Comment comment = commentRepository.findById(new ObjectId(req.getItemId())).orElse(null);
    boolean isLiked = comment.getLikes().contains(req.getUserId());
    if (!isLiked) {
      // Thêm userId vào danh sách likes
      comment.getLikes().add(req.getUserId());
      commentRepository.save(comment);

      // Gửi thông báo cho người sở hữu bình luận
      notificationService.sendLikeCommentNotification(
          comment.getUserId().toString(), // Người sở hữu bình luận
          req.getItemId(),               // ID bình luận
          req.getUserId()                // Người thích bình luận
      );

      return new BaseResponse<>(true, "Liked comment successfully", comment);
    } else {
      // Bỏ userId khỏi danh sách likes
      comment.getLikes().remove(req.getUserId());
      commentRepository.save(comment);
      return new BaseResponse<>(true, "Unliked comment successfully", comment);
    }
  }
}
