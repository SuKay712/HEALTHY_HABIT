package com.example.backend.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;

import com.example.backend.dto.request.CreatePostRequest;
import com.example.backend.dto.request.LikeRequest;
import com.example.backend.dto.request.UpdatePostRequest;
import com.example.backend.dto.response.BaseResponse;
import com.example.backend.model.Post;
import com.example.backend.repository.PostRepository;
import com.example.backend.service.NotificationService;
import com.example.backend.service.PostService;
import com.example.backend.utils.CloudinaryUtils;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PostServiceImpl implements PostService {
  private final PostRepository postRepository;
  private final CloudinaryUtils cloudinaryUtils;
  private final NotificationService notificationService;

  @Override
  public BaseResponse<Post> createPost(CreatePostRequest req) {
    try {
      Post post = Post.builder()
          .userId(new ObjectId(req.getUserId()))
          .content(req.getContent())
          .inTrashcan(false)
          .isDeleted(false)
          .likes(new ArrayList<>())
          .build();
      if (!req.getImage().isEmpty()) {
        post.setImage(cloudinaryUtils.uploadImage(req.getImage()));
      }
      Post resulPost = postRepository.save(post);
      return new BaseResponse<Post>(true, "Create Post Success!!!", resulPost);
    } catch (Exception e) {
      return new BaseResponse<Post>(false, "Create Post Failed!!!", null);
    }
  }

  @Override
  public BaseResponse<Post> updatePost(UpdatePostRequest req) {
    try {
      Post updatePost = postRepository.findById(new ObjectId(req.getPostId()))
          .orElseThrow(() -> new RuntimeException("Post not found"));

      updatePost.setContent(req.getContent());

      if (req.isDeleteImage()) {
        // Người dùng yêu cầu xóa ảnh
        if (updatePost.getImage() != null) {
          cloudinaryUtils.deleteImageByUrl(updatePost.getImage());
        }
        updatePost.setImage(null);
      } else if (req.getImage() != null && !req.getImage().isEmpty()) {
        // Người dùng tải lên ảnh mới, cập nhật ảnh mới
        if (updatePost.getImage() != null) {
          cloudinaryUtils.deleteImageByUrl(updatePost.getImage());
        }
        updatePost.setImage(cloudinaryUtils.uploadImage(req.getImage()));
      }
      // Nếu không có thay đổi về ảnh, giữ lại ảnh cũ

      Post resultPost = postRepository.save(updatePost);
      return new BaseResponse<Post>(true, "Update Post Success!!!", resultPost);
    } catch (Exception e) {
      System.out.println(e.getMessage());
      return new BaseResponse<Post>(false, "Update Post Failed!!!", null);
    }
  }

  @Override
  public BaseResponse<List<Post>> getAllPostByUserId(String userId) {
    List<Post> listPosts = postRepository.findPostsWithCommentsByUserId(new ObjectId(userId));
    return new BaseResponse<>(true, "123", listPosts);
  }

  @Override
  public BaseResponse<List<Post>> getAllPost() {
    List<Post> listPosts = postRepository.findAllPostsWithComments();
    return new BaseResponse<>(true, "123", listPosts);
  }

  @Override
  public BaseResponse<Post> likePost(LikeRequest req) {
    try {
      ObjectId postId = new ObjectId(req.getItemId());
      Post post = postRepository.findById(postId)
          .orElseThrow(() -> new RuntimeException("Post not found"));

      boolean liked = false;
      if (!post.getLikes().contains(req.getUserId())) {
        post.getLikes().add(req.getUserId());
        liked = true;
      } else {
        post.getLikes().remove(req.getUserId());
      }

      postRepository.save(post);

      if (liked) {
        notificationService.sendLikeNotification(post.getUserId().toString(), req.getItemId(), req.getUserId());
        return new BaseResponse<>(true, "Liked post successfully", post);
      } else {
        return new BaseResponse<>(true, "Unliked post successfully", post);
      }
    } catch (Exception e) {
      return new BaseResponse<>(false, "Error while liking/unliking post: " + e.getMessage(), null);
    }
  }

  @Override
  public BaseResponse<List<Post>> getHotPosts() {
    List<Post> listPosts = postRepository.findAllPostsWithCommentsSortedByLikesAndComments();
    return new BaseResponse<>(true, "123", listPosts);
  }
}
