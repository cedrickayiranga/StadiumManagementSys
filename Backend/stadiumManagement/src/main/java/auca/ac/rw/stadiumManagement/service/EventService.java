package auca.ac.rw.stadiumManagement.service;

import auca.ac.rw.stadiumManagement.domain.Event;
import auca.ac.rw.stadiumManagement.repository.EventRepository;
import auca.ac.rw.stadiumManagement.repository.StadiumRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private StadiumRepository stadiumRepository;

    public Event saveEvent(Event e) {
        if (e.getStadium() != null && !stadiumRepository.existsById(e.getStadium().getId())) {
            throw new RuntimeException("Stadium not found.");
        }
        return eventRepository.save(e);
    }

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public Event getEventById(UUID id) {
        return eventRepository.findById(id).orElse(null);
    }

    public String updateEvent(UUID id, Event e) {
        Event existing = eventRepository.findById(id).orElse(null);
        if (existing != null) {
            existing.setName(e.getName());
            existing.setDate(e.getDate());
            existing.setTime(e.getTime());
            existing.setDescription(e.getDescription());
            if (e.getStadium() != null && stadiumRepository.existsById(e.getStadium().getId())) {
                existing.setStadium(stadiumRepository.findById(e.getStadium().getId()).get());
            }
            eventRepository.save(existing);
            return "Event updated successfully.";
        }
        return "Event not found.";
    }

    public String deleteEvent(UUID id) {
        if (eventRepository.existsById(id)) {
            eventRepository.deleteById(id);
            return "Event deleted successfully.";
        }
        return "Event not found.";
    }

    public Page<Event> getEventsPaginated(int page, int size, String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        return eventRepository.findAll(pageable);
    }

    public Page<Event> searchEvents(String name, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return eventRepository.findByNameContaining(name, pageable);
    }
}
