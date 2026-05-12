package auca.ac.rw.stadiumManagement.controller;

import auca.ac.rw.stadiumManagement.domain.Event;
import auca.ac.rw.stadiumManagement.service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping(value = "/api/events", produces = MediaType.APPLICATION_JSON_VALUE)
public class EventController {

    @Autowired
    private EventService eventService;

    @PostMapping("/save")
    public ResponseEntity<?> save(@RequestBody Event e) {
        return ResponseEntity.ok(eventService.saveEvent(e));
    }

    @GetMapping("/all")
    public ResponseEntity<?> all() {
        return ResponseEntity.ok(eventService.getAllEvents());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable UUID id) {
        Event e = eventService.getEventById(id);
        if (e != null) {
            return ResponseEntity.ok(e);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> update(@PathVariable UUID id, @RequestBody Event e) {
        return ResponseEntity.ok(eventService.updateEvent(id, e));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable UUID id) {
        return ResponseEntity.ok(eventService.deleteEvent(id));
    }

    @GetMapping("/paginated")
    public ResponseEntity<?> getPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "name") String sort) {
        return ResponseEntity.ok(eventService.getEventsPaginated(page, size, sort));
    }

    @GetMapping("/search")
    public ResponseEntity<?> search(
            @RequestParam String name,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        return ResponseEntity.ok(eventService.searchEvents(name, page, size));
    }
}
