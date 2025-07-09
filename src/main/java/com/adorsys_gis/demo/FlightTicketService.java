package com.adorsys_gis.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class FlightTicketService {
    @Autowired
    private FlightTicketRepository repository;

    public FlightTicket save(FlightTicket ticket) {
        return repository.save(ticket);
    }

    public List<FlightTicket> getAll() {
        return repository.findAll();
    }

    public Optional<FlightTicket> getById(Long id) {
        return repository.findById(id);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    public List<FlightTicket> findByName(String name) {
        return repository.findByName(name);
    }

    public List<FlightTicket> search(LocalDateTime bookingDate, String destination, LocalDateTime kickoff,
            String name) {
        if (name != null) {
            return repository.findByName(name);
        } else if (bookingDate != null && destination != null && kickoff != null) {
            return repository.findByBookingDateAndDestinationAndKickoff(bookingDate, destination, kickoff);
        } else if (bookingDate != null) {
            return repository.findByBookingDate(bookingDate);
        } else if (destination != null) {
            return repository.findByDestination(destination);
        } else if (kickoff != null) {
            return repository.findByKickoff(kickoff);
        } else {
            return repository.findAll();
        }
    }
}