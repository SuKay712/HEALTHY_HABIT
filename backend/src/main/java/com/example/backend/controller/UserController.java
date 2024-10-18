package com.example.backend.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.models.User;
import com.example.backend.services.UserService;

@RestController
public class UserController {

  @Autowired
  UserService userService;

  @PostMapping("/add")
  public User createUser(@RequestBody User user) {
    return userService.addUser(user);
  }

  @GetMapping("/getAll")
  public List<User> getUsers() {
    return userService.findAllUsers();
  }
}
