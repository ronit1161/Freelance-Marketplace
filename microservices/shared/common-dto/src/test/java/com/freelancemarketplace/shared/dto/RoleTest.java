package com.freelancemarketplace.shared.dto;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class RoleTest {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    void testEnumValues() {
        assertEquals(Role.ROLE_CLIENT, Role.valueOf("ROLE_CLIENT"));
        assertEquals(Role.ROLE_FREELANCER, Role.valueOf("ROLE_FREELANCER"));
        assertEquals(Role.ROLE_ADMIN, Role.valueOf("ROLE_ADMIN"));
    }

    @Test
    void testJacksonDeserialization() throws Exception {
        String jsonFreelancer = "\"ROLE_FREELANCER\"";
        Role role1 = objectMapper.readValue(jsonFreelancer, Role.class);
        assertEquals(Role.ROLE_FREELANCER, role1);

        String jsonClient = "\"ROLE_CLIENT\"";
        Role role2 = objectMapper.readValue(jsonClient, Role.class);
        assertEquals(Role.ROLE_CLIENT, role2);

        String jsonAdmin = "\"ROLE_ADMIN\"";
        Role role3 = objectMapper.readValue(jsonAdmin, Role.class);
        assertEquals(Role.ROLE_ADMIN, role3);
    }
}
