package com.example.demo.controller;

import com.example.demo.dto.ChatMessage;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {

    private final SimpMessagingTemplate messagingTemplate;

    public ChatController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    // React se message is path par aayega ("/app/chat")
    @MessageMapping("/chat")
    public void processMessage(@Payload ChatMessage chatMessage) {
        // Simple aur direct rasta: Jisko message bhejna hai, uske naam ka topic (channel)
        messagingTemplate.convertAndSend(
                "/topic/messages/" + chatMessage.getRecipient(), 
                chatMessage
        );
    }
}
