package com.bwxor.backend.controller;

import com.bwxor.backend.dto.chat.ChatMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/sendMessage")
    public void sendMessage(ChatMessage message) {
        messagingTemplate.convertAndSendToUser(
                message.getReceiverId(),
                "/topic/private",
                message
        );
    }
}
