package com.freelancemarketplace.modules.admin.service.serviceImpl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.freelancemarketplace.modules.admin.record.GigSummaryRecord;
import com.freelancemarketplace.modules.admin.repository.GigRepo;
import com.freelancemarketplace.modules.admin.service.AdminGigService;
import com.freelancemarketplace.modules.gigs.entity.Gigs;
import com.freelancemarketplace.modules.gigs.mapper.GigMapperAdmin;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminGigServiceImpl implements AdminGigService {

    private final GigMapperAdmin gigMapperAdmin;
    private final GigRepo gigRepo;

    public List<GigSummaryRecord> getAllGigs() {
        List<Gigs> gigs = gigRepo.findAll();
        return gigMapperAdmin.toSummaryList(gigs);
    }

    @Override
    public void deleteGig(Long id) {
        Gigs gig = gigRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Gig not found with id: " + id));
        gig.setDeleted(true);
        gigRepo.save(gig);
    }
}
