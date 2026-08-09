package com.freelancemarketplace.orderservice.client;

import com.freelancemarketplace.orderservice.client.dto.EscrowResponse;
import com.freelancemarketplace.orderservice.client.dto.LockEscrowRequest;
import com.freelancemarketplace.orderservice.client.dto.RefundEscrowRequest;
import com.freelancemarketplace.orderservice.client.dto.ReleaseEscrowRequest;
import com.freelancemarketplace.shared.dto.ApiResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "wallet-service", path = "/wallet")
public interface WalletClient {

    @PostMapping("/escrow/lock")
    ApiResponse<EscrowResponse> lockEscrow(@RequestBody LockEscrowRequest request);

    @PostMapping("/escrow/release")
    ApiResponse<EscrowResponse> releaseEscrow(@RequestBody ReleaseEscrowRequest request);

    @PostMapping("/escrow/refund")
    ApiResponse<EscrowResponse> refundEscrow(@RequestBody RefundEscrowRequest request);
}
