package com.freelancemarketplace.gigservice.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GigResponse {

    private Long id;
    private Long freelancerId;
    private String title;
    private String description;
    private BigDecimal price;
    private Integer deliveryDays;
    private String thumbnailUrl;
    private Long categoryId;
    private String categoryName;
    private boolean active;
    private Integer totalOrders;
    private Double averageRating;
    private Integer totalReviews;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
