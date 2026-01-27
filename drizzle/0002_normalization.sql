-- Migration: 3NF Normalization
-- 1. Create vehicle normalization tables
CREATE TABLE IF NOT EXISTS vehicle_brand (
    brand_id INT AUTO_INCREMENT PRIMARY KEY,
    brand_name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS vehicle_model (
    model_id INT AUTO_INCREMENT PRIMARY KEY,
    brand_id INT NOT NULL,
    model_name VARCHAR(50) NOT NULL,
    FOREIGN KEY (brand_id) REFERENCES vehicle_brand(brand_id),
    UNIQUE(brand_id, model_name)
);

-- 2. Populate vehicle normalization tables
INSERT IGNORE INTO vehicle_brand (brand_name)
SELECT DISTINCT brand FROM vehicle WHERE brand IS NOT NULL;

INSERT IGNORE INTO vehicle_model (brand_id, model_name)
SELECT DISTINCT b.brand_id, v.model 
FROM vehicle v
JOIN vehicle_brand b ON v.brand = b.brand_name
WHERE v.model IS NOT NULL;

-- 3. Columns were already added in partial run
-- ALTER TABLE vehicle ADD COLUMN brand_id INT, ADD COLUMN model_id INT;
-- ALTER TABLE vehicle ADD COLUMN category_id INT;

-- 4. Update vehicle table with IDs
UPDATE vehicle v
JOIN vehicle_brand b ON v.brand = b.brand_name
SET v.brand_id = b.brand_id;

UPDATE vehicle v
JOIN vehicle_model m ON v.model = m.model_name AND v.brand_id = m.brand_id
SET v.model_id = m.model_id;

UPDATE vehicle v
JOIN service_category sc ON v.service_category = sc.category_name
SET v.category_id = sc.category_id;

-- 5. User Normalization - Ensure 'users' table is the source of truth
-- (Assuming users table exists as defined in schema.ts)

-- Add name and phone to users table if not present (as per my plan to consolidate identity)
ALTER TABLE users ADD COLUMN name VARCHAR(100), ADD COLUMN phone VARCHAR(15);

-- Update users table with data from related tables
UPDATE users u
JOIN customer c ON u.related_id = c.customer_id AND u.role = 'customer'
SET u.name = c.full_name, u.phone = c.phone;

UPDATE users u
JOIN employee e ON u.related_id = e.employee_id AND u.role = 'employee'
SET u.name = e.name, u.phone = e.phone;

UPDATE users u
JOIN manager m ON u.related_id = m.manager_id AND u.role = 'manager'
SET u.name = m.name, u.phone = m.phone;

UPDATE users u
JOIN admin a ON u.related_id = a.admin_id AND u.role = 'admin'
SET u.name = a.name;

-- 6. Add constraints
ALTER TABLE vehicle ADD CONSTRAINT fk_vehicle_brand FOREIGN KEY (brand_id) REFERENCES vehicle_brand(brand_id);
ALTER TABLE vehicle ADD CONSTRAINT fk_vehicle_model FOREIGN KEY (model_id) REFERENCES vehicle_model(model_id);
ALTER TABLE vehicle ADD CONSTRAINT fk_vehicle_category FOREIGN KEY (category_id) REFERENCES service_category(category_id);
