package com.freelancemarketplace.gigservice.service;

import com.freelancemarketplace.gigservice.dto.request.CreateGigRequest;
import com.freelancemarketplace.gigservice.dto.request.UpdateGigRequest;
import com.freelancemarketplace.gigservice.dto.response.GigResponse;
import com.freelancemarketplace.gigservice.entity.Category;
import com.freelancemarketplace.gigservice.entity.Gig;
import com.freelancemarketplace.gigservice.repository.CategoryRepository;
import com.freelancemarketplace.gigservice.repository.GigRepository;
import com.freelancemarketplace.gigservice.service.impl.GigServiceImpl;
import com.freelancemarketplace.shared.exception.ForbiddenException;
import com.freelancemarketplace.shared.exception.ResourceNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Sort;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class GigServiceTest {

    @Mock
    private GigRepository gigRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @InjectMocks
    private GigServiceImpl gigService;

    private Category sampleCategory;
    private Gig sampleGig;

    @BeforeEach
    void setUp() {
        sampleCategory = Category.builder()
                .id(1L)
                .name("Web Development")
                .description("Full stack web development")
                .active(true)
                .build();

        sampleGig = Gig.builder()
                .id(10L)
                .freelancerId(101L)
                .title("Build Full Stack Spring Boot and React App")
                .description("Professional microservices application built with Spring Boot")
                .price(BigDecimal.valueOf(500.00))
                .deliveryDays(5)
                .thumbnailUrl("https://example.com/gig.png")
                .category(sampleCategory)
                .active(true)
                .deleted(false)
                .totalOrders(3)
                .averageRating(4.8)
                .totalReviews(5)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    @Test
    @DisplayName("Freelancer should successfully create a gig")
    void createGig_Freelancer_Success() {
        CreateGigRequest request = CreateGigRequest.builder()
                .title("Build Full Stack Spring Boot and React App")
                .description("Professional microservices application built with Spring Boot")
                .price(BigDecimal.valueOf(500.00))
                .deliveryDays(5)
                .thumbnailUrl("https://example.com/gig.png")
                .categoryId(1L)
                .build();

        when(categoryRepository.findByIdAndActiveTrue(1L)).thenReturn(Optional.of(sampleCategory));
        when(gigRepository.save(any(Gig.class))).thenReturn(sampleGig);

        GigResponse response = gigService.createGig(request, 101L, "ROLE_FREELANCER");

        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(10L);
        assertThat(response.getFreelancerId()).isEqualTo(101L);
        assertThat(response.getTitle()).isEqualTo(sampleGig.getTitle());
        assertThat(response.getCategoryName()).isEqualTo("Web Development");

        verify(gigRepository).save(any(Gig.class));
    }

    @Test
    @DisplayName("Client should be forbidden from creating a gig")
    void createGig_ClientRole_ThrowsForbiddenException() {
        CreateGigRequest request = CreateGigRequest.builder()
                .title("Some Gig")
                .categoryId(1L)
                .build();

        assertThatThrownBy(() -> gigService.createGig(request, 102L, "ROLE_CLIENT"))
                .isInstanceOf(ForbiddenException.class)
                .hasMessageContaining("Only freelancers are permitted to create a gig");

        verifyNoInteractions(gigRepository);
    }

    @Test
    @DisplayName("Admin should be forbidden from creating a gig")
    void createGig_AdminRole_ThrowsForbiddenException() {
        CreateGigRequest request = CreateGigRequest.builder()
                .title("Some Gig")
                .categoryId(1L)
                .build();

        assertThatThrownBy(() -> gigService.createGig(request, 999L, "ROLE_ADMIN"))
                .isInstanceOf(ForbiddenException.class)
                .hasMessageContaining("Only freelancers are permitted to create a gig");

        verifyNoInteractions(gigRepository);
    }

    @Test
    @DisplayName("Should successfully retrieve gig by ID")
    void getGigById_Success() {
        when(gigRepository.findByIdAndDeletedFalse(10L)).thenReturn(Optional.of(sampleGig));

        GigResponse response = gigService.getGigById(10L);

        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(10L);
        assertThat(response.getTitle()).isEqualTo(sampleGig.getTitle());
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException when gig does not exist")
    void getGigById_NotFound_ThrowsException() {
        when(gigRepository.findByIdAndDeletedFalse(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> gigService.getGigById(99L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Gig not found with id: '99'");
    }

    @Test
    @DisplayName("Freelancer should successfully update their own gig")
    void updateGig_Owner_Success() {
        UpdateGigRequest request = UpdateGigRequest.builder()
                .title("Updated Title: High Performance Spring Microservices")
                .description("Updated Description")
                .price(BigDecimal.valueOf(650.00))
                .deliveryDays(7)
                .thumbnailUrl("https://example.com/updated.png")
                .categoryId(1L)
                .active(true)
                .build();

        when(gigRepository.findByIdAndDeletedFalse(10L)).thenReturn(Optional.of(sampleGig));
        when(categoryRepository.findByIdAndActiveTrue(1L)).thenReturn(Optional.of(sampleCategory));
        when(gigRepository.save(any(Gig.class))).thenReturn(sampleGig);

        GigResponse response = gigService.updateGig(10L, request, 101L, "ROLE_FREELANCER");

        assertThat(response).isNotNull();
        assertThat(sampleGig.getTitle()).isEqualTo("Updated Title: High Performance Spring Microservices");
        assertThat(sampleGig.getPrice()).isEqualTo(BigDecimal.valueOf(650.00));
        verify(gigRepository).save(sampleGig);
    }

    @Test
    @DisplayName("Freelancer should be forbidden from updating another freelancer's gig")
    void updateGig_NonOwner_ThrowsForbiddenException() {
        UpdateGigRequest request = UpdateGigRequest.builder()
                .title("Malicious update")
                .categoryId(1L)
                .build();

        when(gigRepository.findByIdAndDeletedFalse(10L)).thenReturn(Optional.of(sampleGig));

        // Authenticated user 102 attempts to update gig owned by 101
        assertThatThrownBy(() -> gigService.updateGig(10L, request, 102L, "ROLE_FREELANCER"))
                .isInstanceOf(ForbiddenException.class)
                .hasMessageContaining("You do not have permission to update this gig");

        verify(gigRepository, never()).save(any());
    }

    @Test
    @DisplayName("Freelancer should successfully soft-delete their own gig")
    void deleteGig_Owner_Success() {
        when(gigRepository.findByIdAndDeletedFalse(10L)).thenReturn(Optional.of(sampleGig));
        when(gigRepository.save(any(Gig.class))).thenReturn(sampleGig);

        gigService.deleteGig(10L, 101L, "ROLE_FREELANCER");

        assertThat(sampleGig.isDeleted()).isTrue();
        verify(gigRepository).save(sampleGig);
    }

    @Test
    @DisplayName("Freelancer should be forbidden from deleting another freelancer's gig")
    void deleteGig_NonOwner_ThrowsForbiddenException() {
        when(gigRepository.findByIdAndDeletedFalse(10L)).thenReturn(Optional.of(sampleGig));

        // Authenticated user 102 attempts to delete gig owned by 101
        assertThatThrownBy(() -> gigService.deleteGig(10L, 102L, "ROLE_FREELANCER"))
                .isInstanceOf(ForbiddenException.class)
                .hasMessageContaining("You do not have permission to delete this gig");

        verify(gigRepository, never()).save(any());
    }

    @Test
    @DisplayName("Admin should successfully delete any gig")
    void deleteGig_Admin_Success() {
        when(gigRepository.findByIdAndDeletedFalse(10L)).thenReturn(Optional.of(sampleGig));
        when(gigRepository.save(any(Gig.class))).thenReturn(sampleGig);

        gigService.deleteGig(10L, 999L, "ROLE_ADMIN");

        assertThat(sampleGig.isDeleted()).isTrue();
        verify(gigRepository).save(sampleGig);
    }

    @Test
    @DisplayName("My Gigs should return only gigs belonging to the authenticated freelancer")
    void getMyGigs_Success() {
        when(gigRepository.findByFreelancerIdAndDeletedFalse(101L)).thenReturn(List.of(sampleGig));

        List<GigResponse> gigs = gigService.getMyGigs(101L, "ROLE_FREELANCER");

        assertThat(gigs).hasSize(1);
        assertThat(gigs.get(0).getFreelancerId()).isEqualTo(101L);
    }

    @Test
    @DisplayName("Search gigs should filter and sort properly")
    void searchGigs_Success() {
        when(gigRepository.searchGigs(eq(1L), eq(BigDecimal.valueOf(100)), eq(BigDecimal.valueOf(1000)), eq("Spring"), any(Sort.class)))
                .thenReturn(List.of(sampleGig));

        List<GigResponse> gigs = gigService.getAllGigs(1L, BigDecimal.valueOf(100), BigDecimal.valueOf(1000), "Spring", "price_asc");

        assertThat(gigs).hasSize(1);
        assertThat(gigs.get(0).getId()).isEqualTo(10L);
    }
}
