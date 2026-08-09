package com.freelancemarketplace.walletservice.dto.response;

import com.freelancemarketplace.walletservice.entity.EscrowStatus;
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
public class EscrowResponse {

    private Long id;
    private Long orderId;
    private Long clientId;
    private Long freelancerId;
    private BigDecimal amount;
    private EscrowStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
