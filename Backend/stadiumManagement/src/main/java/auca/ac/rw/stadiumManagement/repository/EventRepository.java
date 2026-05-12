package auca.ac.rw.stadiumManagement.repository;

import auca.ac.rw.stadiumManagement.domain.Event;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface EventRepository extends JpaRepository<Event, UUID> {
    Boolean existsByName(String name);
    Page<Event> findByNameContaining(String name, Pageable pageable);
}
