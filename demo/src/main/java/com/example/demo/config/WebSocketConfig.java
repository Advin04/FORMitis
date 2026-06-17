package com.example.demo.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker // Ye WebSockets ko chalu kar dega
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Ye un channels ke naam hain jahan messages receive honge
        config.enableSimpleBroker("/queue", "/topic");
        
        // Jab React se message bheja jayega toh is prefix ke sath aayega
        config.setApplicationDestinationPrefixes("/app");
        
        // Private messages ke liye prefix
        config.setUserDestinationPrefix("/user");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Is URL par React pehli baar judega (connect hoga)
        registry.addEndpoint("/ws-chat")
                .setAllowedOriginPatterns("*") // CORS errors rokne ke liye
                .withSockJS(); // Fallback agar browser websocket support na kare
    }
}
