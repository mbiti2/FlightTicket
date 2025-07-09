package com.adorsys_gis.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/prices")
public class RoutePricingController {
    @Autowired
    private RoutePricingService service;

    @PostMapping
    public ResponseEntity<?> addPrice(@RequestBody RoutePricing pricing) {
        try {
            return ResponseEntity.ok(service.save(pricing));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping
    public List<RoutePricing> getAllPrices() {
        return service.getAll();
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchPrice(@RequestParam String kickoffAddress, @RequestParam String destination) {
        List<RoutePricing> result = service.search(kickoffAddress, destination);
        if (result.isEmpty()) {
            return ResponseEntity.ok(Map.of(
                    "message", "Route not available",
                    "normalPrice", null,
                    "vipPrice", null));
        }
        RoutePricing price = result.get(0);
        return ResponseEntity.ok(Map.of(
                "kickoffAddress", price.getKickoffAddress(),
                "destination", price.getDestination(),
                "normalPrice", price.getNormalPrice(),
                "vipPrice", price.getVipPrice()));
    }
}