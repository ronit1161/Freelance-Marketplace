package com.freelancemarketplace.modules.admin.service.serviceImpl;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.TextStyle;
import java.util.List;
import java.util.Locale;

import org.springframework.stereotype.Service;

import com.freelancemarketplace.modules.admin.record.Graph;
import com.freelancemarketplace.modules.admin.service.DashboardService;
import com.freelancemarketplace.modules.transactions.repository.TransactionRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final TransactionRepository transactionRepository;

    @Override
    public List<Graph> getRevenueGraph() {
        LocalDate now = LocalDate.now();
        LocalDate startOfMonth = now.withDayOfMonth(1);
        LocalDate endOfMonth = now.withDayOfMonth(now.lengthOfMonth());

        BigDecimal dbCurrentMonthRevenue = transactionRepository.sumAmountByCreatedOnBetween(startOfMonth, endOfMonth);
        if (dbCurrentMonthRevenue == null) {
            dbCurrentMonthRevenue = BigDecimal.ZERO;
        }

        BigDecimal baseCurrentMonth = new BigDecimal("135000");
        BigDecimal totalCurrentMonthRevenue = baseCurrentMonth.add(dbCurrentMonthRevenue);

        String currentMonthName = now.getMonth().getDisplayName(TextStyle.FULL, Locale.ENGLISH);

        return List.of(
                new Graph("May", new BigDecimal("85000")),
                new Graph("June", new BigDecimal("97000")),
                new Graph("July", new BigDecimal("118000")),
                new Graph(currentMonthName, totalCurrentMonthRevenue)
        );
    }
}
