package com.freelancemarketplace.modules.admin.service;

import java.util.List;

import com.freelancemarketplace.modules.admin.record.GigSummaryRecord;

public interface AdminGigService {
    List<GigSummaryRecord> getAllGigs();
    void deleteGig(Long id);
}
