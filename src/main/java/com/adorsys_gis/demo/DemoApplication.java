package com.adorsys_gis.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@EnableAspectJAutoProxy
@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.adorsys_gis.demo")
@EntityScan(basePackages = "com.adorsys_gis.demo")
public class DemoApplication {

	public static void main(String[] args) {
		SpringApplication.run(DemoApplication.class, args);

	}

}
