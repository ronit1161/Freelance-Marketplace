package com.freelancemarketplace.modules.admin.record;

import java.time.LocalDate;
import com.freelancemarketplace.enums.UserRoles;

public record UserSummaryRecord(
		Long id,
		String userName,
		String email,
		String fullName,
		String profileAvatarURL,
		UserRoles role,
		boolean isActive,
		boolean isBlocked,
		LocalDate createdOn) {
}
