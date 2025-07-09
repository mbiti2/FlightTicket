package com.adorsys_gis.demo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.math.BigDecimal;
import org.springframework.data.domain.Sort;

@Repository
public interface FlightTicketRepository extends JpaRepository<FlightTicket, Long> {
    List<FlightTicket> findByBookingDate(LocalDateTime bookingDate);

    List<FlightTicket> findByDestination(String destination);

    List<FlightTicket> findByKickoff(LocalDateTime kickoff);

    List<FlightTicket> findByBookingDateAndDestinationAndKickoff(LocalDateTime bookingDate, String destination,
            LocalDateTime kickoff);

    List<FlightTicket> findByName(String name);

    List<FlightTicket> findByPickupAddress(String pickupAddress);

    List<FlightTicket> findByPrice(BigDecimal price);
}