package com.example.backend.service.impl;

import com.example.backend.dto.response.BaseResponse;
import com.example.backend.model.Notification;
import com.example.backend.model.User;
import com.example.backend.model.enums.NotificationType;
import com.example.backend.repository.NotificationRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.NotificationService;
import com.example.backend.service.UserService;

import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {
    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final UserService userService;
    private final UserRepository userRepository;

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
        BaseResponse<User> response = userService.getUserById(likerId);  
        User liker = (response != null && response.getData() != null) ? response.getData() : null;
        
        String likerName = liker != null ? liker.getUsername() : "Người dùng không xác định";
        
        Notification notification = Notification.builder()
            .notiType(NotificationType.LIKE)
            .userId(userId) // Người nhận thông báo (chủ bài viết)
            .postId(postId)
            .content(likerName + " đã thích bài viết của bạn")
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
        BaseResponse<User> response = userService.getUserById(commenterId);  
        User commenter = response != null && response.getData() != null ? response.getData() : null;
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
        Optional<User> likerOptional = userRepository.findById(likerId);
        User liker = likerOptional.orElse(null);
        String likerName = liker != null ? liker.getUsername() : "Người dùng không xác định";

        Notification notification = Notification.builder()
            .notiType(NotificationType.LIKE_COMMENT) // Kiểu thông báo
            .userId(commentOwnerId)                 // Người sở hữu bình luận
            .postId(commentId)                      // ID bình luận
            .content(likerName + " đã thích bình luận của bạn") // Nội dung thông báo
            .isAdmin(false)
            .createdAt(LocalDateTime.now())
            .updatedAt(LocalDateTime.now())
            .build();

        notificationRepository.save(notification);

        messagingTemplate.convertAndSend("/topic/user/" + commentOwnerId, notification);
    }
}
