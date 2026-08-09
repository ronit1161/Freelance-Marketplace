package com.freelancemarketplace.gigservice.repository;

import com.freelancemarketplace.gigservice.entity.Gig;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface GigRepository extends JpaRepository<Gig, Long> {

    Optional<Gig> findByIdAndDeletedFalse(Long id);

    List<Gig> findByFreelancerIdAndDeletedFalse(Long freelancerId);

    List<Gig> findByCategoryIdAndDeletedFalseAndActiveTrue(Long categoryId);

    @Query("SELECT g FROM Gig g WHERE g.deleted = false AND g.active = true " +
            "AND (:categoryId IS NULL OR g.category.id = :categoryId) " +
            "AND (:minPrice IS NULL OR g.price >= :minPrice) " +
            "AND (:maxPrice IS NULL OR g.price <= :maxPrice) " +
            "AND (:search IS NULL OR LOWER(g.title) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(g.description) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<Gig> searchGigs(@Param("categoryId") Long categoryId,
                         @Param("minPrice") BigDecimal minPrice,
                         @Param("maxPrice") BigDecimal maxPrice,
                         @Param("search") String search,
                         Sort sort);
}
