package com.example.demo.controller;

import com.example.demo.entity.Appuser;
import com.example.demo.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Ye API saare registered users ke sirf usernames bhejegi
    @GetMapping
    public ResponseEntity<List<String>> getAllUsernames() {
        List<String> usernames = userRepository.findAll()
                .stream()
                .map(Appuser::getUsername)
                .collect(Collectors.toList());
        return ResponseEntity.ok(usernames);
    }
}
