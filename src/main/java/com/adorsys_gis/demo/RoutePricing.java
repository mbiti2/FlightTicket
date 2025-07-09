package com.adorsys_gis.demo;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
public class RoutePricing {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String kickoffAddress;
    private String destination;
    private BigDecimal normalPrice;
    private BigDecimal vipPrice;

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getKickoffAddress() {
        return kickoffAddress;
    }

    public void setKickoffAddress(String kickoffAddress) {
        this.kickoffAddress = kickoffAddress;
    }

    public String getDestination() {
        return destination;
    }

    public void setDestination(String destination) {
        this.destination = destination;
    }

    public BigDecimal getNormalPrice() {
        return normalPrice;
    }

    public void setNormalPrice(BigDecimal normalPrice) {
        this.normalPrice = normalPrice;
    }

    public BigDecimal getVipPrice() {
        return vipPrice;
    }

    public void setVipPrice(BigDecimal vipPrice) {
        this.vipPrice = vipPrice;
    }
}