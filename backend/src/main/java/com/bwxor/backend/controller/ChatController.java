package com.bwxor.backend.controller;

import com.bwxor.backend.dto.chat.ChatMessage;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {
    @MessageMapping("/sendMessage")
    @SendToUser("/topic/private")
    public ChatMessage sendMessage(ChatMessage message) {
        return message;
    }
}
