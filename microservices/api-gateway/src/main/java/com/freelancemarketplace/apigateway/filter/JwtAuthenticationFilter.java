package com.freelancemarketplace.apigateway.filter;

import com.freelancemarketplace.apigateway.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter implements GlobalFilter, Ordered {

    private final JwtService jwtService;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        // Always allow CORS preflight requests
        if (HttpMethod.OPTIONS.equals(exchange.getRequest().getMethod())) {
            return chain.filter(exchange);
        }

        String authHeader = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
        String token = null;
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
        }

        // 1. Allow public endpoints to pass through without mandatory JWT
        if (isPublic(exchange) && token == null) {
            return chain.filter(exchange);
        }

        // 2. Check for Authorization header on protected endpoints
        if (token == null) {
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }

        // 3. Validate token signature and expiration
        if (!jwtService.validateToken(token)) {
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }

        // 4. Token is valid, extract claims and attach identity headers to downstream request
        try {
            io.jsonwebtoken.Claims claims = jwtService.extractAllClaims(token);
            Long userId = jwtService.extractUserId(claims);
            String role = jwtService.extractRole(claims);
            String email = jwtService.extractEmail(claims);
            String username = jwtService.extractUsername(claims);

            org.springframework.http.server.reactive.ServerHttpRequest.Builder requestBuilder = exchange.getRequest().mutate();
            if (userId != null) {
                requestBuilder.header("X-User-Id", String.valueOf(userId));
            }
            if (role != null) {
                requestBuilder.header("X-User-Role", role);
            }
            if (email != null) {
                requestBuilder.header("X-User-Email", email);
            }
            if (username != null) {
                requestBuilder.header("X-User-Name", username);
            }

            return chain.filter(exchange.mutate().request(requestBuilder.build()).build());
        } catch (Exception e) {
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }
    }

    private boolean isPublic(ServerWebExchange exchange) {
        String path = exchange.getRequest().getURI().getPath();
        HttpMethod method = exchange.getRequest().getMethod();

        if (path.startsWith("/auth/register") || path.startsWith("/auth/login") || path.startsWith("/actuator") || path.startsWith("/api/v1/ai")) {
            return true;
        }

        if (HttpMethod.GET.equals(method)) {
            if (path.startsWith("/categories") || path.startsWith("/reviews")) {
                return true;
            }
            if (path.equals("/gigs") || path.matches("^/gigs/\\d+$") || path.startsWith("/gigs/freelancer/")) {
                return true;
            }
            if (path.startsWith("/users/freelancers") || path.matches("^/users/profile/\\d+$")) {
                return true;
            }
        }

        return false;
    }

    @Override
    public int getOrder() {
        return -1;
    }
}
