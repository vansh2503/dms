package com.dms.demo.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Value("${server.port:8080}")
    private String serverPort;

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Hyundai Dealer Management System API")
                        .version("1.0.0")
                        .description("""
                                Complete REST API for Hyundai Dealer Management System
                                
                                ## Features
                                - JWT-based authentication and authorization
                                - Vehicle inventory management
                                - Customer relationship management (CRM)
                                - Booking and sales transaction management
                                - Test drive scheduling
                                - Vehicle exchange/trade-in processing
                                - Accessories catalog and ordering
                                - Comprehensive reports and analytics
                                - 360-degree customer view
                                - CSV bulk import
                                
                                ## Authentication
                                All endpoints (except /api/auth/**) require JWT authentication.
                                1. Login via POST /api/auth/login to get JWT token
                                2. Click 'Authorize' button and enter: Bearer <your-token>
                                3. All subsequent requests will include the token
                                
                                ## Error Handling
                                All responses follow a standard ApiResponse<T> format:
                                - success: boolean
                                - message: string
                                - data: T (response payload)
                                - timestamp: ISO datetime
                                - errorCode: string (for errors)
                                """)
                        .contact(new Contact()
                                .name("Hyundai DMS Support")
                                .email("support@hyundai-dms.com")
                                .url("https://hyundai-dms.com"))
                        .license(new License()
                                .name("Proprietary")
                                .url("https://hyundai-dms.com/license")))
                .servers(List.of(
                        new Server()
                                .url("http://localhost:" + serverPort)
                                .description("Local Development Server"),
                        new Server()
                                .url("https://api.hyundai-dms.com")
                                .description("Production Server")
                ))
                .addSecurityItem(new SecurityRequirement().addList("Bearer Authentication"))
                .components(new Components()
                        .addSecuritySchemes("Bearer Authentication",
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .description("Enter JWT token obtained from /api/auth/login endpoint")));
    }
}
