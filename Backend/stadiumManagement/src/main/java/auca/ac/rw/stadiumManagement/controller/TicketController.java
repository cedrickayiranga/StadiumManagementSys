package auca.ac.rw.stadiumManagement.controller;

import auca.ac.rw.stadiumManagement.domain.Ticket;
import auca.ac.rw.stadiumManagement.service.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping(value = "/api/tickets", produces = MediaType.APPLICATION_JSON_VALUE)
public class TicketController {

    @Autowired
    private TicketService ticketService;

    @PostMapping("/save")
    public ResponseEntity<?> save(@RequestBody Ticket t) {
        return ResponseEntity.ok(ticketService.saveTicket(t));
    }

    @GetMapping("/all")
    public ResponseEntity<?> all() {
        return ResponseEntity.ok(ticketService.getAllTickets());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable UUID id) {
        Ticket t = ticketService.getTicketById(id);
        if (t != null) {
            return ResponseEntity.ok(t);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> update(@PathVariable UUID id, @RequestBody Ticket t) {
        return ResponseEntity.ok(ticketService.updateTicket(id, t));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable UUID id) {
        return ResponseEntity.ok(ticketService.deleteTicket(id));
    }

    @GetMapping("/by-booking/{bookingId}")
    public ResponseEntity<?> getByBookingId(@PathVariable UUID bookingId) {
        return ResponseEntity.ok(ticketService.getTicketsByBooking(bookingId));
    }
}
