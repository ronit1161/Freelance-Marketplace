package enums;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum UserRoles {
	ADMIN,CLIENT,FREELANCER;
	@JsonCreator
    public static UserRoles fromString(String value) {
        if (value == null) return null;
        for (UserRoles role : UserRoles.values()) {
            if (role.name().equalsIgnoreCase(value)) {
                return role;
            }
        }
        throw new IllegalArgumentException("Invalid role: " + value);
    }
}
