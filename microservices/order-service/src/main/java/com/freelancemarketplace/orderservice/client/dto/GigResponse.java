package com.freelancemarketplace.orderservice.client.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

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
}
