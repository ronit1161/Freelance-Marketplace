package com.freelancemarketplace.modules.gigs.records;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;



import java.math.BigDecimal;

public record GigResponseRecord(

        Long id,

        String title,

        String description,

        BigDecimal price,

        Integer deliveryDays,

        String thumbnailUrl,

        Integer totalOrders,

        Long freelancerId,

        Long categoryId

) {}
