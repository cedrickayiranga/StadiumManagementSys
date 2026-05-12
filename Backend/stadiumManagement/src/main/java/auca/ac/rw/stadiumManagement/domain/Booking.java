package auca.ac.rw.stadiumManagement.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Entity
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private LocalDate bookingDate;
    private BigDecimal totalAmount;

    @Enumerated(EnumType.STRING)
    private EBookingStatus status;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnoreProperties({"attendedEvents", "location", "userProfile", "password"})
    private User user;

    @ManyToOne
    @JoinColumn(name = "event_id")
    @JsonIgnoreProperties({"users", "stadium"})
    private Event event;

    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("booking")
    private List<Ticket> tickets;

    public Booking() {
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public LocalDate getBookingDate() {
        return bookingDate;
    }

    public void setBookingDate(LocalDate bookingDate) {
        this.bookingDate = bookingDate;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public EBookingStatus getStatus() {
        return status;
    }

    public void setStatus(EBookingStatus status) {
        this.status = status;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Event getEvent() {
        return event;
    }

    public void setEvent(Event event) {
        this.event = event;
    }

    public List<Ticket> getTickets() {
        return tickets;
    }

    public void setTickets(List<Ticket> tickets) {
        this.tickets = tickets;
    }
}
