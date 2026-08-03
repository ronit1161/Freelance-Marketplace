package com.freelancemarketplace.modules.admin.record;

import com.freelancemarketplace.enums.UserRoles;

public record UserDetailsRecord(
		Long id,
		String userName,
		String email,
		String fullName,
		String profileAvatarURL,
		UserRoles role,
		boolean isBlocked
// wallet id and wallet balance remaining to be added - future scope

) {
}
