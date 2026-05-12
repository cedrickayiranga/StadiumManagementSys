package auca.ac.rw.stadiumManagement.controller;

import auca.ac.rw.stadiumManagement.domain.UserProfile;
import auca.ac.rw.stadiumManagement.service.UserProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping(value = "/api/user-profiles", produces = MediaType.APPLICATION_JSON_VALUE)
public class UserProfileController {

    @Autowired
    private UserProfileService userProfileService;

    @PostMapping("/save")
    public ResponseEntity<?> save(@RequestBody UserProfile up) {
        return ResponseEntity.ok(userProfileService.saveUserProfile(up));
    }

    @GetMapping("/all")
    public ResponseEntity<?> all() {
        return ResponseEntity.ok(userProfileService.getAllUserProfiles());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable UUID id) {
        UserProfile up = userProfileService.getUserProfileById(id);
        if (up != null) {
            return ResponseEntity.ok(up);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getByUserId(@PathVariable UUID userId) {
        UserProfile up = userProfileService.getUserProfileByUserId(userId);
        if (up != null) {
            return ResponseEntity.ok(up);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> update(@PathVariable UUID id, @RequestBody UserProfile up) {
        return ResponseEntity.ok(userProfileService.updateUserProfile(id, up));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable UUID id) {
        return ResponseEntity.ok(userProfileService.deleteUserProfile(id));
    }
}
