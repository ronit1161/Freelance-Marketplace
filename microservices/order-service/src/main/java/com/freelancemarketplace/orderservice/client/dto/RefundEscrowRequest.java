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
public class RefundEscrowRequest {

    private Long orderId;
    private Long clientId;
    private BigDecimal amount;
}
