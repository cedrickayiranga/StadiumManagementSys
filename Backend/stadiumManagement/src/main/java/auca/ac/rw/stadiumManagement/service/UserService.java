package auca.ac.rw.stadiumManagement.service;

import auca.ac.rw.stadiumManagement.domain.Location;
import auca.ac.rw.stadiumManagement.domain.User;
import auca.ac.rw.stadiumManagement.repository.LocationRepository;
import auca.ac.rw.stadiumManagement.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LocationRepository locationRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User saveUser(User u) {
        if (userRepository.existsByEmail(u.getEmail())) {
            throw new RuntimeException("User with this email already exists.");
        }
        if (u.getLocation() != null && !locationRepository.existsById(u.getLocation().getId())) {
            throw new RuntimeException("Location not found.");
        }
        u.setPassword(passwordEncoder.encode(u.getPassword()));
        return userRepository.save(u);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(UUID id) {
        return userRepository.findById(id).orElse(null);
    }

    public String updateUser(UUID id, User u) {
        User existing = userRepository.findById(id).orElse(null);
        if (existing != null) {
            existing.setName(u.getName());
            existing.setEmail(u.getEmail());
            if (u.getPassword() != null && !u.getPassword().isEmpty()) {
                existing.setPassword(passwordEncoder.encode(u.getPassword()));
            }
            existing.setRole(u.getRole());
            if (u.getLocation() != null && locationRepository.existsById(u.getLocation().getId())) {
                existing.setLocation(locationRepository.findById(u.getLocation().getId()).get());
            }
            userRepository.save(existing);
            return "User updated successfully.";
        }
        return "User not found.";
    }

    public String deleteUser(UUID id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return "User deleted successfully.";
        }
        return "User not found.";
    }

    public List<User> getUsersByProvinceCode(String code) {
        return userRepository.findAllUsersByProvinceCode(code);
    }

    public List<User> getUsersByProvinceName(String name) {
        return userRepository.findAllUsersByProvinceName(name);
    }

    public Page<User> getUsersPaginated(int page, int size, String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        return userRepository.findAll(pageable);
    }

    public List<User> getUsersByLocationCode(String code) {
        return userRepository.findAllUsersByLocationCode(code);
    }

    public List<User> getUsersByLocationName(String name) {
        return userRepository.findAllUsersByLocationName(name);
    }
}
