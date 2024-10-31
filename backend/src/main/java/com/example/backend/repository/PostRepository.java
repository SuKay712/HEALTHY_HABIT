package com.example.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.example.backend.model.Post;

@Repository
public interface PostRepository extends MongoRepository<Post, String> {

}
