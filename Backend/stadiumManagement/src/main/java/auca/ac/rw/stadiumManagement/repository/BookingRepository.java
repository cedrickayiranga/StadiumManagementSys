package auca.ac.rw.stadiumManagement.repository;

import auca.ac.rw.stadiumManagement.domain.Booking;
import auca.ac.rw.stadiumManagement.domain.Event;
import auca.ac.rw.stadiumManagement.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface BookingRepository extends JpaRepository<Booking, UUID> {
    List<Booking> findByUser(User user);
    List<Booking> findByEvent(Event event);
    Boolean existsByUserAndEvent(User user, Event event);
}
