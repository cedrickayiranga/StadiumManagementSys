package auca.ac.rw.stadiumManagement.controller;

import auca.ac.rw.stadiumManagement.domain.Stadium;
import auca.ac.rw.stadiumManagement.service.StadiumService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping(value = "/api/stadiums", produces = MediaType.APPLICATION_JSON_VALUE)
public class StadiumController {

    @Autowired
    private StadiumService stadiumService;

    @PostMapping("/save")
    public ResponseEntity<?> save(@RequestBody Stadium s) {
        return ResponseEntity.ok(stadiumService.saveStadium(s));
    }

    @GetMapping("/all")
    public ResponseEntity<?> all() {
        return ResponseEntity.ok(stadiumService.getAllStadiums());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable UUID id) {
        Stadium s = stadiumService.getStadiumById(id);
        if (s != null) {
            return ResponseEntity.ok(s);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> update(@PathVariable UUID id, @RequestBody Stadium s) {
        return ResponseEntity.ok(stadiumService.updateStadium(id, s));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable UUID id) {
        return ResponseEntity.ok(stadiumService.deleteStadium(id));
    }
}
