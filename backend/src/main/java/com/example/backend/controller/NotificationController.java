package com.example.backend.controller;

import com.example.backend.dto.response.BaseResponse;
import com.example.backend.model.Notification;
import com.example.backend.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/notification")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping("/user")
    public BaseResponse<List<Notification>> getUserNotifications(@RequestParam String userId) {
        List<Notification> notifications = notificationService.getNotificationsForUser(userId);
        String message = notifications.isEmpty() ? "No notifications found." : "Notifications retrieved successfully.";
        return new BaseResponse<>(!notifications.isEmpty(), message, notifications);
    }

    @GetMapping("/admin")
    public BaseResponse<List<Notification>> getAdminNotifications() {
        List<Notification> notifications = notificationService.getNotificationsForAdmin();
        String message = notifications.isEmpty() ? "No notifications found." : "Notifications retrieved successfully.";
        return new BaseResponse<>(!notifications.isEmpty(), message, notifications);
    }
}
