package com.example.demo.security;

import com.example.demo.service.AppUserService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtUtils jwtUtils;
    private final AppUserService appUserService;

    public JwtAuthFilter(JwtUtils jwtUtils, AppUserService appUserService) {
        this.jwtUtils = jwtUtils;
        this.appUserService = appUserService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization"); //frontend ye authorization ka token bhejta hai ye line us authorization ko khlne ke liye hai
        String token = null;
        String username = null;

        if (authHeader != null && authHeader.startsWith("Bearer ")) { // kya authheader hai aur kya vo bearer se shuru ho rha hai isliye hum usko is tarah se check kar rhe hai
            token = authHeader.substring(7); // ye "Bearer" iske baad se actual token hai isliye hum 7 se shuru kar rhe hai
            username = jwtUtils.extractUsername(token); // ye token me se username ko nikl rha hai
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) { // kya username hai aur kya securitycontext meauthentication nahi hai isliye hum usko is tarah se check kar rhe hai
            UserDetails userDetails = appUserService.loadUserByUsername(username); // ye username se user ko load kr rha hai

            if (jwtUtils.validateToken(token, userDetails.getUsername())) {
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities()
                );
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        filterChain.doFilter(request, response);
    }
}
