package com.adorsys_gis.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.math.BigDecimal;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/tickets")
public class FlightTicketController {
    @Autowired
    private FlightTicketService service;

    @PostMapping
    public ResponseEntity<?> createTicket(@RequestBody FlightTicket ticket) {
        try {
            return ResponseEntity.ok(service.save(ticket));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public List<FlightTicket> getAllTickets() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Optional<FlightTicket> getTicketById(@PathVariable Long id) {
        return service.getById(id);
    }

    @DeleteMapping("/{id}")
    public void deleteTicket(@PathVariable Long id) {
        service.delete(id);
    }

    @GetMapping("/search")
    public List<FlightTicket> searchTickets(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime bookingDate,
            @RequestParam(required = false) String destination,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime kickoff,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String pickupAddress,
            @RequestParam(required = false) BigDecimal price,
            @RequestParam(required = false, defaultValue = "id,asc") String sort) {
        Sort sortObj = Sort.by(Sort.Order.asc("id"));
        if (sort != null && !sort.isEmpty()) {
            String[] parts = sort.split(",");
            if (parts.length == 2) {
                sortObj = Sort.by(Sort.Direction.fromString(parts[1]), parts[0]);
            }
        }
        return service.search(bookingDate, destination, kickoff, name, pickupAddress, price, sortObj);
    }
}