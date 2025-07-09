package com.adorsys_gis.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Collections;

@Service
public class RoutePricingService {
    @Autowired
    private RoutePricingRepository repository;

    public RoutePricing save(RoutePricing pricing) {
        if (pricing.getKickoffAddress() == null || pricing.getKickoffAddress().isEmpty())
            throw new IllegalArgumentException("Kickoff address is required");
        if (pricing.getDestination() == null || pricing.getDestination().isEmpty())
            throw new IllegalArgumentException("Destination is required");
        if (pricing.getNormalPrice() == null)
            throw new IllegalArgumentException("Normal price is required");
        if (pricing.getVipPrice() == null)
            throw new IllegalArgumentException("VIP price is required");
        return repository.save(pricing);
    }

    public List<RoutePricing> getAll() {
        return repository.findAll();
    }

    public List<RoutePricing> search(String kickoffAddress, String destination) {
        List<RoutePricing> result = repository.findByKickoffAddressAndDestination(kickoffAddress, destination);
        if (result.isEmpty()) {
            return Collections.emptyList();
        }
        return result;
    }
}