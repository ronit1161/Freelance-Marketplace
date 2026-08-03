package com.freelancemarketplace.modules.admin.record;

public record CategoryRecord(
		Long id,
		String categoryName,
		long ongoingGigsCount
	) {
}
