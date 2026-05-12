package auca.ac.rw.stadiumManagement.repository;

import auca.ac.rw.stadiumManagement.domain.Booking;
import auca.ac.rw.stadiumManagement.domain.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, UUID> {
    List<Ticket> findByBooking(Booking booking);
    Boolean existsByBooking(Booking booking);
}
