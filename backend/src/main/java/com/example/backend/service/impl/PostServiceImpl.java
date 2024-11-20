package com.example.backend.service.impl;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;

import com.example.backend.dto.request.CreatePostRequest;
import com.example.backend.dto.request.LikeRequest;
import com.example.backend.dto.request.SaveRequest;
import com.example.backend.dto.request.UpdatePostRequest;
import com.example.backend.dto.response.BaseResponse;
import com.example.backend.dto.response.PagedAllPostsResponse;
import com.example.backend.model.Post;
import com.example.backend.model.User;
import com.example.backend.repository.PostRepository;
import com.example.backend.service.NotificationService;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.PostService;
import com.example.backend.utils.CloudinaryUtils;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PostServiceImpl implements PostService {
  private final PostRepository postRepository;
  private final CloudinaryUtils cloudinaryUtils;
  private final NotificationService notificationService;
  private final UserRepository userRepository;

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
      if (!req.getImage().isEmpty()) {
        post.setImage(cloudinaryUtils.uploadImage(req.getImage()));
      }
      return new BaseResponse<Post>(true, "Create Post Success!!!", resulPost);
    } catch (Exception e) {
      return new BaseResponse<Post>(false, e.getMessage(), null);
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
    // Lấy danh sách bài viết của userId
    List<Post> userPosts = postRepository.findPostsWithCommentsByUserId(new ObjectId(userId));

    // Lấy danh sách bài viết từ savedPosts
    List<ObjectId> savedPostIds = userRepository.findById(userId).orElseThrow().getSavedPost();
    List<Post> savedPosts = postRepository.findPostsBySavedPostAndUserId(savedPostIds, new ObjectId(userId));

    // Gộp hai danh sách lại
    List<Post> combinedPosts = new ArrayList<>();
    combinedPosts.addAll(userPosts);
    combinedPosts.addAll(savedPosts);

    // Sắp xếp danh sách theo createdAt từ sớm đến muộn (tăng dần)
    combinedPosts.sort(Comparator.comparing(Post::getCreatedAt).reversed());

    return new BaseResponse<>(true, "123", combinedPosts);
  }

  @Override
  public BaseResponse<PagedAllPostsResponse> getAllPost(int page, int size) {
    // Tính toán giá trị skip (bỏ qua các bài viết trước đó)
    int skip = page * size;

    // Lấy bài viết với phân trang từ repository
    List<Post> listPosts = postRepository.findAllPostsWithComments(skip, size);

    // Tính tổng số bài viết trong cơ sở dữ liệu
    long totalCount = postRepository.findAllPosts().size();

    // Tính tổng số trang
    int totalPages = (int) Math.ceil((double) totalCount / size);

    // Tạo đối tượng PagedAllPostsResponse chứa bài viết và thông tin phân trang
    PagedAllPostsResponse pagedAllPostsResponse = PagedAllPostsResponse.builder()
        .posts(listPosts)
        .totalCount(totalCount)
        .totalPages(totalPages)
        .build();

    // Trả về BaseResponse chứa PagedAllPostsResponse
    return new BaseResponse<>(true, "Fetched posts successfully", pagedAllPostsResponse);
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

  @Override
  public BaseResponse<Post> savePost(SaveRequest req) {
    // Lấy bài viết từ repository
    Post post = postRepository.findById(new ObjectId(req.getPostId()))
        .orElseThrow(() -> new RuntimeException("Post not found"));

    if (post.getUserId().equals(new ObjectId(req.getUserId()))) {
      return new BaseResponse<>(false, "Can't save your own post", post);
    }

    // Lấy thông tin người dùng từ repository
    User user = userRepository.findById(req.getUserId())
        .orElseThrow(() -> new RuntimeException("User not found"));

    // Kiểm tra xem bài viết đã được lưu chưa
    boolean isPostSaved = user.getSavedPost().stream()
        .anyMatch(savedPost -> savedPost.toString().equals(req.getPostId()));

    if (!isPostSaved) {
      // Nếu bài viết chưa được lưu, thêm bài viết vào danh sách lưu của người dùng
      user.getSavedPost().add(new ObjectId(req.getPostId()));
      userRepository.save(user); // Lưu người dùng với bài viết đã lưu

      return new BaseResponse<>(true, "Saved post successfully", post);
    } else {
      // Nếu bài viết đã được lưu, xóa bài viết khỏi danh sách lưu của người dùng
      user.getSavedPost().removeIf(savedPost -> savedPost.toString().equals(req.getPostId()));
      userRepository.save(user); // Lưu người dùng sau khi xóa bài viết

      return new BaseResponse<>(true, "Removed post from saved successfully", post);
    }
  }

}
