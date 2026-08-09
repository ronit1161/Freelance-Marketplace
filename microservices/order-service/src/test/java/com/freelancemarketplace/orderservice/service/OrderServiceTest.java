package com.freelancemarketplace.orderservice.service;

import com.freelancemarketplace.orderservice.client.GigClient;
import com.freelancemarketplace.orderservice.client.dto.GigResponse;
import com.freelancemarketplace.orderservice.dto.request.CreateOrderRequest;
import com.freelancemarketplace.orderservice.dto.response.OrderResponse;
import com.freelancemarketplace.orderservice.entity.Order;
import com.freelancemarketplace.orderservice.entity.OrderStatus;
import com.freelancemarketplace.orderservice.repository.OrderRepository;
import com.freelancemarketplace.orderservice.service.impl.OrderServiceImpl;
import com.freelancemarketplace.shared.dto.ApiResponse;
import com.freelancemarketplace.shared.exception.BadRequestException;
import com.freelancemarketplace.shared.exception.ForbiddenException;
import com.freelancemarketplace.shared.exception.ResourceNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private GigClient gigClient;

    @InjectMocks
    private OrderServiceImpl orderService;

    private GigResponse sampleGig;
    private Order sampleOrder;

    @BeforeEach
    void setUp() {
        sampleGig = GigResponse.builder()
                .id(10L)
                .freelancerId(200L)
                .title("Build Full Stack Spring Boot and React App")
                .description("Professional microservices application built with Spring Boot")
                .price(BigDecimal.valueOf(450.00))
                .deliveryDays(5)
                .thumbnailUrl("https://example.com/gig.png")
                .categoryId(1L)
                .categoryName("Web Development")
                .active(true)
                .build();

        sampleOrder = Order.builder()
                .id(1L)
                .clientId(100L)
                .freelancerId(200L)
                .gigId(10L)
                .agreedPrice(BigDecimal.valueOf(450.00))
                .requirements("Build backend microservices")
                .status(OrderStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    @Test
    @DisplayName("Client should successfully place an order with price & freelancerId populated from Gig Service")
    void createOrder_Client_Success() {
        CreateOrderRequest request = CreateOrderRequest.builder()
                .gigId(10L)
                .requirements("Build backend microservices")
                .build();

        when(gigClient.getGigById(10L)).thenReturn(ApiResponse.success(sampleGig));
        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> {
            Order o = invocation.getArgument(0);
            o.setId(1L);
            o.setCreatedAt(LocalDateTime.now());
            o.setUpdatedAt(LocalDateTime.now());
            return o;
        });

        OrderResponse response = orderService.createOrder(request, 100L, "ROLE_CLIENT");

        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(1L);
        assertThat(response.getClientId()).isEqualTo(100L);
        assertThat(response.getFreelancerId()).isEqualTo(200L);
        assertThat(response.getGigId()).isEqualTo(10L);
        assertThat(response.getAgreedPrice()).isEqualTo(BigDecimal.valueOf(450.00));
        assertThat(response.getStatus()).isEqualTo(OrderStatus.PENDING);

        verify(gigClient).getGigById(10L);
        verify(orderRepository).save(any(Order.class));
    }

    @Test
    @DisplayName("Freelancer should be forbidden from placing an order")
    void createOrder_FreelancerRole_ThrowsForbiddenException() {
        CreateOrderRequest request = CreateOrderRequest.builder()
                .gigId(10L)
                .requirements("Build backend")
                .build();

        assertThatThrownBy(() -> orderService.createOrder(request, 200L, "ROLE_FREELANCER"))
                .isInstanceOf(ForbiddenException.class)
                .hasMessageContaining("Only clients are permitted to create an order");

        verifyNoInteractions(gigClient);
        verifyNoInteractions(orderRepository);
    }

    @Test
    @DisplayName("Placing order when gig does not exist should throw ResourceNotFoundException")
    void createOrder_GigNotFound_ThrowsException() {
        CreateOrderRequest request = CreateOrderRequest.builder()
                .gigId(999L)
                .requirements("Build backend")
                .build();

        when(gigClient.getGigById(999L)).thenReturn(null);

        assertThatThrownBy(() -> orderService.createOrder(request, 100L, "ROLE_CLIENT"))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Gig not found with id: '999'");

        verify(orderRepository, never()).save(any());
    }

    @Test
    @DisplayName("Placing order when gig is inactive should throw BadRequestException")
    void createOrder_GigInactive_ThrowsException() {
        sampleGig.setActive(false);
        CreateOrderRequest request = CreateOrderRequest.builder()
                .gigId(10L)
                .requirements("Build backend")
                .build();

        when(gigClient.getGigById(10L)).thenReturn(ApiResponse.success(sampleGig));

        assertThatThrownBy(() -> orderService.createOrder(request, 100L, "ROLE_CLIENT"))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("Gig is not active and cannot be ordered");

        verify(orderRepository, never()).save(any());
    }

    @Test
    @DisplayName("Client attempting to order their own gig should throw BadRequestException")
    void createOrder_SelfOrder_ThrowsException() {
        // User 200 is the freelancer who created gig 10
        CreateOrderRequest request = CreateOrderRequest.builder()
                .gigId(10L)
                .requirements("Self order")
                .build();

        when(gigClient.getGigById(10L)).thenReturn(ApiResponse.success(sampleGig));

        assertThatThrownBy(() -> orderService.createOrder(request, 200L, "ROLE_CLIENT"))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("You cannot place an order on your own gig");

        verify(orderRepository, never()).save(any());
    }

    @Test
    @DisplayName("Client should successfully retrieve their own order")
    void getOrderById_ClientOwner_Success() {
        when(orderRepository.findById(1L)).thenReturn(Optional.of(sampleOrder));

        OrderResponse response = orderService.getOrderById(1L, 100L, "ROLE_CLIENT");

        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(1L);
        assertThat(response.getClientId()).isEqualTo(100L);
    }

    @Test
    @DisplayName("Assigned freelancer should successfully retrieve the order")
    void getOrderById_FreelancerOwner_Success() {
        when(orderRepository.findById(1L)).thenReturn(Optional.of(sampleOrder));

        OrderResponse response = orderService.getOrderById(1L, 200L, "ROLE_FREELANCER");

        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(1L);
        assertThat(response.getFreelancerId()).isEqualTo(200L);
    }

    @Test
    @DisplayName("Unauthorized user should be forbidden from accessing someone else's order")
    void getOrderById_UnauthorizedUser_ThrowsForbiddenException() {
        when(orderRepository.findById(1L)).thenReturn(Optional.of(sampleOrder));

        // User 300 is neither client (100) nor freelancer (200)
        assertThatThrownBy(() -> orderService.getOrderById(1L, 300L, "ROLE_CLIENT"))
                .isInstanceOf(ForbiddenException.class)
                .hasMessageContaining("You do not have permission to view this order");
    }

    @Test
    @DisplayName("Client should retrieve list of their placed orders")
    void getMyOrders_Client_Success() {
        when(orderRepository.findByClientIdOrderByCreatedAtDesc(100L)).thenReturn(List.of(sampleOrder));

        List<OrderResponse> orders = orderService.getMyOrders(100L, "ROLE_CLIENT");

        assertThat(orders).hasSize(1);
        assertThat(orders.get(0).getClientId()).isEqualTo(100L);
    }

    @Test
    @DisplayName("Freelancer should retrieve list of orders assigned to them")
    void getMyOrders_Freelancer_Success() {
        when(orderRepository.findByFreelancerIdOrderByCreatedAtDesc(200L)).thenReturn(List.of(sampleOrder));

        List<OrderResponse> orders = orderService.getMyOrders(200L, "ROLE_FREELANCER");

        assertThat(orders).hasSize(1);
        assertThat(orders.get(0).getFreelancerId()).isEqualTo(200L);
    }

    @Test
    @DisplayName("Assigned freelancer should successfully accept a PENDING order")
    void acceptOrder_Success() {
        when(orderRepository.findById(1L)).thenReturn(Optional.of(sampleOrder));
        when(orderRepository.save(any(Order.class))).thenReturn(sampleOrder);

        OrderResponse response = orderService.acceptOrder(1L, 200L, "ROLE_FREELANCER");

        assertThat(response).isNotNull();
        assertThat(sampleOrder.getStatus()).isEqualTo(OrderStatus.ACCEPTED);
        verify(orderRepository).save(sampleOrder);
    }

    @Test
    @DisplayName("Accepting order that is not PENDING should throw BadRequestException")
    void acceptOrder_InvalidStatus_ThrowsException() {
        sampleOrder.setStatus(OrderStatus.IN_PROGRESS);
        when(orderRepository.findById(1L)).thenReturn(Optional.of(sampleOrder));

        assertThatThrownBy(() -> orderService.acceptOrder(1L, 200L, "ROLE_FREELANCER"))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("Only PENDING orders can be accepted");

        verify(orderRepository, never()).save(any());
    }

    @Test
    @DisplayName("Assigned freelancer should successfully start work on an ACCEPTED order")
    void startOrder_Success() {
        sampleOrder.setStatus(OrderStatus.ACCEPTED);
        when(orderRepository.findById(1L)).thenReturn(Optional.of(sampleOrder));
        when(orderRepository.save(any(Order.class))).thenReturn(sampleOrder);

        OrderResponse response = orderService.startOrder(1L, 200L, "ROLE_FREELANCER");

        assertThat(response).isNotNull();
        assertThat(sampleOrder.getStatus()).isEqualTo(OrderStatus.IN_PROGRESS);
        verify(orderRepository).save(sampleOrder);
    }

    @Test
    @DisplayName("Assigned freelancer should successfully mark an IN_PROGRESS order as COMPLETED")
    void completeOrder_Success() {
        sampleOrder.setStatus(OrderStatus.IN_PROGRESS);
        when(orderRepository.findById(1L)).thenReturn(Optional.of(sampleOrder));
        when(orderRepository.save(any(Order.class))).thenReturn(sampleOrder);

        OrderResponse response = orderService.completeOrder(1L, 200L, "ROLE_FREELANCER");

        assertThat(response).isNotNull();
        assertThat(sampleOrder.getStatus()).isEqualTo(OrderStatus.COMPLETED);
        verify(orderRepository).save(sampleOrder);
    }

    @Test
    @DisplayName("Client or freelancer should successfully cancel an order")
    void cancelOrder_Success() {
        sampleOrder.setStatus(OrderStatus.PENDING);
        when(orderRepository.findById(1L)).thenReturn(Optional.of(sampleOrder));
        when(orderRepository.save(any(Order.class))).thenReturn(sampleOrder);

        OrderResponse response = orderService.cancelOrder(1L, 100L, "ROLE_CLIENT");

        assertThat(response).isNotNull();
        assertThat(sampleOrder.getStatus()).isEqualTo(OrderStatus.CANCELLED);
        verify(orderRepository).save(sampleOrder);
    }

    @Test
    @DisplayName("Admin should successfully view any order")
    void getOrderById_Admin_Success() {
        when(orderRepository.findById(1L)).thenReturn(Optional.of(sampleOrder));

        OrderResponse response = orderService.getOrderById(1L, 999L, "ROLE_ADMIN");

        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(1L);
    }

    @Test
    @DisplayName("Admin should retrieve all orders")
    void getMyOrders_Admin_Success() {
        when(orderRepository.findAll()).thenReturn(List.of(sampleOrder));

        List<OrderResponse> orders = orderService.getMyOrders(999L, "ROLE_ADMIN");

        assertThat(orders).hasSize(1);
    }

    @Test
    @DisplayName("Attempting to cancel an already COMPLETED order should throw BadRequestException")
    void cancelOrder_AlreadyCompleted_ThrowsException() {
        sampleOrder.setStatus(OrderStatus.COMPLETED);
        when(orderRepository.findById(1L)).thenReturn(Optional.of(sampleOrder));

        assertThatThrownBy(() -> orderService.cancelOrder(1L, 100L, "ROLE_CLIENT"))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("Cannot cancel an order that is already COMPLETED");

        verify(orderRepository, never()).save(any());
    }
}
