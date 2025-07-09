package com.adorsys_gis.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.math.BigDecimal;
import org.springframework.data.domain.Sort;

@Service
public class FlightTicketService {
    @Autowired
    private FlightTicketRepository repository;

    public FlightTicket save(FlightTicket ticket) {
        if (ticket.getName() == null || ticket.getName().isEmpty())
            throw new IllegalArgumentException("Name is required");
        if (ticket.getBookingDate() == null)
            throw new IllegalArgumentException("Booking date is required");
        if (ticket.getDestination() == null || ticket.getDestination().isEmpty())
            throw new IllegalArgumentException("Destination is required");
        if (ticket.getKickoff() == null)
            throw new IllegalArgumentException("Kickoff time is required");
        if (ticket.getPickupAddress() == null || ticket.getPickupAddress().isEmpty())
            throw new IllegalArgumentException("Pickup address is required");
        if (ticket.getPrice() == null)
            throw new IllegalArgumentException("Price is required");
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

    public List<FlightTicket> findByPickupAddress(String pickupAddress) {
        return repository.findByPickupAddress(pickupAddress);
    }

    public List<FlightTicket> findByPrice(BigDecimal price) {
        return repository.findByPrice(price);
    }

    public List<FlightTicket> search(LocalDateTime bookingDate, String destination, LocalDateTime kickoff, String name,
            String pickupAddress, BigDecimal price, Sort sort) {
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
        } else if (pickupAddress != null) {
            return repository.findByPickupAddress(pickupAddress);
        } else if (price != null) {
            return repository.findByPrice(price);
        } else {
            return repository.findAll(sort);
        }
    }
}