package auca.ac.rw.stadiumManagement.controller;

import auca.ac.rw.stadiumManagement.domain.User;
import auca.ac.rw.stadiumManagement.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping(value = "/api/users", produces = MediaType.APPLICATION_JSON_VALUE)
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/save")
    public ResponseEntity<?> save(@RequestBody User u) {
        return ResponseEntity.ok(userService.saveUser(u));
    }

    @GetMapping("/all")
    public ResponseEntity<?> all() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable UUID id) {
        User u = userService.getUserById(id);
        if (u != null) {
            return ResponseEntity.ok(u);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> update(@PathVariable UUID id, @RequestBody User u) {
        return ResponseEntity.ok(userService.updateUser(id, u));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable UUID id) {
        return ResponseEntity.ok(userService.deleteUser(id));
    }

    @PutMapping("/promote/{id}")
    public ResponseEntity<?> promoteToAdmin(@PathVariable UUID id) {
        User u = userService.getUserById(id);
        if (u != null) {
            u.setRole(auca.ac.rw.stadiumManagement.domain.ERole.ADMIN);
            return ResponseEntity.ok(userService.updateUser(id, u));
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/by-province-code")
    public ResponseEntity<?> getByProvinceCode(@RequestParam String code) {
        return ResponseEntity.ok(userService.getUsersByProvinceCode(code));
    }

    @GetMapping("/by-province-name")
    public ResponseEntity<?> getByProvinceName(@RequestParam String name) {
        return ResponseEntity.ok(userService.getUsersByProvinceName(name));
    }

    @GetMapping("/paginated")
    public ResponseEntity<?> getPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "name") String sort) {
        return ResponseEntity.ok(userService.getUsersPaginated(page, size, sort));
    }

    @GetMapping("/by-location-code")
    public ResponseEntity<?> getByLocationCode(@RequestParam String code) {
        return ResponseEntity.ok(userService.getUsersByLocationCode(code));
    }

    @GetMapping("/by-location-name")
    public ResponseEntity<?> getByLocationName(@RequestParam String name) {
        return ResponseEntity.ok(userService.getUsersByLocationName(name));
    }
}
