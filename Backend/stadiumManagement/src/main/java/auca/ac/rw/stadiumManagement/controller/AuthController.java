package auca.ac.rw.stadiumManagement.controller;

import auca.ac.rw.stadiumManagement.domain.ERole;
import auca.ac.rw.stadiumManagement.domain.Location;
import auca.ac.rw.stadiumManagement.domain.User;
import auca.ac.rw.stadiumManagement.payload.request.LoginRequest;
import auca.ac.rw.stadiumManagement.payload.request.SignupRequest;
import auca.ac.rw.stadiumManagement.payload.response.JwtResponse;
import auca.ac.rw.stadiumManagement.payload.response.MessageResponse;
import auca.ac.rw.stadiumManagement.repository.LocationRepository;
import auca.ac.rw.stadiumManagement.repository.UserRepository;
import auca.ac.rw.stadiumManagement.security.jwt.JwtUtils;
import auca.ac.rw.stadiumManagement.security.services.UserDetailsImpl;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    LocationRepository locationRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateJwtToken(authentication);

            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

            return ResponseEntity.ok(new JwtResponse(
                    jwt,
                    userDetails.getId(),
                    userDetails.getName(),
                    userDetails.getEmail(),
                    userDetails.getAuthorities().iterator().next().getAuthority().replace("ROLE_", "")));
        } catch (Exception e) {
            logger.error("Authentication error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        try {
            if (userRepository.existsByEmail(signUpRequest.getEmail())) {
                return ResponseEntity.badRequest()
                        .body(new MessageResponse("Error: Email is already in use!"));
            }

            User user = new User();
            user.setName(signUpRequest.getName());
            user.setEmail(signUpRequest.getEmail());
            user.setPassword(encoder.encode(signUpRequest.getPassword()));

            String roleStr = signUpRequest.getRole();
            if (roleStr == null || roleStr.isEmpty()) {
                user.setRole(ERole.CUSTOMER);
            } else {
                try {
                    user.setRole(ERole.valueOf(roleStr.toUpperCase()));
                } catch (IllegalArgumentException e) {
                    logger.warn("Invalid role provided: {}. Defaulting to CUSTOMER", roleStr);
                    user.setRole(ERole.CUSTOMER);
                }
            }

            if (signUpRequest.getLocationId() != null) {
                locationRepository.findById(signUpRequest.getLocationId()).ifPresent(user::setLocation);
            }

            userRepository.save(user);
            logger.info("User registered successfully with email: {}", user.getEmail());

            return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
        } catch (Exception e) {
            logger.error("Registration error for email {}: {}", signUpRequest.getEmail(), e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }
}
