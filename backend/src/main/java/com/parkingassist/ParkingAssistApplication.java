package com.parkingassist;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;
/** Composition root: a modular monolith keeps transactional business flows local while the product is young. */
@SpringBootApplication @EnableScheduling
public class ParkingAssistApplication {
 public static void main(String[] args) { SpringApplication.run(ParkingAssistApplication.class,args); }
}