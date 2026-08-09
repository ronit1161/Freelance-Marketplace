package com.freelancemarketplace.reviewservice.client.dto;

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
public class OrderResponse {

    private Long id;
    private Long clientId;
    private Long freelancerId;
    private Long gigId;
    private BigDecimal agreedPrice;
    private String requirements;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
