-- Thêm cột price
ALTER TABLE cart_items ADD COLUMN price DECIMAL(10, 2) NOT NULL DEFAULT 0.00;

-- Thêm cột material
ALTER TABLE cart_items ADD COLUMN material VARCHAR(255);

-- Thêm cột color
ALTER TABLE cart_items ADD COLUMN color VARCHAR(255);