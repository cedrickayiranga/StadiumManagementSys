package auca.ac.rw.stadiumManagement.repository;

import auca.ac.rw.stadiumManagement.domain.Location;
import auca.ac.rw.stadiumManagement.domain.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    Boolean existsByEmail(String email);
    Boolean existsByName(String name);
    Boolean existsByLocation(Location location);
    User findByEmail(String email);
    Page<User> findByLocation(Location location, Pageable pageable);

    @Query("SELECT u FROM User u WHERE " +
           "(u.location.type = auca.ac.rw.stadiumManagement.domain.ELocationType.PROVINCE AND u.location.code = :code) OR " +
           "(u.location.parent IS NOT NULL AND u.location.parent.type = auca.ac.rw.stadiumManagement.domain.ELocationType.PROVINCE AND u.location.parent.code = :code) OR " +
           "(u.location.parent IS NOT NULL AND u.location.parent.parent IS NOT NULL AND u.location.parent.parent.type = auca.ac.rw.stadiumManagement.domain.ELocationType.PROVINCE AND u.location.parent.parent.code = :code) OR " +
           "(u.location.parent IS NOT NULL AND u.location.parent.parent IS NOT NULL AND u.location.parent.parent.parent IS NOT NULL AND u.location.parent.parent.parent.type = auca.ac.rw.stadiumManagement.domain.ELocationType.PROVINCE AND u.location.parent.parent.parent.code = :code) OR " +
           "(u.location.parent IS NOT NULL AND u.location.parent.parent IS NOT NULL AND u.location.parent.parent.parent IS NOT NULL AND u.location.parent.parent.parent.parent IS NOT NULL AND u.location.parent.parent.parent.parent.type = auca.ac.rw.stadiumManagement.domain.ELocationType.PROVINCE AND u.location.parent.parent.parent.parent.code = :code)")
    List<User> findAllUsersByProvinceCode(@Param("code") String code);

    @Query("SELECT u FROM User u WHERE " +
           "(u.location.type = auca.ac.rw.stadiumManagement.domain.ELocationType.PROVINCE AND u.location.name = :name) OR " +
           "(u.location.parent IS NOT NULL AND u.location.parent.type = auca.ac.rw.stadiumManagement.domain.ELocationType.PROVINCE AND u.location.parent.name = :name) OR " +
           "(u.location.parent IS NOT NULL AND u.location.parent.parent IS NOT NULL AND u.location.parent.parent.type = auca.ac.rw.stadiumManagement.domain.ELocationType.PROVINCE AND u.location.parent.parent.name = :name) OR " +
           "(u.location.parent IS NOT NULL AND u.location.parent.parent IS NOT NULL AND u.location.parent.parent.parent IS NOT NULL AND u.location.parent.parent.parent.type = auca.ac.rw.stadiumManagement.domain.ELocationType.PROVINCE AND u.location.parent.parent.parent.name = :name) OR " +
           "(u.location.parent IS NOT NULL AND u.location.parent.parent IS NOT NULL AND u.location.parent.parent.parent IS NOT NULL AND u.location.parent.parent.parent.parent IS NOT NULL AND u.location.parent.parent.parent.parent.type = auca.ac.rw.stadiumManagement.domain.ELocationType.PROVINCE AND u.location.parent.parent.parent.parent.name = :name)")
    List<User> findAllUsersByProvinceName(@Param("name") String name);

    @Query("SELECT u FROM User u WHERE u.location.code = :code")
    List<User> findAllUsersByLocationCode(@Param("code") String code);

    @Query("SELECT u FROM User u WHERE u.location.name = :name")
    List<User> findAllUsersByLocationName(@Param("name") String name);
}
