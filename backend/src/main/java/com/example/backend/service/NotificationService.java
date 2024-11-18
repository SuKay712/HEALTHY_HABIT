package com.example.backend.service;

import com.example.backend.model.Notification;

import java.util.List;

public interface NotificationService {
    List<Notification> getNotificationsForUser(String userId);
    void sendNotificationsToUser(String userId, Notification notification);
    void sendLikeNotification(String userId, String postId, String likerId);
    void sendCommentNotification(String userId, String postId, String commenterId);
    void sendLikeCommentNotification(String commentOwnerId, String commentId, String likerId);
}
