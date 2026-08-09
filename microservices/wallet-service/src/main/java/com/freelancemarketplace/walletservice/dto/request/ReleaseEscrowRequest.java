package com.freelancemarketplace.walletservice.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReleaseEscrowRequest {

    @NotNull(message = "Order ID is required")
    private Long orderId;

    @NotNull(message = "Client ID is required")
    private Long clientId;

    @NotNull(message = "Freelancer ID is required")
    private Long freelancerId;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than zero")
    private BigDecimal amount;
}
