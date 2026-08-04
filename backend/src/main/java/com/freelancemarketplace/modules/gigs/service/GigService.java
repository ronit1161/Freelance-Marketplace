package com.freelancemarketplace.modules.gigs.service;

import java.util.List;

import com.freelancemarketplace.modules.gigs.records.CreateGigRecord;
import com.freelancemarketplace.modules.gigs.records.GigResponseRecord;

public interface GigService {

    List<GigResponseRecord> getAllGigs();

    List<GigResponseRecord> getGigsByFreelancerId(Long freelancerId);

    GigResponseRecord getGigById(Long id);

    GigResponseRecord createGig(CreateGigRecord dto);

    GigResponseRecord updateGig(Long id, CreateGigRecord dto);

    void deleteGig(Long id);
}