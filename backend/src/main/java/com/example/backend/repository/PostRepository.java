package com.example.backend.repository;

import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.example.backend.model.Post;

@Repository
public interface PostRepository extends MongoRepository<Post, ObjectId> {

  @Aggregation(pipeline = {
    "{ '$match': { 'userId': { '$eq': ?0 } } }",
    "{ '$lookup': { 'from': 'Users', 'localField': 'userId', 'foreignField': '_id', 'as': 'postUser' } }",  // Lọc người dùng theo userId của bài viết
    "{ '$addFields': { 'postUser': { '$arrayElemAt': ['$postUser', 0] } } }",  // Lấy phần tử đầu tiên trong mảng postUser
    "{ '$lookup': { 'from': 'Comments', 'localField': '_id', 'foreignField': 'postId', 'as': 'comments' } }",  // Lọc các bình luận của bài viết
    "{ '$lookup': { 'from': 'Users', 'localField': 'comments.userId', 'foreignField': '_id', 'as': 'commentUser' } }",  // Lọc người dùng của từng bình luận
    "{ '$addFields': { 'comments': { '$map': { 'input': '$comments', 'as': 'comment', 'in': { '$mergeObjects': ['$$comment', { 'user': { '$arrayElemAt': ['$commentUser', 0] } }] } } } } } }",
    "{ '$addFields': { 'hasLiked': { '$in': [ { '$toString': ?0 }, '$likes' ] } } }",  // Chuyển đổi ObjectId của userId sang String và kiểm tra trong mảng likes
    "{ '$addFields': { 'comments': { '$map': { 'input': '$comments', 'as': 'comment', 'in': { '$mergeObjects': ['$$comment', { 'hasLikedComment': { '$in': [ { '$toString': ?0 }, '$$comment.likes' ] } }] } } } } } }",
    "{ '$sort': { 'createdAt': -1 } }",
    "{ '$project': { 'id': 1, 'userId': 1, 'content': 1, 'image': 1, 'inTrashcan': 1, 'isDeleted': 1, 'likes': 1, 'createdAt': 1, 'updatedAt': 1, 'comments': { '$cond': [{ '$gt': [{ '$size': '$comments' }, 0] }, '$comments', []] }, 'hasLiked': 1, 'postUser': 1 } }"  // Chọn các trường cần thiết, bao gồm thông tin người dùng của bài viết
  })
  List<Post> findPostsWithCommentsByUserId(ObjectId userId);


  @Aggregation(pipeline = {
    "{ '$lookup': { 'from': 'Comments', 'localField': '_id', 'foreignField': 'postId', 'as': 'comments' } }",
    "{ '$lookup': { 'from': 'Users', 'localField': 'comments.userId', 'foreignField': '_id', 'as': 'commentUser' } }",
    "{ '$addFields': { 'comments': { '$map': { 'input': '$comments', 'as': 'comment', 'in': { '$mergeObjects': ['$$comment', { 'user': { '$arrayElemAt': ['$commentUser', 0] } }] } } } } } }",
    "{ '$lookup': { 'from': 'Users', 'localField': 'userId', 'foreignField': '_id', 'as': 'postUser' } }",
    "{ '$addFields': { 'postUser': { '$arrayElemAt': ['$postUser', 0] } } }",
    "{ '$sort': { 'createdAt': -1 } }",
    "{ '$project': { 'id': 1, 'userId': 1, 'content': 1, 'image': 1, 'inTrashcan': 1, 'isDeleted': 1, 'likes': 1, 'createdAt': 1, 'updatedAt': 1, 'comments': { '$cond': [{ '$gt': [{ '$size': '$comments' }, 0] }, '$comments', []] }, 'postUser': 1 } }"
  })
  List<Post> findAllPostsWithComments();


  @Aggregation(pipeline = {
    "{ '$lookup': { 'from': 'Comments', 'localField': '_id', 'foreignField': 'postId', 'as': 'comments' } }",  // Lookup comments
    "{ '$lookup': { 'from': 'Users', 'localField': 'comments.userId', 'foreignField': '_id', 'as': 'commentUser' } }",  // Lookup users in comments
    "{ '$addFields': { 'comments': { '$map': { 'input': '$comments', 'as': 'comment', 'in': { '$mergeObjects': ['$$comment', { 'user': { '$arrayElemAt': ['$commentUser', 0] } }] } } } } }",  // Merge comment and user
    "{ '$lookup': { 'from': 'Users', 'localField': 'userId', 'foreignField': '_id', 'as': 'postUser' } }",
    "{ '$addFields': { 'likeCount': { '$size': { '$ifNull': ['$likes', []] } }, 'commentCount': { '$size': { '$ifNull': ['$comments', []] } } } }",
    "{ '$sort': { 'likeCount': -1, 'commentCount': -1 } }",
    "{ '$project': { 'id': 1, 'userId': 1, 'content': 1, 'image': 1, 'inTrashcan': 1, 'isDeleted': 1, 'likes': 1, 'createdAt': 1, 'updatedAt': 1, 'comments': { '$cond': [{ '$gt': [{ '$size': '$comments' }, 0] }, '$comments', []] } } }"  // Project results
  })
  List<Post> findAllPostsWithCommentsSortedByLikesAndComments();
}
