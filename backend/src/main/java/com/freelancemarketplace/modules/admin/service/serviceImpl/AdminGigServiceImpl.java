package com.freelancemarketplace.modules.admin.service.serviceImpl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.freelancemarketplace.modules.admin.record.GigSummaryRecord;
import com.freelancemarketplace.modules.admin.service.AdminGigService;
import com.freelancemarketplace.modules.gigs.entity.Gigs;
import com.freelancemarketplace.modules.gigs.mapper.GigMapperAdmin;
import com.freelancemarketplace.modules.gigs.repository.GigRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminGigServiceImpl implements AdminGigService {

    private final GigMapperAdmin gigMapperAdmin;
    private final GigRepository gigRepository;

    public List<GigSummaryRecord> getAllGigs() {
        List<Gigs> gigs = gigRepository.findAll();
        return gigMapperAdmin.toSummaryList(gigs);

    }
}
