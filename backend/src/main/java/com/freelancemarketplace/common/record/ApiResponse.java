package com.freelancemarketplace.common.record;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import java.time.Instant;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({ "success", "message", "data",  "timestamp" })
public record ApiResponse<T>(
    boolean success,
    String message,
    T data,
    Instant timestamp
) {

    // --- Success Factory Methods ---

    public static <T> ApiResponse<T> success(T data, String message) {
        return new ApiResponse<>(true, message, data ,Instant.now());
    }

    public static <T> ApiResponse<T> success(T data) {
        return success(data, "Operation completed successfully");
    }

    // --- Error Factory Methods ---

    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>(false, message,null,Instant.now());
    }
}