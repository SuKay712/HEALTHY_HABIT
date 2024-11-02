package com.example.backend.service.impl;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

import com.example.backend.dto.request.CreatePostRequest;
import com.example.backend.dto.request.UpdatePostRequest;
import com.example.backend.dto.response.BaseResponse;
import com.example.backend.model.Post;
import com.example.backend.repository.PostRepository;
import com.example.backend.service.PostService;
import com.example.backend.utils.CloudinaryUtils;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PostServiceImpl implements PostService {
  private final PostRepository postRepository;
  private final CloudinaryUtils cloudinaryUtils;

  @Override
  public BaseResponse<Post> createPost(CreatePostRequest req) {
    try {
      Post post = Post.builder()
          .userId(req.getUserId())
          .image(cloudinaryUtils.uploadImage(req.getImage()))
          .content(req.getContent())
          .inTrashcan(false)
          .isDeleted(false)
          .likes(new ArrayList<>())
          .build();
      Post resulPost = postRepository.save(post);
      return new BaseResponse<Post>(true, "Create Post Success!!!", resulPost);
    } catch (Exception e) {
      return new BaseResponse<Post>(false, "Create Post Failed!!!", null);
    }
  }

  @Override
  public BaseResponse<Post> updatePost(UpdatePostRequest req) {
    try {
      Post updatePost = postRepository.findById(req.getPostId())
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
  public BaseResponse<List<Post>> getAllPost(String userId) {
    List<Post> listPosts = postRepository.findPostsWithCommentsByUserId(userId);
    return new BaseResponse<>(true, "123", listPosts);
  }
}
