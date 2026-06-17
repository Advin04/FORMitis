package com.example.demo.controller;
import com.example.demo.entity.Appuser;
import com.example.demo.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173") // Allow React Frontend to call this API
public class AdminController{
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    public AdminController(UserRepository userRepository,PasswordEncoder passwordEncoder){
        this.userRepository=userRepository;
        this.passwordEncoder=passwordEncoder;
    }
    
    @GetMapping("/users")
    public ResponseEntity<List<Appuser>> getAllUsers(){
        return ResponseEntity.ok(userRepository.findAll());
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id){
        if(!userRepository.existsById(id)){
            return ResponseEntity.badRequest().body("Error:usernotfound");
        }
        userRepository.deleteById(id);
        return ResponseEntity.ok("user deleted succesfully");
    }

    @PutMapping("/users/{id}/reset-password")
    public ResponseEntity<?> resetPassword(@PathVariable Long id, @RequestBody ResetPasswordRequest request){
         Optional<Appuser> userOptional = userRepository.findById(id);

          if (userOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Error: User not found!");
    }

    Appuser user = userOptional.get();
    user.setPassword(passwordEncoder.encode(request.getNewPassword()));
    userRepository.save(user);
    
    return ResponseEntity.ok("Password reset successfully!");
    }

}

class ResetPasswordRequest{
    private String newPassword;
    public String getNewPassword(){
        return newPassword;
    }
    public void setNewPassword(String newPassword){ this.newPassword = newPassword; }
}