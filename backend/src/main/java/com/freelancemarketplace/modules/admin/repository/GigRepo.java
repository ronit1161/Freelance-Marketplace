package com.freelancemarketplace.modules.admin.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.freelancemarketplace.modules.gigs.entity.Gigs;

public interface GigRepo extends JpaRepository<Gigs, Long> {
        

}
