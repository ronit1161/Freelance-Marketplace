package com.freelancemarketplace.gigservice.service.impl;

import com.freelancemarketplace.gigservice.dto.request.CreateGigRequest;
import com.freelancemarketplace.gigservice.dto.request.UpdateGigRequest;
import com.freelancemarketplace.gigservice.dto.response.GigResponse;
import com.freelancemarketplace.gigservice.entity.Category;
import com.freelancemarketplace.gigservice.entity.Gig;
import com.freelancemarketplace.gigservice.repository.CategoryRepository;
import com.freelancemarketplace.gigservice.repository.GigRepository;
import com.freelancemarketplace.gigservice.service.GigService;
import com.freelancemarketplace.shared.exception.ForbiddenException;
import com.freelancemarketplace.shared.exception.ResourceNotFoundException;
import com.freelancemarketplace.shared.exception.UnauthorizedException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GigServiceImpl implements GigService {

    private final GigRepository gigRepository;
    private final CategoryRepository categoryRepository;

    @Override
    @Transactional
    public GigResponse createGig(CreateGigRequest request, Long authenticatedUserId, String userRole) {
        enforceAuthentication(authenticatedUserId);
        enforceFreelancer(userRole, "create a gig");

        Category category = categoryRepository.findByIdAndActiveTrue(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", request.getCategoryId()));

        Gig gig = Gig.builder()
                .freelancerId(authenticatedUserId)
                .title(request.getTitle().trim())
                .description(request.getDescription().trim())
                .price(request.getPrice())
                .deliveryDays(request.getDeliveryDays())
                .thumbnailUrl(request.getThumbnailUrl() != null ? request.getThumbnailUrl().trim() : null)
                .category(category)
                .active(true)
                .deleted(false)
                .totalOrders(0)
                .averageRating(0.0)
                .totalReviews(0)
                .build();

        Gig savedGig = gigRepository.save(gig);
        return mapToResponse(savedGig);
    }

    @Override
    public GigResponse getGigById(Long id) {
        Gig gig = gigRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException("Gig", "id", id));
        return mapToResponse(gig);
    }

    @Override
    public List<GigResponse> getAllGigs(Long categoryId, BigDecimal minPrice, BigDecimal maxPrice, String search, String sortBy) {
        Sort sort = resolveSort(sortBy);
        String searchParam = (search != null && !search.trim().isEmpty()) ? search.trim() : null;

        return gigRepository.searchGigs(categoryId, minPrice, maxPrice, searchParam, sort).stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public List<GigResponse> getGigsByFreelancerId(Long freelancerId) {
        return gigRepository.findByFreelancerIdAndDeletedFalse(freelancerId).stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public List<GigResponse> getMyGigs(Long authenticatedUserId, String userRole) {
        enforceAuthentication(authenticatedUserId);
        enforceFreelancer(userRole, "view your gigs");

        return gigRepository.findByFreelancerIdAndDeletedFalse(authenticatedUserId).stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional
    public GigResponse updateGig(Long id, UpdateGigRequest request, Long authenticatedUserId, String userRole) {
        enforceAuthentication(authenticatedUserId);
        enforceFreelancer(userRole, "update a gig");

        Gig gig = gigRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException("Gig", "id", id));

        // CRITICAL OWNERSHIP CHECK
        if (!gig.getFreelancerId().equals(authenticatedUserId)) {
            throw new ForbiddenException("You do not have permission to update this gig");
        }

        Category category = categoryRepository.findByIdAndActiveTrue(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", request.getCategoryId()));

        gig.setTitle(request.getTitle().trim());
        gig.setDescription(request.getDescription().trim());
        gig.setPrice(request.getPrice());
        gig.setDeliveryDays(request.getDeliveryDays());
        gig.setThumbnailUrl(request.getThumbnailUrl() != null ? request.getThumbnailUrl().trim() : null);
        gig.setCategory(category);
        if (request.getActive() != null) {
            gig.setActive(request.getActive());
        }

        Gig updatedGig = gigRepository.save(gig);
        return mapToResponse(updatedGig);
    }

    @Override
    @Transactional
    public void deleteGig(Long id, Long authenticatedUserId, String userRole) {
        enforceAuthentication(authenticatedUserId);

        Gig gig = gigRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException("Gig", "id", id));

        boolean isOwner = gig.getFreelancerId().equals(authenticatedUserId);
        boolean isAdmin = "ROLE_ADMIN".equalsIgnoreCase(userRole);

        if (!isOwner && !isAdmin) {
            throw new ForbiddenException("You do not have permission to delete this gig");
        }

        // Soft deletion
        gig.setDeleted(true);
        gigRepository.save(gig);
    }

    private void enforceAuthentication(Long authenticatedUserId) {
        if (authenticatedUserId == null) {
            throw new UnauthorizedException("Authentication is required to perform this action");
        }
    }

    private void enforceFreelancer(String userRole, String action) {
        if (userRole == null || !"ROLE_FREELANCER".equalsIgnoreCase(userRole)) {
            throw new ForbiddenException("Only freelancers are permitted to " + action);
        }
    }

    private Sort resolveSort(String sortBy) {
        if (sortBy == null) {
            return Sort.by(Sort.Direction.DESC, "createdAt");
        }
        return switch (sortBy.toLowerCase()) {
            case "price_asc" -> Sort.by(Sort.Direction.ASC, "price");
            case "price_desc" -> Sort.by(Sort.Direction.DESC, "price");
            case "most_ordered" -> Sort.by(Sort.Direction.DESC, "totalOrders");
            default -> Sort.by(Sort.Direction.DESC, "createdAt");
        };
    }

    private GigResponse mapToResponse(Gig gig) {
        return GigResponse.builder()
                .id(gig.getId())
                .freelancerId(gig.getFreelancerId())
                .title(gig.getTitle())
                .description(gig.getDescription())
                .price(gig.getPrice())
                .deliveryDays(gig.getDeliveryDays())
                .thumbnailUrl(gig.getThumbnailUrl())
                .categoryId(gig.getCategory().getId())
                .categoryName(gig.getCategory().getName())
                .active(gig.isActive())
                .totalOrders(gig.getTotalOrders())
                .averageRating(gig.getAverageRating())
                .totalReviews(gig.getTotalReviews())
                .createdAt(gig.getCreatedAt())
                .updatedAt(gig.getUpdatedAt())
                .build();
    }
}
