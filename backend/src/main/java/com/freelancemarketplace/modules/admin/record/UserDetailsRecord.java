package com.freelancemarketplace.modules.admin.record;

import com.freelancemarketplace.enums.UserRoles;

public record UserDetailsRecord(
		Long id,
		String userName,
		String email,
		String fullName,
		UserRoles role,
		boolean isBlocked
// wallet id and wallet balance remaining to be added - future scope

) {
}
