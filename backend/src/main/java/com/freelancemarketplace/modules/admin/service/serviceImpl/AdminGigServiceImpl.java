package com.freelancemarketplace.modules.admin.service.serviceImpl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.freelancemarketplace.modules.admin.record.GigSummaryRecord;
import com.freelancemarketplace.modules.admin.service.AdminGigService;
import com.freelancemarketplace.modules.gigs.entity.Gigs;
import com.freelancemarketplace.modules.gigs.mapper.GigMapper;
import com.freelancemarketplace.modules.gigs.repository.GigRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminGigServiceImpl implements AdminGigService {

    private final GigMapper gigMapper;
    private final GigRepository gigRepository;

    public List<GigSummaryRecord> getAllGigs() {
        List<Gigs> gigs = gigRepository.findAll();
        return gigMapper.toSummaryList(gigs);

    }

    @Override
    public GigSummaryRecord getGig(Long id) {
        Gigs gig = gigRepository.findById(id).orElseThrow(() -> new RuntimeException("Gig not found"));
        return gigMapper.toSummary(gig);
    }

    @Override
    public GigSummaryRecord deleteGig(Long id) {
        Gigs gig = gigRepository.findById(id).orElseThrow(() -> new RuntimeException("Gig not found"));
        gig.setDeleted(true);
        gigRepository.save(gig);
        return gigMapper.toSummary(gig);
    }
}
