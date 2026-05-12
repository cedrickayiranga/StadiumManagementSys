package auca.ac.rw.stadiumManagement.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.UUID;

@Entity
public class Ticket {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private BigDecimal price;
    private String section;

    @Enumerated(EnumType.STRING)
    private ETicketStatus status;

    @ManyToOne
    @JoinColumn(name = "booking_id")
    @JsonIgnoreProperties("tickets")
    private Booking booking;

    @ManyToOne
    @JoinColumn(name = "event_id")
    @JsonIgnoreProperties("users")
    private Event event;

    public Ticket() {
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public String getSection() {
        return section;
    }

    public void setSection(String section) {
        this.section = section;
    }

    public ETicketStatus getStatus() {
        return status;
    }

    public void setStatus(ETicketStatus status) {
        this.status = status;
    }

    public Booking getBooking() {
        return booking;
    }

    public void setBooking(Booking booking) {
        this.booking = booking;
    }

    public Event getEvent() {
        return event;
    }

    public void setEvent(Event event) {
        this.event = event;
    }
}
