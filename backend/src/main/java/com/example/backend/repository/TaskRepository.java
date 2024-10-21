package com.example.backend.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.backend.model.Task;

@Repository
public interface TaskRepository extends MongoRepository<Task, String> {
  List<Task> findByUserId(String userId);

  @Query("{ 'tasksProgress.date' : ?0 }, 'userId' : ?1 }")
  List<Task> findTasksByDateAndUser(LocalDate date, String userId);
}
