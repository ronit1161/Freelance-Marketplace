package com.freelancemarketplace.modules.gigs.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.freelancemarketplace.modules.admin.record.GigSummaryRecord;
import com.freelancemarketplace.modules.gigs.entity.Gigs;

@Mapper(componentModel = "spring")
public interface GigMapperAdmin {

    @Mapping(source = "freelancer.fullName", target = "freelancerName")
    @Mapping(source = "category.categoryName", target = "categoryName")
    GigSummaryRecord toSummary(Gigs gig);

    List<GigSummaryRecord> toSummaryList(List<Gigs> gigs);
}
