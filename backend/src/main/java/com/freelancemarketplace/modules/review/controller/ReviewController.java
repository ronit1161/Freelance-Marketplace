package com.freelancemarketplace.modules.review.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.freelancemarketplace.modules.review.record.CreateReviewRecord;
import com.freelancemarketplace.modules.review.record.ReviewResponseRecord;
import com.freelancemarketplace.modules.review.service.ReviewService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;


@RestController
@RequestMapping("/reviews")
@RequiredArgsConstructor
public class ReviewController {


    private final ReviewService reviewService;



    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ReviewResponseRecord createReview(
            @Valid @RequestBody CreateReviewRecord request){

        return reviewService.createReview(request);
    }



    @GetMapping("/freelancer/{freelancerId}")
    public List<ReviewResponseRecord> getReviewsByFreelancer(
            @PathVariable Long freelancerId){

        return reviewService.getReviewsByFreelancer(freelancerId);
    }



    @GetMapping("/gig/{gigId}")
    public List<ReviewResponseRecord> getReviewsByGig(
            @PathVariable Long gigId){

        return reviewService.getReviewsByGig(gigId);
    }



    @GetMapping("/client/{clientId}")
    public List<ReviewResponseRecord> getReviewsByClient(
            @PathVariable Long clientId){

        return reviewService.getReviewsByClient(clientId);
    }



    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteReview(
            @PathVariable Long id){

        reviewService.deleteReview(id);
    }

}
