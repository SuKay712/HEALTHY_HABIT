package com.example.backend.repository;

import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.backend.model.Post;

@Repository
public interface PostRepository extends MongoRepository<Post, ObjectId> {

        @Aggregation(pipeline = {
                        "{ '$match': { 'userId': { '$eq': ?0 } } }",
                        "{ '$lookup': { 'from': 'Users', 'localField': 'userId', 'foreignField': '_id', 'as': 'postUser' } }",
                        "{ '$addFields': { 'postUser': { '$arrayElemAt': ['$postUser', 0] } } }",
                        "{ '$lookup': { 'from': 'Comments', 'localField': '_id', 'foreignField': 'postId', 'as': 'comments' } }",
                        "{ '$lookup': { 'from': 'Users', 'localField': 'comments.userId', 'foreignField': '_id', 'as': 'commentUser' } }",
                        "{ '$addFields': { 'comments': { '$map': { 'input': '$comments', 'as': 'comment', 'in': { '$mergeObjects': ['$$comment', { 'user': { '$arrayElemAt': ['$commentUser', 0] } }] } } } } } }",
                        "{ '$addFields': { 'hasLiked': { '$in': [ { '$toString': ?0 }, '$likes' ] } } }",
                        "{ '$addFields': { 'comments': { '$map': { 'input': '$comments', 'as': 'comment', 'in': { '$mergeObjects': ['$$comment', { 'hasLikedComment': { '$in': [ { '$toString': ?0 }, '$$comment.likes' ] } }] } } } } } }",
                        "{ '$lookup': { 'from': 'Posts', 'localField': 'savedPost', 'foreignField': '_id', 'as': 'savedPosts' } }",
                        "{ '$sort': { 'createdAt': -1 } }",
                        "{ '$project': { 'id': 1, 'userId': 1, 'content': 1, 'image': 1, 'inTrashcan': 1, 'isDeleted': 1, 'likes': 1, 'createdAt': 1, 'updatedAt': 1, 'comments': { '$cond': [{ '$gt': [{ '$size': '$comments' }, 0] }, '$comments', []] }, 'hasLiked': 1, 'postUser': 1, 'savedPosts': 1 , 'savePeoples': 1 } }"
        })
        List<Post> findPostsWithCommentsByUserId(ObjectId userId);

        @Aggregation(pipeline = {
                        "{ '$match': { '_id': { '$in': ?0 } } }",
                        "{ '$lookup': { 'from': 'Users', 'localField': 'userId', 'foreignField': '_id', 'as': 'postUser' } }",
                        "{ '$lookup': { 'from': 'Comments', 'localField': '_id', 'foreignField': 'postId', 'as': 'comments' } }",
                        "{ '$lookup': { 'from': 'Users', 'localField': 'comments.userId', 'foreignField': '_id', 'as': 'commentUsers' } }",
                        "{ '$addFields': { 'comments': { '$map': { 'input': '$comments', 'as': 'comment', 'in': { '$mergeObjects': [ '$$comment', { 'user': { '$arrayElemAt': ['$commentUsers', { '$indexOfArray': ['$commentUsers._id', '$$comment.userId'] }] } } ] } } } } }",
                        "{ '$addFields': { 'hasLiked': { '$in': [ { '$toString': ?1 }, '$likes' ] } } }",
                        "{ '$project': { 'id': 1, 'userId': 1, 'content': 1, 'image': 1, 'inTrashcan': 1, 'isDeleted': 1, 'likes': 1, 'createdAt': 1, 'updatedAt': 1, 'comments': { '$cond': [{ '$gt': [{ '$size': '$comments' }, 0] }, '$comments', []] }, 'hasLiked': 1, 'isPrivate': 1, 'postUser': { '$arrayElemAt': ['$postUser', 0] }, 'savePeoples': 1 } }"
        })
        List<Post> findPostsBySavedPostAndUserId(List<ObjectId> savedPost, ObjectId userId);

        @Aggregation(pipeline = {
                        "{ '$match' : { 'isPrivate': false }}",
                        "{ '$lookup': { 'from': 'Comments', 'localField': '_id', 'foreignField': 'postId', 'as': 'comments' } }",
                        "{ '$lookup': { 'from': 'Users', 'localField': 'comments.userId', 'foreignField': '_id', 'as': 'commentUser' } }",
                        "{ '$addFields': { 'comments': { '$map': { 'input': '$comments', 'as': 'comment', 'in': { '$mergeObjects': ['$$comment', { 'user': { '$arrayElemAt': ['$commentUser', 0] } }] } } } } }",
                        "{ '$lookup': { 'from': 'Users', 'localField': 'userId', 'foreignField': '_id', 'as': 'postUser' } }",
                        "{ '$addFields': { 'postUser': { '$arrayElemAt': ['$postUser', 0] } } }",
                        "{ '$sort': { 'createdAt': -1 } }",
                        "{ '$skip': ?0 }",
                        "{ '$limit': ?1 }",
                        "{ '$project': { 'id': 1, 'userId': 1, 'content': 1, 'image': 1, 'inTrashcan': 1, 'isDeleted': 1, 'likes': 1, 'createdAt': 1, 'updatedAt': 1, 'comments': { '$cond': [{ '$gt': [{ '$size': '$comments' }, 0] }, '$comments', []] }, 'postUser': 1, 'isPrivate': 1, 'savePeoples': 1 } }"
        })
        List<Post> findAllPostsWithComments(int skip, int limit);

        @Query("{ 'isDeleted': false , 'isPrivate': false }")
        List<Post> findAllPosts();

        @Aggregation(pipeline = {
                        "{ '$match' : { 'isPrivate': false }}",

                        "{ '$lookup': { 'from': 'Comments', 'localField': '_id', 'foreignField': 'postId', 'as': 'comments' } }",

                        "{ '$lookup': { 'from': 'Users', 'localField': 'comments.userId', 'foreignField': '_id', 'as': 'commentUser' } }",

                        "{ '$addFields': { 'comments': { '$map': { 'input': '$comments', 'as': 'comment', 'in': { '$mergeObjects': ['$$comment', { 'user': { '$arrayElemAt': ['$commentUser', 0] } }] } } } } }",

                        "{ '$lookup': { 'from': 'Users', 'localField': 'userId', 'foreignField': '_id', 'as': 'postUser' } }",

                        "{ '$addFields': { 'likeCount': { '$size': { '$ifNull': ['$likes', []] } }, 'commentCount': { '$size': { '$ifNull': ['$comments', []] } } } }",
                        "{ '$sort': { 'likeCount': -1, 'commentCount': -1 } }",
                        "{ '$project': { " +
                                        "'id': 1, 'userId': 1, 'content': 1, 'image': 1, 'inTrashcan': 1, 'isDeleted': 1, 'likes': 1, 'createdAt': 1, 'updatedAt': 1, "
                                        +
                                        "'postUser': { '$arrayElemAt': ['$postUser', 0] }, " +
                                        "'comments': { '$cond': [{ '$gt': [{ '$size': '$comments' }, 0] }, '$comments', []] } } }"

        })
        List<Post> findAllPostsWithCommentsSortedByLikesAndComments();

}
