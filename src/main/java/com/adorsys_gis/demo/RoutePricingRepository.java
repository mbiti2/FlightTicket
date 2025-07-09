package com.adorsys_gis.demo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RoutePricingRepository extends JpaRepository<RoutePricing, Long> {
    List<RoutePricing> findByKickoffAddressAndDestination(String kickoffAddress, String destination);
}