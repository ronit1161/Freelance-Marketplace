package com.freelancemarketplace.orderservice.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateOrderRequest {

    @NotNull(message = "Gig ID is required")
    private Long gigId;

    @NotBlank(message = "Requirements are required")
    @Size(min = 5, max = 5000, message = "Requirements must be between 5 and 5000 characters")
    private String requirements;
}
