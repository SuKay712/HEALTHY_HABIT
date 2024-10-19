package com.example.backend.repository;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.example.backend.model.Task;

@Repository
public interface TaskRepository extends MongoRepository<Task, ObjectId> {

}
