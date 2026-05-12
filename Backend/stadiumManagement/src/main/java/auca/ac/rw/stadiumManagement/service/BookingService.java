package auca.ac.rw.stadiumManagement.service;

import auca.ac.rw.stadiumManagement.domain.Booking;
import auca.ac.rw.stadiumManagement.domain.Event;
import auca.ac.rw.stadiumManagement.domain.User;
import auca.ac.rw.stadiumManagement.repository.BookingRepository;
import auca.ac.rw.stadiumManagement.repository.EventRepository;
import auca.ac.rw.stadiumManagement.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EventRepository eventRepository;

    public Booking saveBooking(Booking b) {
        if (b.getUser() == null || !userRepository.existsById(b.getUser().getId())) {
            throw new RuntimeException("User not found.");
        }
        if (b.getEvent() == null || !eventRepository.existsById(b.getEvent().getId())) {
            throw new RuntimeException("Event not found.");
        }
        User user = userRepository.findById(b.getUser().getId()).get();
        Event event = eventRepository.findById(b.getEvent().getId()).get();
        
        b.setUser(user);
        b.setEvent(event);
        b.setBookingDate(java.time.LocalDate.now());
        if (b.getStatus() == null) {
            b.setStatus(auca.ac.rw.stadiumManagement.domain.EBookingStatus.PENDING);
        }
        
        return bookingRepository.save(b);
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public Booking getBookingById(UUID id) {
        return bookingRepository.findById(id).orElse(null);
    }

    public String updateBooking(UUID id, Booking b) {
        Booking existing = bookingRepository.findById(id).orElse(null);
        if (existing != null) {
            existing.setStatus(b.getStatus());
            existing.setTotalAmount(b.getTotalAmount());
            bookingRepository.save(existing);
            return "Booking updated successfully.";
        }
        return "Booking not found.";
    }

    public String deleteBooking(UUID id) {
        if (bookingRepository.existsById(id)) {
            bookingRepository.deleteById(id);
            return "Booking deleted successfully.";
        }
        return "Booking not found.";
    }

    public List<Booking> getBookingsByUser(UUID userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user != null) {
            return bookingRepository.findByUser(user);
        }
        return null;
    }
}
