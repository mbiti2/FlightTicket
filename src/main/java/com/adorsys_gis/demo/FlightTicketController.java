package com.adorsys_gis.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/tickets")
public class FlightTicketController {
    @Autowired
    private FlightTicketService service;

    @PostMapping
    public FlightTicket createTicket(@RequestBody FlightTicket ticket) {
        return service.save(ticket);
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
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate bookingDate,
            @RequestParam(required = false) String destination,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime kickoff,
            @RequestParam(required = false) String name) {
        return service.search(bookingDate, destination, kickoff, name);
    }
}