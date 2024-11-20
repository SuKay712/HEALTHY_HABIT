package com.example.backend.dto.response;

import java.util.List;

import com.example.backend.model.Post;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PagedAllPostsResponse {
  private List<Post> posts;
  private long totalCount;
  private int totalPages;
}
