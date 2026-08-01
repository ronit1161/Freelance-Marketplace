package com.freelancemarketplace.modules.gigs.service;



import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.freelancemarketplace.modules.category.entity.Category;
import com.freelancemarketplace.modules.category.repository.CategoryRepository;
import com.freelancemarketplace.modules.gigs.entity.Gigs;
import com.freelancemarketplace.modules.gigs.mapper.GigMapper;
import com.freelancemarketplace.modules.gigs.records.CreateGigRecord;
import com.freelancemarketplace.modules.gigs.records.GigResponseRecord;
import com.freelancemarketplace.modules.gigs.repository.GigRepository;
import com.freelancemarketplace.modules.user.entity.User;
import com.freelancemarketplace.modules.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GigServiceImpl implements GigService {

    private final GigRepository gigRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final GigMapper gigMapper;

    // get all
    @Override
    public List<GigResponseRecord> getAllGigs() {

        List<Gigs> gigs = gigRepository.findAll();
        List<GigResponseRecord> responseList = new ArrayList<>();
        for (Gigs gig : gigs) {
            if (!gig.isDeleted()) {
                GigResponseRecord dto = gigMapper.toDto(gig);
                responseList.add(dto);
            }
        }

        return responseList;
    }

    // get by id
    @Override
    public GigResponseRecord getGigById(Long id) {
        Gigs gig = gigRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Gig not found"));

        if (gig.isDeleted()) {
            throw new RuntimeException("Gig is deleted");
        }

        return gigMapper.toDto(gig);
    }

    // creaate
    @Override
    public GigResponseRecord createGig(CreateGigRecord dto) {

        Gigs gig = gigMapper.toEntity(dto);

        // fetch relations
        User user = userRepository.findById(dto.freelancerId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Category category = categoryRepository.findById(dto.categoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        gig.setFreelancer(user);
        gig.setCategory(category);

        Gigs saved = gigRepository.save(gig);

        return gigMapper.toDto(saved);
    }

    // update
    @Override
    public GigResponseRecord updateGig(Long id, CreateGigRecord dto) {

        Gigs gig = gigRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Gig not found"));

        if (gig.isDeleted()) {
            throw new RuntimeException("Cannot update deleted gig");
        }

        // update fields
        gig.setTitle(dto.title());
        gig.setDescription(dto.description());
        gig.setPrice(dto.price());
        gig.setDeliveryDays(dto.deliveryDays());
        gig.setThumbnailUrl(dto.thumbnailUrl());

        // update relations
        User user = userRepository.findById(dto.freelancerId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Category category = categoryRepository.findById(dto.categoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        gig.setFreelancer(user);
        gig.setCategory(category);

        Gigs updated = gigRepository.save(gig);

        return gigMapper.toDto(updated);
    }

    // soft delete
    @Override
    public void deleteGig(Long id) {
        Gigs gig = gigRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Gig not found"));

        gig.setDeleted(true);
        gigRepository.save(gig);
    }
}
