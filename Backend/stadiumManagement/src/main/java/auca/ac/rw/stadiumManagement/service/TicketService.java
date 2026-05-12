package auca.ac.rw.stadiumManagement.service;

import auca.ac.rw.stadiumManagement.domain.Booking;
import auca.ac.rw.stadiumManagement.domain.Ticket;
import auca.ac.rw.stadiumManagement.repository.BookingRepository;
import auca.ac.rw.stadiumManagement.repository.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class TicketService {

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private BookingRepository bookingRepository;

    public Ticket saveTicket(Ticket t) {
        if (t.getBooking() == null || !bookingRepository.existsById(t.getBooking().getId())) {
            throw new RuntimeException("Booking not found.");
        }
        Booking booking = bookingRepository.findById(t.getBooking().getId()).get();
        
        t.setBooking(booking);
        return ticketRepository.save(t);
    }

    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    public Ticket getTicketById(UUID id) {
        return ticketRepository.findById(id).orElse(null);
    }

    public String updateTicket(UUID id, Ticket t) {
        Ticket existing = ticketRepository.findById(id).orElse(null);
        if (existing != null) {
            existing.setPrice(t.getPrice());
            existing.setStatus(t.getStatus());
            ticketRepository.save(existing);
            return "Ticket updated successfully.";
        }
        return "Ticket not found.";
    }

    public String deleteTicket(UUID id) {
        if (ticketRepository.existsById(id)) {
            ticketRepository.deleteById(id);
            return "Ticket deleted successfully.";
        }
        return "Ticket not found.";
    }

    public List<Ticket> getTicketsByBooking(UUID bookingId) {
        Booking booking = bookingRepository.findById(bookingId).orElse(null);
        if (booking != null) {
            return ticketRepository.findByBooking(booking);
        }
        return null;
    }
}
