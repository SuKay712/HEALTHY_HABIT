package com.example.backend.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.backend.model.Task;

@Repository
public interface TaskRepository extends MongoRepository<Task, String> {
  List<Task> findByUserId(String userId);

  @Query("{ 'tasksProgress.date' : ?0 }, 'userId' : ?1 }")
  List<Task> findTasksByDateAndUser(LocalDate date, String userId);

  @Query("{ 'userId': ?0, $or: [ { 'dateStart': { $lte: ?1 }, $and: [ { $or: [ { 'dateEnd': { $gt: ?1 } }, { 'dateEnd': ?1, 'timeExpired': { $gte: ?2 } }, { 'dateEnd': null } ] } ] }, { 'dateStart': { $gt: ?1 } } ] }")
  Page<Task> findInProgressTasks(String userId, LocalDate now, String nowTime, Pageable pageable);

  @Query("{ 'userId': ?0, $or: [ { 'dateEnd': { $lt: ?1 } }, { 'dateEnd': ?1, 'timeExpired': { $lt: ?2 } } ] }")
  Page<Task> findEndedTasks(String userId, LocalDate now, String nowTime, Pageable pageable);
}
