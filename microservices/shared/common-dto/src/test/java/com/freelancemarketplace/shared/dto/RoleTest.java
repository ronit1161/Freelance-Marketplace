package com.freelancemarketplace.shared.dto;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class RoleTest {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    void testFromString() {
        assertEquals(Role.ROLE_CLIENT, Role.fromString("CLIENT"));
        assertEquals(Role.ROLE_CLIENT, Role.fromString("ROLE_CLIENT"));
        assertEquals(Role.ROLE_CLIENT, Role.fromString("client"));
        assertEquals(Role.ROLE_CLIENT, Role.fromString("role_client"));

        assertEquals(Role.ROLE_FREELANCER, Role.fromString("FREELANCER"));
        assertEquals(Role.ROLE_FREELANCER, Role.fromString("ROLE_FREELANCER"));
        assertEquals(Role.ROLE_FREELANCER, Role.fromString("freelancer"));

        assertEquals(Role.ROLE_ADMIN, Role.fromString("ADMIN"));
        assertEquals(Role.ROLE_ADMIN, Role.fromString("ROLE_ADMIN"));

        assertNull(Role.fromString(null));
        assertNull(Role.fromString("   "));

        assertThrows(IllegalArgumentException.class, () -> Role.fromString("UNKNOWN"));
    }

    @Test
    void testJacksonDeserialization() throws Exception {
        String jsonFreelancer = "\"FREELANCER\"";
        Role role1 = objectMapper.readValue(jsonFreelancer, Role.class);
        assertEquals(Role.ROLE_FREELANCER, role1);

        String jsonClient = "\"ROLE_CLIENT\"";
        Role role2 = objectMapper.readValue(jsonClient, Role.class);
        assertEquals(Role.ROLE_CLIENT, role2);

        String jsonLowercase = "\"freelancer\"";
        Role role3 = objectMapper.readValue(jsonLowercase, Role.class);
        assertEquals(Role.ROLE_FREELANCER, role3);
    }
}
