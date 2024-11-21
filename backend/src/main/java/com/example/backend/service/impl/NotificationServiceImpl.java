package com.example.backend.service.impl;

import com.example.backend.model.Notification;
import com.example.backend.model.Task;
import com.example.backend.model.User;
import com.example.backend.model.enums.NotificationType;
import com.example.backend.repository.NotificationRepository;
import com.example.backend.repository.TaskRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.NotificationService;

import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {
    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final UserRepository userRepository;
    private final TaskRepository taskRepository;

    @Override
    public List<Notification> getNotificationsForUser(String userId) {
        return notificationRepository.findByUserId(userId);
    }

    @Override
    public void sendNotificationsToUser(String userId, Notification notification) {
        notificationRepository.save(notification);

        messagingTemplate.convertAndSend("/topic/user/" + userId, notification);
    }

    @Override
    public void sendLikeNotification(String userId, String postId, String likerId) {
        try {
            if (userId.equals(likerId))
                return;
            User liker = userRepository.findById(likerId).orElseThrow();
            String likerName = liker != null ? liker.getUsername() : "Người dùng không xác định";
            String content = likerName + " đã thích bài viết của bạn";
            Notification notifTemp = notificationRepository.getNotifExistedPost(userId, postId, content);
            if (notifTemp != null) {
                return;
            }

            Notification notification = Notification.builder()
                    .notiType(NotificationType.LIKE)
                    .userId(userId) // Người nhận thông báo (chủ bài viết)
                    .postId(postId)
                    .content(content)
                    .isAdmin(false)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();

            notificationRepository.save(notification);

            messagingTemplate.convertAndSend("/topic/user/" + userId, notification);

        } catch (Exception e) {
            System.out.println("Lỗi khi gửi thông báo thích: " + e.getMessage());
        }
    }

    @Override
    public void sendCommentNotification(String userId, String postId, String commenterId) {
        User commenter = userRepository.findById(commenterId).orElseThrow();
        String commenterName = commenter != null ? commenter.getUsername() : "Người dùng không xác định";

        Notification notification = Notification.builder()
                .notiType(NotificationType.COMMENT)
                .userId(userId)
                .postId(postId)
                .content(commenterName + " đã bình luận bài viết của bạn")
                .isAdmin(false)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        notificationRepository.save(notification);

        messagingTemplate.convertAndSend("/topic/user/" + userId, notification);
    }

    @Override
    public void sendLikeCommentNotification(String commentOwnerId, String commentId, String likerId) {
        if (commentOwnerId.equals(likerId))
            return;
        User liker = userRepository.findById(likerId).orElseThrow();
        String likerName = liker != null ? liker.getUsername() : "Người dùng không xác định";

        Notification notification = Notification.builder()
                .notiType(NotificationType.LIKE_COMMENT) // Kiểu thông báo
                .userId(commentOwnerId) // Người sở hữu bình luận
                .postId(commentId) // ID bình luận
                .content(likerName + " đã thích bình luận của bạn") // Nội dung thông báo
                .isAdmin(false)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        notificationRepository.save(notification);

        messagingTemplate.convertAndSend("/topic/user/" + commentOwnerId, notification);
    }

    @Override
    public void sendOverdueTaskNotification(String userId, String taskId) {
        Task task = taskRepository.findById(taskId).orElseThrow();
        String taskName = task.getName();
        String content = "Task '" + taskName + "' đã quá hạn!";

        Notification existingNotification = notificationRepository.getNotifExistedPost(userId, taskId, content);
        if (existingNotification != null) {
            return;
        }

        Notification notification = Notification.builder()
                .notiType(NotificationType.OVERDUE) // Loại thông báo là "OVERDUE"
                .userId(userId) // Người nhận thông báo
                .postId(taskId) // ID của task bị quá hạn
                .content(content)
                .isAdmin(false)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        notificationRepository.save(notification);

        messagingTemplate.convertAndSend("/topic/user/" + userId, notification);
    }

    @Override
    public void sendTaskCompletedNotification(String userId, String taskId) {
        Task task = taskRepository.findById(taskId).orElseThrow(() -> new RuntimeException("Task not found"));
        String taskName = task.getName();

        String content = "Task '" + taskName + "' đã hoàn thành!";

        Notification existingNotification = notificationRepository.getNotifExistedPost(userId, taskId, content);
        if (existingNotification != null) {
            return;
        }

        Notification notification = Notification.builder()
                .notiType(NotificationType.COMPLETED) // Loại thông báo là "COMPLETED"
                .userId(userId) // Người nhận thông báo
                .postId(taskId) // ID của task đã hoàn thành
                .content(content)
                .isAdmin(false)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        notificationRepository.save(notification);

        messagingTemplate.convertAndSend("/topic/user/" + userId, notification);
    }
}
