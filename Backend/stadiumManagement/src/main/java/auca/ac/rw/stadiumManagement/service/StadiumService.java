package auca.ac.rw.stadiumManagement.service;

import auca.ac.rw.stadiumManagement.domain.Stadium;
import auca.ac.rw.stadiumManagement.repository.StadiumRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class StadiumService {

    @Autowired
    private StadiumRepository stadiumRepository;

    public Stadium saveStadium(Stadium s) {
        return stadiumRepository.save(s);
    }

    public List<Stadium> getAllStadiums() {
        return stadiumRepository.findAll();
    }

    public Stadium getStadiumById(UUID id) {
        return stadiumRepository.findById(id).orElse(null);
    }

    public String updateStadium(UUID id, Stadium s) {
        Stadium existing = stadiumRepository.findById(id).orElse(null);
        if (existing != null) {
            existing.setName(s.getName());
            existing.setCapacity(s.getCapacity());
            existing.setLocation(s.getLocation());
            stadiumRepository.save(existing);
            return "Stadium updated successfully.";
        }
        return "Stadium not found.";
    }

    public String deleteStadium(UUID id) {
        if (stadiumRepository.existsById(id)) {
            stadiumRepository.deleteById(id);
            return "Stadium deleted successfully.";
        }
        return "Stadium not found.";
    }
}
