package com.freelancemarketplace.apigateway.filter;

import com.freelancemarketplace.apigateway.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import org.springframework.http.HttpMethod;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter implements GlobalFilter, Ordered {

    private final JwtService jwtService;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        // 1. Allow public endpoints to pass through without mandatory JWT
        if (isPublic(exchange)) {
            return chain.filter(exchange);
        }

        // 2. Check for Authorization header on protected endpoints
        String authHeader = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }

        String token = authHeader.substring(7);

        // 3. Validate token signature and expiration
        if (!jwtService.validateToken(token)) {
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }

        // 4. Token is valid, forward request to downstream service
        return chain.filter(exchange);
    }

    private boolean isPublic(ServerWebExchange exchange) {
        String path = exchange.getRequest().getURI().getPath();
        HttpMethod method = exchange.getRequest().getMethod();

        if (path.startsWith("/auth/register") || path.startsWith("/auth/login") || path.startsWith("/actuator")) {
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
