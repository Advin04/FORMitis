package com.example.demo.controller;

import com.example.demo.entity.Appuser;
import com.example.demo.repository.UserRepository;
import com.example.demo.security.JwtUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController // spring boot ko batara hai ki file api handle karengii aur json return hoega
@RequestMapping("/api/auth")// is file mein sabhi endpoints isse shuru hoenge
@CrossOrigin(origins = "http://localhost:5173") // Allow React Frontend to call this API

// time for dependencies injection
public class AuthController{
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    public AuthController(AuthenticationManager authenticationManager, UserRepository userRepository,PasswordEncoder passwordEncoder,JwtUtils jwtUtils){

        this.authenticationManager=authenticationManager;
        this.userRepository=userRepository;
        this.passwordEncoder=passwordEncoder;
        this.jwtUtils=jwtUtils;
}
    // 1. SIGNUP API
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest request) {
        // Check if user already exists
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Error: Username is already taken!");
        }
        // Create new user and encrypt the password
        Appuser user = new Appuser(
                request.getUsername(),
                passwordEncoder.encode(request.getPassword()), // Password yahan encrypt ho raha hai
                request.getRole(),
                request.getDob()
        );
        userRepository.save(user);
        return ResponseEntity.ok("User registered successfully!");
    }
    // 2. LOGIN API
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        // Authenticate the user
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );
        // If password is correct, generate JWT Token
        Appuser user = userRepository.findByUsername(request.getUsername()).get();
        String jwt = jwtUtils.generateToken(user.getUsername(), user.getRole());
        // Return token and user details to React
        return ResponseEntity.ok(new AuthResponse(jwt, user.getUsername(), user.getRole()));
    }
}

class SignupRequest{
    private String username;
    private String password;
    private String role;
    private String dob;
    
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getDob() { return dob; }
    public void setDob(String dob) { this.dob = dob; }
}
    
class LoginRequest {
    private String username;
    private String password;
    // Getters and Setters
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
class AuthResponse {
    private String token;
    private String username;
    private String role;
    public AuthResponse(String token, String username, String role) {
        this.token = token; this.username = username; this.role = role;
    }
    public String getToken() { return token; }
    public String getUsername() { return username; }
    public String getRole() { return role; }
}