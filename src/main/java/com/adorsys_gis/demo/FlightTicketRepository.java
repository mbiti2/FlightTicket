package com.adorsys_gis.demo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface FlightTicketRepository extends JpaRepository<FlightTicket, Long> {
    List<FlightTicket> findByBookingDate(LocalDate bookingDate);

    List<FlightTicket> findByDestination(String destination);

    List<FlightTicket> findByKickoff(LocalDateTime kickoff);

    List<FlightTicket> findByBookingDateAndDestinationAndKickoff(LocalDate bookingDate, String destination,
            LocalDateTime kickoff);

    List<FlightTicket> findByName(String name);
}