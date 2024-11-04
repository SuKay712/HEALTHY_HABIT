package com.example.backend.service;

import com.example.backend.model.Notification;

import java.util.List;

public interface NotificationService {
    List<Notification> getNotificationsForUser(String userId);
    List<Notification> getNotificationsForAdmin();
    void sendNotificationsToUser(String userId);
    void sendNotificationsToAdmin();
}
