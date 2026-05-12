package auca.ac.rw.stadiumManagement.service;

import auca.ac.rw.stadiumManagement.domain.Location;
import auca.ac.rw.stadiumManagement.repository.LocationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class LocationService {

    @Autowired
    private LocationRepository locationRepository;

    public Location saveParent(Location location) {
        if (locationRepository.existsByCode(location.getCode())) {
            throw new RuntimeException("Location already exists.");
        }
        return locationRepository.save(location);
    }

    public Location saveChild(String parentCode, Location location) {
        Optional<Location> parent = locationRepository.findByCode(parentCode);
        if (parent.isPresent()) {
            if (locationRepository.existsByCode(location.getCode())) {
                throw new RuntimeException("Location already exists.");
            }
            location.setParent(parent.get());
            return locationRepository.save(location);
        }
        throw new RuntimeException("Parent location not found.");
    }

    public List<Location> getAllLocations() {
        return locationRepository.findAll();
    }

    public Optional<Location> getLocationById(UUID id) {
        return locationRepository.findById(id);
    }

    public Optional<Location> getLocationByCode(String code) {
        return locationRepository.findByCode(code);
    }

    public List<Location> getAllProvinces() {
        return locationRepository.findAllProvinces();
    }

    public List<Location> getChildrenByParentCode(String parentCode) {
        return locationRepository.findByParentCode(parentCode);
    }

    public String updateLocation(UUID id, Location location) {
        if (locationRepository.existsById(id)) {
            location.setId(id);
            locationRepository.save(location);
            return "Location updated successfully.";
        }
        return "Location not found.";
    }

    public String deleteLocation(UUID id) {
        if (locationRepository.existsById(id)) {
            locationRepository.deleteById(id);
            return "Location deleted successfully.";
        }
        return "Location not found.";
    }
}
