package com.adorsys_gis.demo;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;

@Aspect
@Component
public class LoggingAspect {
    Logger logger = LoggerFactory.getLogger(LoggingAspect.class);

    @Before("execution(* com.adorsys_gis.demo.Car.drive(..))")
    public void logBeforeDriving() {
        logger.info("[LOG] About to drive the car.");
    }
}