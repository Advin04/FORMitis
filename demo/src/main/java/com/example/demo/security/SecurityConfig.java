package com.example.demo.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.List;
//ye file hai jo rules banati hai security ki frontend ke liye
@Configuration//@configuration spring boot ko batata hai ki ye config file hai , usse pata chalta hai ki isko read krrna hai
@EnableWebSecurity //enablewebsecurity isko enable krr deta hai
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .cors(org.springframework.security.config.Customizer.withDefaults()) // Enable CORS cors matlab ek tarah se rules hai jo frontend aur backend ko connect karne me help karta hai, isse frontend backend se connect hota hai and data share hota hai
                .csrf(csrf -> csrf.disable()) // Disable CSRF for REST APIs  csrf matlab cross site request forgery easy language mein kahani sunata hu ek fake website banayi jisme real website ki tarah login form hai and isme ek code hidden hota hai ye fake website apko us form me info fill karvati hai aur vo hidden code real website ko bhej deta hai aur is tarah tumhari saari information us fake website ke pass chali jati hai isko cross site request forgery kehte hai. disable isliye kiya hai kyuki reactjs already csrf token ko handle krr leta hai. ye reactjs ka feature hai isliye isko backend me disable krr diya. 
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll() // Allow everyone to login/signup 
                        .requestMatchers("/api/users/**").permitAll() // Allow everyone to see user list for chat
                        .requestMatchers("/ws-chat/**").permitAll() // Allow WebSocket connections
                        .requestMatchers("/api/admin/**").hasRole("ADMIN") // Only ADMINs
                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(List.of("*"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(); // Encrypt passwords
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
