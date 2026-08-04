package com.freelancemarketplace.modules.gigs.records;

import java.math.BigDecimal;

public record GigResponseRecord(

    Long id,

    String title,

    String description,

    BigDecimal price,

    Integer deliveryDays,

    String thumbnailUrl,

    Integer totalOrders,

    Double averageRating,

    Integer totalReviews,

    Long freelancerId,

    Long categoryId
) {}
