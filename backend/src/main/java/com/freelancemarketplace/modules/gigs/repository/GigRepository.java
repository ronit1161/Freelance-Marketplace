package com.freelancemarketplace.modules.gigs.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.freelancemarketplace.modules.gigs.entity.Gigs;

public interface GigRepository extends JpaRepository<Gigs, Long> {
    List<Gigs> findByIsDeletedFalse();
    List<Gigs> findByCategoryIdAndIsDeletedFalse(Long categoryId);
    List<Gigs> findByFreelancerIdAndIsDeletedFalse(Long freelancerId);
}
