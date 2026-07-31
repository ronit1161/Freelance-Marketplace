package com.freelancemarketplace.modules.auth.record;

import com.freelancemarketplace.modules.user.record.UserResponseRecord;

public record AuthResponseRecord(
    String token,
    UserResponseRecord user
) {}
