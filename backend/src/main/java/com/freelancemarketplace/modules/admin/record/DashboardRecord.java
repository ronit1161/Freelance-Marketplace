package com.freelancemarketplace.modules.admin.record;

import java.math.BigDecimal;

public record DashboardRecord(
		long totalUsers,
		long totalClients,
		long totalFreelancers,
		long totalGigs,
		long totalOrders,
		long pendingOrders,
		long completedOrders,
		long cancelledOrders,
		BigDecimal totalRevenue,
		BigDecimal totalTransactionsAmount
) {}
