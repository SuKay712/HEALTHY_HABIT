package com.example.backend.service.impl;

import com.example.backend.model.Notification;
import com.example.backend.repository.NotificationRepository;
import com.example.backend.service.NotificationService;
import lombok.RequiredArgsConstructor;
import java.util.List;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {
    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Override
    public List<Notification> getNotificationsForUser(String userId) {
        return notificationRepository.findByUserId(userId);
    }

    @Override
    public List<Notification> getNotificationsForAdmin() {
        return notificationRepository.findByIsAdmin(true);
    }

    @Override
    public void sendNotificationsToUser(String userId) {
        List<Notification> notifications = getNotificationsForUser(userId);
        messagingTemplate.convertAndSend("/topic/user/" + userId, notifications);
    }

    @Override
    public void sendNotificationsToAdmin() {
        List<Notification> notifications = getNotificationsForAdmin();
        messagingTemplate.convertAndSend("/topic/admin", notifications);
    }
}
