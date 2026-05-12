package auca.ac.rw.stadiumManagement.controller;

import auca.ac.rw.stadiumManagement.domain.Location;
import auca.ac.rw.stadiumManagement.service.LocationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping(value = "/api/locations", produces = MediaType.APPLICATION_JSON_VALUE)
public class LocationController {

    @Autowired
    private LocationService locationService;

    @PostMapping("/parent")
    public ResponseEntity<?> saveParent(@RequestBody Location location) {
        return ResponseEntity.ok(locationService.saveParent(location));
    }

    @PostMapping("/child")
    public ResponseEntity<?> saveChild(@RequestParam String parentCode, @RequestBody Location location) {
        return ResponseEntity.ok(locationService.saveChild(parentCode, location));
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(locationService.getAllLocations());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable UUID id) {
        Optional<Location> location = locationService.getLocationById(id);
        if (location.isPresent()) {
            return ResponseEntity.ok(location.get());
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/provinces")
    public ResponseEntity<?> getProvinces() {
        return ResponseEntity.ok(locationService.getAllProvinces());
    }

    @GetMapping("/code/{code}")
    public ResponseEntity<?> getByCode(@PathVariable String code) {
        Optional<Location> location = locationService.getLocationByCode(code);
        if (location.isPresent()) {
            return ResponseEntity.ok(location.get());
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/parent/{parentCode}")
    public ResponseEntity<?> getChildren(@PathVariable String parentCode) {
        return ResponseEntity.ok(locationService.getChildrenByParentCode(parentCode));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> update(@PathVariable UUID id, @RequestBody Location location) {
        return ResponseEntity.ok(locationService.updateLocation(id, location));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable UUID id) {
        return ResponseEntity.ok(locationService.deleteLocation(id));
    }
}
