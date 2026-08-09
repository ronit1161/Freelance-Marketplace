package com.freelancemarketplace.apigateway.filter;

import com.freelancemarketplace.apigateway.security.JwtService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.mock.http.server.reactive.MockServerHttpRequest;
import org.springframework.mock.web.server.MockServerWebExchange;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class JwtAuthenticationFilterTest {

    @Mock
    private JwtService jwtService;

    @Mock
    private GatewayFilterChain filterChain;

    @InjectMocks
    private JwtAuthenticationFilter filter;

    @Test
    @DisplayName("Public endpoint /auth/register should bypass JWT validation")
    void filter_PublicEndpoint_Register_BypassesJwt() {
        when(filterChain.filter(any(ServerWebExchange.class))).thenReturn(Mono.empty());

        MockServerHttpRequest request = MockServerHttpRequest.post("/auth/register").build();
        MockServerWebExchange exchange = MockServerWebExchange.from(request);

        filter.filter(exchange, filterChain).block();

        verify(filterChain).filter(exchange);
        verifyNoInteractions(jwtService);
    }

    @Test
    @DisplayName("Public endpoint /auth/login should bypass JWT validation")
    void filter_PublicEndpoint_Login_BypassesJwt() {
        when(filterChain.filter(any(ServerWebExchange.class))).thenReturn(Mono.empty());

        MockServerHttpRequest request = MockServerHttpRequest.post("/auth/login").build();
        MockServerWebExchange exchange = MockServerWebExchange.from(request);

        filter.filter(exchange, filterChain).block();

        verify(filterChain).filter(exchange);
        verifyNoInteractions(jwtService);
    }

    @Test
    @DisplayName("Protected endpoint /users/profile without Authorization header should return 401")
    void filter_ProtectedEndpoint_MissingAuthHeader_Returns401() {
        MockServerHttpRequest request = MockServerHttpRequest.get("/users/profile").build();
        MockServerWebExchange exchange = MockServerWebExchange.from(request);

        filter.filter(exchange, filterChain).block();

        assertThat(exchange.getResponse().getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
        verify(filterChain, never()).filter(any(ServerWebExchange.class));
    }

    @Test
    @DisplayName("Protected endpoint with invalid JWT should return 401")
    void filter_ProtectedEndpoint_InvalidJwt_Returns401() {
        MockServerHttpRequest request = MockServerHttpRequest.get("/users/profile")
                .header(HttpHeaders.AUTHORIZATION, "Bearer invalid.jwt.token")
                .build();
        MockServerWebExchange exchange = MockServerWebExchange.from(request);

        when(jwtService.validateToken("invalid.jwt.token")).thenReturn(false);

        filter.filter(exchange, filterChain).block();

        assertThat(exchange.getResponse().getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
        verify(filterChain, never()).filter(any(ServerWebExchange.class));
    }

    @Test
    @DisplayName("Protected endpoint with valid JWT should forward request downstream with identity headers")
    void filter_ProtectedEndpoint_ValidJwt_ForwardsDownstream() {
        when(filterChain.filter(any(ServerWebExchange.class))).thenReturn(Mono.empty());

        String token = "valid.jwt.token";
        MockServerHttpRequest request = MockServerHttpRequest.get("/users/profile")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                .build();
        MockServerWebExchange exchange = MockServerWebExchange.from(request);

        io.jsonwebtoken.Claims mockClaims = mock(io.jsonwebtoken.Claims.class);
        when(jwtService.validateToken(token)).thenReturn(true);
        when(jwtService.extractAllClaims(token)).thenReturn(mockClaims);
        when(jwtService.extractUserId(mockClaims)).thenReturn(100L);
        when(jwtService.extractRole(mockClaims)).thenReturn("ROLE_CLIENT");
        when(jwtService.extractEmail(mockClaims)).thenReturn("client@example.com");
        when(jwtService.extractUsername(mockClaims)).thenReturn("client_user");

        filter.filter(exchange, filterChain).block();

        verify(filterChain).filter(argThat(ex -> {
            String userId = ex.getRequest().getHeaders().getFirst("X-User-Id");
            String userRole = ex.getRequest().getHeaders().getFirst("X-User-Role");
            return "100".equals(userId) && "ROLE_CLIENT".equals(userRole);
        }));
    }
}
