package com.example.backend.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.example.backend.model.Post;

@Repository
public interface PostRepository extends MongoRepository<Post, String> {
  @Aggregation(pipeline = {
    "{ '$match': { 'userId': ?0 } }",
    "{ '$lookup': { 'from': 'Comments', 'localField': '_id', 'foreignField': 'postId', 'as': 'comments' } }",
    "{ '$lookup': { 'from': 'Users', 'localField': 'comments.userId', 'foreignField': '_id', 'as': 'commentUser' } }",
    "{ '$addFields': { 'comments': { '$map': { 'input': '$comments', 'as': 'comment', 'in': { '$mergeObjects': ['$$comment', { 'user': { '$arrayElemAt': ['$commentUser', 0] } }] } } } } }",
    "{ '$project': { 'id': 1, 'userId': 1, 'content': 1, 'image': 1, 'inTrashcan': 1, 'isDeleted': 1, 'likes': 1, 'createdAt': 1, 'updatedAt': 1, 'comments': { '$cond': [{ '$gt': [{ '$size': '$comments' }, 0] }, '$comments', []] } } } }"
  })
  List<Post> findPostsWithCommentsByUserId(String userId);

}
