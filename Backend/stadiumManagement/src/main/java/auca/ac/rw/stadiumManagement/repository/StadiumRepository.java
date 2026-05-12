package auca.ac.rw.stadiumManagement.repository;

import auca.ac.rw.stadiumManagement.domain.Stadium;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface StadiumRepository extends JpaRepository<Stadium, UUID> {
    Boolean existsByName(String name);
}
