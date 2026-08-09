package com.freelancemarketplace.walletservice.dto.response;

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
public class WalletResponse {

    private Long id;
    private Long userId;
    private BigDecimal availableBalance;
    private BigDecimal escrowBalance;
    private BigDecimal totalBalance;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
