package modules.user.record;

import java.time.LocalDateTime;

import enums.UserRoles;

public record UserResponseRecord(
		Long id,
	    String userName,
	    String email,
	    String fullName,
	    String profileAvatarURL,
	    UserRoles role,
	    String bioData,
	    boolean isActive,
	    boolean isVerified,
	    Long walletId,
	    LocalDateTime createdOn
	    )
{}
