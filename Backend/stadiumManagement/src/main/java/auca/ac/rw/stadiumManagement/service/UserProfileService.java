package auca.ac.rw.stadiumManagement.service;

import auca.ac.rw.stadiumManagement.domain.User;
import auca.ac.rw.stadiumManagement.domain.UserProfile;
import auca.ac.rw.stadiumManagement.repository.UserProfileRepository;
import auca.ac.rw.stadiumManagement.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class UserProfileService {

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private UserRepository userRepository;

    public UserProfile saveUserProfile(UserProfile up) {
        if (up.getUser() == null || !userRepository.existsById(up.getUser().getId())) {
            throw new RuntimeException("User not found.");
        }
        User user = userRepository.findById(up.getUser().getId()).get();
        if (userProfileRepository.existsByUser(user)) {
            throw new RuntimeException("UserProfile already exists for this user.");
        }
        up.setUser(user);
        return userProfileRepository.save(up);
    }

    public List<UserProfile> getAllUserProfiles() {
        return userProfileRepository.findAll();
    }

    public UserProfile getUserProfileById(UUID id) {
        return userProfileRepository.findById(id).orElse(null);
    }

    public UserProfile getUserProfileByUserId(UUID userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user != null) {
            return userProfileRepository.findByUser(user);
        }
        return null;
    }

    public String updateUserProfile(UUID id, UserProfile up) {
        UserProfile existing = userProfileRepository.findById(id).orElse(null);
        if (existing != null) {
            existing.setPhone(up.getPhone());
            existing.setAddress(up.getAddress());
            existing.setDateOfBirth(up.getDateOfBirth());
            userProfileRepository.save(existing);
            return "UserProfile updated successfully.";
        }
        return "UserProfile not found.";
    }

    public String deleteUserProfile(UUID id) {
        if (userProfileRepository.existsById(id)) {
            userProfileRepository.deleteById(id);
            return "UserProfile deleted successfully.";
        }
        return "UserProfile not found.";
    }
}
