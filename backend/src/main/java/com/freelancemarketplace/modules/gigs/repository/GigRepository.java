package com.freelancemarketplace.modules.gigs.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.freelancemarketplace.modules.gigs.entity.Gigs;

public interface GigRepository extends JpaRepository<Gigs, Long> {

}
