-- ==============================================================================
-- FREELANCE MARKETPLACE - DATABASE INITIALIZATION SCRIPT
-- ==============================================================================
-- Automatically executed on first startup of the MySQL container.

-- 1. Create Isolated Databases for each Java Microservice
CREATE DATABASE IF NOT EXISTS freelance_auth_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS freelance_user_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS freelance_gig_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS freelance_order_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS freelance_wallet_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS freelance_review_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 2. Grant Privileges to Marketplace User on all service databases
GRANT ALL PRIVILEGES ON freelance_auth_db.* TO 'marketplace_user'@'%';
GRANT ALL PRIVILEGES ON freelance_user_db.* TO 'marketplace_user'@'%';
GRANT ALL PRIVILEGES ON freelance_gig_db.* TO 'marketplace_user'@'%';
GRANT ALL PRIVILEGES ON freelance_order_db.* TO 'marketplace_user'@'%';
GRANT ALL PRIVILEGES ON freelance_wallet_db.* TO 'marketplace_user'@'%';
GRANT ALL PRIVILEGES ON freelance_review_db.* TO 'marketplace_user'@'%';
FLUSH PRIVILEGES;

-- 3. Seed Default Service Categories into freelance_gig_db
USE freelance_gig_db;

CREATE TABLE IF NOT EXISTS categories (
    category_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(500),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT IGNORE INTO categories (category_id, category_name, description, is_active) VALUES
(1, 'Web Development', 'Full-stack web applications, frontend UI, backend APIs, and bug fixes', TRUE),
(2, 'Mobile App Development', 'Native Android, iOS, and cross-platform Flutter/React Native apps', TRUE),
(3, 'UI/UX Design', 'Figma prototypes, mobile & web UI design, wireframes, and design systems', TRUE),
(4, 'Graphic Design', 'Logos, branding kits, banners, posters, and digital illustrations', TRUE),
(5, 'Content Writing', 'Technical blogs, SEO copy, documentation, and creative articles', TRUE),
(6, 'Digital Marketing', 'Social media marketing, SEO optimization, and ad campaign management', TRUE),
(7, 'Video & Animation', 'Video editing, motion graphics, 2D/3D animation, and intro videos', TRUE);
