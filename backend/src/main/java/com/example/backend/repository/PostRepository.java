package com.example.backend.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.example.backend.model.Post;

@Repository
public interface PostRepository extends MongoRepository<Post, String> {
  @Aggregation(pipeline = {
    "{ '$match': { 'userId': ?0 } }",  // Filter by userId
    "{ '$lookup': { 'from': 'Comments', 'localField': '_id', 'foreignField': 'postId', 'as': 'comments' } }",  // Lookup comments
    "{ '$lookup': { 'from': 'Users', 'localField': 'comments.userId', 'foreignField': '_id', 'as': 'commentUser' } }",  // Lookup users in comments
    "{ '$addFields': { 'comments': { '$map': { 'input': '$comments', 'as': 'comment', 'in': { '$mergeObjects': ['$$comment', { 'user': { '$arrayElemAt': ['$commentUser', 0] } }] } } } } }",  // Merge comment and user
    // Check if user has liked the post
    "{ '$addFields': { 'hasLiked': { '$in': [ ?0, '$likes' ] } } }",  // Check if userId exists in the likes array (as String)
    // Check if user has liked each comment
    "{ '$addFields': { 'comments': { '$map': { 'input': '$comments', 'as': 'comment', 'in': { '$mergeObjects': ['$$comment', { 'hasLikedComment': { '$in': [ ?0, '$$comment.likes' ] } }] } } } } } }",  // Check if userId exists in comment's likes array
    "{ '$sort': { 'createdAt': -1 } }",  // Sort by createdAt descending
    "{ '$project': { 'id': 1, 'userId': 1, 'content': 1, 'image': 1, 'inTrashcan': 1, 'isDeleted': 1, 'likes': 1, 'createdAt': 1, 'updatedAt': 1, 'comments': { '$cond': [{ '$gt': [{ '$size': '$comments' }, 0] }, '$comments', []] }, 'hasLiked': 1 } }"  // Project results with hasLiked and hasLikedComment for each comment
  })
  List<Post> findPostsWithCommentsByUserId(String userId);


  @Aggregation(pipeline = {
    "{ '$lookup': { 'from': 'Comments', 'localField': '_id', 'foreignField': 'postId', 'as': 'comments' } }",  // Lookup comments
    "{ '$lookup': { 'from': 'Users', 'localField': 'comments.userId', 'foreignField': '_id', 'as': 'commentUser' } }",  // Lookup users in comments
    "{ '$addFields': { 'comments': { '$map': { 'input': '$comments', 'as': 'comment', 'in': { '$mergeObjects': ['$$comment', { 'user': { '$arrayElemAt': ['$commentUser', 0] } }] } } } } }",  // Merge comment and user
    "{ '$sort': { 'createdAt': -1 } }",  // Sort by createdAt descending
    "{ '$project': { 'id': 1, 'userId': 1, 'content': 1, 'image': 1, 'inTrashcan': 1, 'isDeleted': 1, 'likes': 1, 'createdAt': 1, 'updatedAt': 1, 'comments': { '$cond': [{ '$gt': [{ '$size': '$comments' }, 0] }, '$comments', []] } } }"  // Project results
  })
  List<Post> findAllPostsWithComments();

  @Aggregation(pipeline = {
    "{ '$lookup': { 'from': 'Comments', 'localField': '_id', 'foreignField': 'postId', 'as': 'comments' } }",  // Lookup comments
    "{ '$lookup': { 'from': 'Users', 'localField': 'comments.userId', 'foreignField': '_id', 'as': 'commentUser' } }",  // Lookup users in comments
    "{ '$addFields': { 'comments': { '$map': { 'input': '$comments', 'as': 'comment', 'in': { '$mergeObjects': ['$$comment', { 'user': { '$arrayElemAt': ['$commentUser', 0] } }] } } } } }",  // Merge comment and user
    "{ '$addFields': { 'likeCount': { '$size': { '$ifNull': ['$likes', []] } }, 'commentCount': { '$size': { '$ifNull': ['$comments', []] } } } }",
    "{ '$sort': { 'likeCount': -1, 'commentCount': -1 } }",
    "{ '$project': { 'id': 1, 'userId': 1, 'content': 1, 'image': 1, 'inTrashcan': 1, 'isDeleted': 1, 'likes': 1, 'createdAt': 1, 'updatedAt': 1, 'comments': { '$cond': [{ '$gt': [{ '$size': '$comments' }, 0] }, '$comments', []] } } }"  // Project results
  })
  List<Post> findAllPostsWithCommentsSortedByLikesAndComments();
}
