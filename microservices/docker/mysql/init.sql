-- ==============================================================================
-- FREELANCE MARKETPLACE - MICROSERVICES INITIALIZATION SCRIPT (PLACEHOLDER)
-- ==============================================================================
-- This script will create independent databases for each microservice during
-- the upcoming microservices migration phase.

CREATE DATABASE IF NOT EXISTS freelance_auth_db;
CREATE DATABASE IF NOT EXISTS freelance_user_db;
CREATE DATABASE IF NOT EXISTS freelance_gig_db;
CREATE DATABASE IF NOT EXISTS freelance_order_db;
CREATE DATABASE IF NOT EXISTS freelance_wallet_db;
CREATE DATABASE IF NOT EXISTS freelance_review_db;
CREATE DATABASE IF NOT EXISTS freelance_notification_db;

-- Grant permissions to marketplace user
-- GRANT ALL PRIVILEGES ON freelance_*.* TO 'marketplace_user'@'%';
-- FLUSH PRIVILEGES;
