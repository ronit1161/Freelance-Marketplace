package com.freelancemarketplace;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EntityScan("com.freelancemarketplace")
@EnableJpaAuditing
public class FreelancemarketplaceApplication {

	public static void main(String[] args) {
		SpringApplication.run(FreelancemarketplaceApplication.class, args);
	}

}
