package modules.wallet.record;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record WalletResponseRecord(
		Long id,
		BigDecimal availableBalance,
		BigDecimal heldBalance,
		BigDecimal totalBalance,
		Long userId,
		LocalDateTime createdOn
		) 
{}
