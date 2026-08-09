package com.freelancemarketplace.walletservice.service;

import com.freelancemarketplace.walletservice.dto.request.LockEscrowRequest;
import com.freelancemarketplace.walletservice.dto.request.RefundEscrowRequest;
import com.freelancemarketplace.walletservice.dto.request.ReleaseEscrowRequest;
import com.freelancemarketplace.walletservice.dto.response.EscrowResponse;

public interface EscrowService {

    EscrowResponse lockEscrow(LockEscrowRequest request);

    EscrowResponse releaseEscrow(ReleaseEscrowRequest request);

    EscrowResponse refundEscrow(RefundEscrowRequest request);
}
