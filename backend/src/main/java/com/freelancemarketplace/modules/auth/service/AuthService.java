package com.freelancemarketplace.modules.auth.service;

import com.freelancemarketplace.modules.auth.record.AuthRequestRecord;
import com.freelancemarketplace.modules.auth.record.AuthResponseRecord;
import com.freelancemarketplace.modules.user.record.CreateUserRecord;

public interface AuthService {
	
	public AuthResponseRecord register(CreateUserRecord dto);
	
	public AuthResponseRecord login(AuthRequestRecord dto);

}
