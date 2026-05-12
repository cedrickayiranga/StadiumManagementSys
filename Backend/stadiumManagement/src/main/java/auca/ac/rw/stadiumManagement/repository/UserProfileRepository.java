package auca.ac.rw.stadiumManagement.repository;

import auca.ac.rw.stadiumManagement.domain.User;
import auca.ac.rw.stadiumManagement.domain.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface UserProfileRepository extends JpaRepository<UserProfile, UUID> {
    Boolean existsByUser(User user);
    UserProfile findByUser(User user);
}
