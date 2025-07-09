package com.adorsys_gis.demo;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin(origins = "*")
@Slf4j
@RestController
@RequestMapping("/hello")
public class HelloWorldController {

    @GetMapping
    public String hello(@RequestParam(value = "name", defaultValue = "World") String name) {
        log.info("Recieved Request");
        return String.format("Hello %s!", name);
    }

    @PostMapping
    public String sendGreetings(@RequestBody String greetings) {
        log.info("Sending greetigs...");

        return greetings;
    }

    // @GetMapping("/hello-world")
    // public String helloWorld() {
    // return "We go again";
    // }
}
