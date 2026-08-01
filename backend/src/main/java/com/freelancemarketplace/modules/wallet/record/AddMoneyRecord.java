package com.freelancemarketplace.modules.wallet.record;

import java.math.BigDecimal;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record AddMoneyRecord(
	    @NotNull(message = "User ID is required")
	    Long userId,
	    @NotNull(message = "Amount is required")
	    @Positive(message = "Amount must be greater than zero")
	    BigDecimal amount
	) {}