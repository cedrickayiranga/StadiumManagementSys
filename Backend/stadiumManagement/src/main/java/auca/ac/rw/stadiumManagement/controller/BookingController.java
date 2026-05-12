package auca.ac.rw.stadiumManagement.controller;

import auca.ac.rw.stadiumManagement.domain.Booking;
import auca.ac.rw.stadiumManagement.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping(value = "/api/bookings", produces = MediaType.APPLICATION_JSON_VALUE)
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PostMapping("/save")
    public ResponseEntity<?> save(@RequestBody Booking b) {
        return ResponseEntity.ok(bookingService.saveBooking(b));
    }

    @GetMapping("/all")
    public ResponseEntity<?> all() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable UUID id) {
        return ResponseEntity.ok(bookingService.deleteBooking(id));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable UUID id) {
        Booking b = bookingService.getBookingById(id);
        if (b != null) {
            return ResponseEntity.ok(b);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> update(@PathVariable UUID id, @RequestBody Booking b) {
        return ResponseEntity.ok(bookingService.updateBooking(id, b));
    }

    @GetMapping("/by-user/{userId}")
    public ResponseEntity<?> getByUserId(@PathVariable UUID userId) {
        return ResponseEntity.ok(bookingService.getBookingsByUser(userId));
    }
}
