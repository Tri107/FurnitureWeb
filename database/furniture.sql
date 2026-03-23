CREATE DATABASE furniture;

USE furniture;

DROP DATABASE furniture;

-- tables
CREATE Table categories (
    category_id INT PRIMARY KEY AUTO_INCREMENT,
    category_name VARCHAR(100) NOT NULL UNIQUE,
    is_disabled BOOLEAN DEFAULT FALSE
);

CREATE Table brands (
    brand_id INT PRIMARY KEY AUTO_INCREMENT,
    brand_name VARCHAR(100) NOT NULL UNIQUE,
    is_disabled BOOLEAN DEFAULT FALSE
);

CREATE Table collections (
    collection_id INT PRIMARY KEY AUTO_INCREMENT,
    collection_name VARCHAR(100) NOT NULL UNIQUE,
    is_disabled BOOLEAN DEFAULT FALSE
);

CREATE Table products (
    product_id INT PRIMARY KEY AUTO_INCREMENT,
    product_name VARCHAR(100) NOT NULL,
    product_description TEXT,
    product_status ENUM(
        'AVAILABLE',
        'RESERVED',
        'SOLD'
    ) DEFAULT 'AVAILABLE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_disabled BOOLEAN DEFAULT FALSE,
    category_id INT NOT NULL,
    brand_id INT NOT NULL,
    collection_id INT NOT NULL,
    variant_ref VARCHAR(50) NOT NULL UNIQUE,
    FOREIGN KEY (category_id) REFERENCES categories (category_id),
    FOREIGN KEY (brand_id) REFERENCES brands (brand_id),
    FOREIGN KEY (collection_id) REFERENCES collections (collection_id)
);

CREATE Table accounts (
    account_id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_admin BOOLEAN DEFAULT FALSE,
    is_disabled BOOLEAN DEFAULT FALSE,
    refresh_token TEXT
);

CREATE Table user_profiles (
    profile_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    phone_number VARCHAR(15),
    user_address TEXT,
    account_id INT NOT NULL,
    FOREIGN KEY (account_id) REFERENCES accounts (account_id)
);

CREATE Table discounts (
    discount_id INT PRIMARY KEY AUTO_INCREMENT,
    discount_code VARCHAR(50) NOT NULL UNIQUE,
    discount_percentage INT NOT NULL,
    valid_from DATE NOT NULL,
    valid_to DATE NOT NULL,
    discount_description TEXT,
    is_disabled BOOLEAN DEFAULT FALSE,
    CHECK (
        discount_percentage > 0
        AND discount_percentage <= 100
    ),
    CHECK (valid_to > valid_from)
);

CREATE Table orders (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    order_status ENUM(
        'PENDING',
        'SHIPPED',
        'DELIVERED',
        'CANCELLED'
    ) DEFAULT 'PENDING',
    total_price DECIMAL(10, 3) NOT NULL,
    account_id INT NOT NULL,
    FOREIGN KEY (account_id) REFERENCES accounts (account_id)
);

CREATE Table order_items (
    order_item_id INT PRIMARY KEY AUTO_INCREMENT,
    quantity INT NOT NULL CHECK (quantity > 0),
    product_id INT NOT NULL,
    variant_snapshot JSON NOT NULL,
    order_id INT NOT NULL,
    discount_id INT,
    FOREIGN KEY (order_id) REFERENCES orders (order_id),
    FOREIGN KEY (discount_id) REFERENCES discounts (discount_id)
);

CREATE Table payments (
    payment_id INT PRIMARY KEY AUTO_INCREMENT,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    payment_method ENUM('COD', 'BANK TRANSFER') NOT NULL,
    order_id INT NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders (order_id)
);

CREATE Table reviews (
    review_id INT PRIMARY KEY AUTO_INCREMENT,
    rating TINYINT CHECK (
        rating >= 1
        AND rating <= 5
    ),
    review_comment TEXT,
    review_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    product_id INT NOT NULL,
    account_id INT NOT NULL,
    UNIQUE (product_id, account_id),
    FOREIGN KEY (product_id) REFERENCES products (product_id),
    FOREIGN KEY (account_id) REFERENCES accounts (account_id)
);

CREATE Table favorites (
    account_id INT NOT NULL,
    product_id INT NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (account_id, product_id),
    FOREIGN KEY (account_id) REFERENCES accounts (account_id),
    FOREIGN KEY (product_id) REFERENCES products (product_id)
);

CREATE TABLE cart_items (
    cart_item_id INT PRIMARY KEY AUTO_INCREMENT,

    account_id INT NOT NULL,
    product_id INT NOT NULL,

    quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),

    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE (account_id, product_id),

    FOREIGN KEY (account_id) REFERENCES accounts (account_id)
        ON DELETE CASCADE,

    FOREIGN KEY (product_id) REFERENCES products (product_id)
        ON DELETE CASCADE
);

--data insertion
INSERT INTO
    categories (category_name)
VALUES ('Bàn'),
    ('Ghế'),
    ('Tủ');

INSERT INTO
    brands (brand_name)
VALUES ('Nội Thất Hòa Phát'),
    ('Nội Thất An Cường'),
    ('Nội Thất Minh Long');

INSERT INTO
    collections (collection_name)
VALUES ('Modern'),
    ('Classic'),
    ('Minimal');

INSERT INTO
    products (
        product_name,
        product_description,
        category_id,
        brand_id,
        collection_id,
        variant_ref
    )
VALUES (
        'Bàn gỗ ABC',
        'Bàn gỗ tự nhiên, phù hợp phòng khách và phòng làm việc',
        1,
        1,
        1,
        'VAR-TABLE-ABC'
    ),
    (
        'Ghế sofa XYZ',
        'Ghế sofa bọc nỉ cao cấp, êm ái',
        2,
        2,
        2,
        'VAR-SOFA-XYZ'
    ),
    (
        'Tủ quần áo MNO',
        'Tủ quần áo gỗ MDF chống ẩm',
        3,
        3,
        3,
        'VAR-CABINET-MNO'
    );

INSERT INTO
    accounts (
        email,
        password_hash,
        is_admin
    )
VALUES (
        'admin@shop.com',
        '$2a$10$adminhash',
        TRUE
    ),
    (
        'user1@gmail.com',
        '$2a$10$user1hash',
        FALSE
    ),
    (
        'user2@gmail.com',
        '$2a$10$user2hash',
        FALSE
    );

INSERT INTO
    user_profiles (
        username,
        phone_number,
        user_address,
        account_id
    )
VALUES (
        'admin',
        '0900000000',
        'Hà Nội',
        1
    ),
    (
        'user_one',
        '0911111111',
        'TP.HCM',
        2
    ),
    (
        'user_two',
        '0922222222',
        'Đà Nẵng',
        3
    );

INSERT INTO
    discounts (
        discount_code,
        discount_percentage,
        valid_from,
        valid_to,
        discount_description
    )
VALUES (
        'SALE10',
        10,
        '2025-01-01',
        '2025-12-31',
        'Giảm giá 10% toàn bộ sản phẩm'
    ),
    (
        'SALE20',
        20,
        '2025-06-01',
        '2025-06-30',
        'Khuyến mãi tháng 6'
    );

INSERT INTO
    orders (total_price, account_id)
VALUES (2400000.000, 2),
    (1800000.000, 3);

INSERT INTO
    order_items (
        quantity,
        product_id,
        variant_snapshot,
        order_id,
        discount_id
    )
VALUES (
        2,
        1,
        JSON_OBJECT(
            'option_id',
            'OPT-TABLE-RED-L',
            'color',
            'Red',
            'size',
            'L',
            'price',
            1200000
        ),
        1,
        1
    ),
    (
        1,
        2,
        JSON_OBJECT(
            'option_id',
            'OPT-SOFA-GRAY-M',
            'color',
            'Gray',
            'size',
            'M',
            'price',
            1800000
        ),
        2,
        NULL
    );

INSERT INTO
    payments (payment_method, order_id)
VALUES ('COD', 1),
    ('Bank Transfer', 2);

INSERT INTO
    reviews (
        rating,
        review_comment,
        product_id,
        account_id
    )
VALUES (
        5,
        'Bàn rất chắc chắn, đúng mô tả',
        1,
        2
    ),
    (
        4,
        'Ghế ngồi êm, giao hàng nhanh',
        2,
        3
    );

INSERT INTO
    favorites (account_id, product_id)
VALUES (2, 1),
    (2, 2),
    (3, 3);

-- views
--view all products for admin
CREATE VIEW view_all_products AS
SELECT p.product_id, p.product_name, p.product_status, p.created_at, p.is_disabled, p.variant_ref, c.category_name, b.brand_name, col.collection_name
FROM
    products p
    JOIN categories c ON p.category_id = c.category_id
    JOIN brands b ON p.brand_id = b.brand_id
    JOIN collections col ON p.collection_id = col.collection_id;

--view active products for customers
CREATE VIEW view_active_products AS
SELECT
    p.product_id,
    p.product_name,
    p.product_description,
    p.product_status,
    p.variant_ref,
    c.category_name,
    b.brand_name,
    col.collection_name,
    ROUND(AVG(r.rating)) AS average_rating,
    COUNT(r.review_id) AS review_count
FROM
    products p
    JOIN categories c ON p.category_id = c.category_id
    JOIN brands b ON p.brand_id = b.brand_id
    JOIN collections col ON p.collection_id = col.collection_id
    JOIN reviews r ON p.product_id = r.product_id
WHERE
    p.is_disabled = FALSE
GROUP BY
    p.product_id,
    p.product_name,
    p.product_description,
    p.product_status,
    p.variant_ref,
    c.category_name,
    b.brand_name,
    col.collection_name;

--view all accounts for admin
CREATE VIEW view_all_accounts AS
SELECT a.account_id, a.email, a.is_admin, a.is_disabled, a.created_at, up.username, up.phone_number, up.user_address
FROM accounts a
    LEFT JOIN user_profiles up ON a.account_id = up.account_id;

--view product details from customer
CREATE VIEW view_active_product_details AS
SELECT p.product_id, p.product_name, p.product_description, p.product_status, c.category_name, b.brand_name, col.collection_name, p.variant_ref
FROM
    products p
    JOIN categories c ON p.category_id = c.category_id
    JOIN brands b ON p.brand_id = b.brand_id
    JOIN collections col ON p.collection_id = col.collection_id
WHERE
    p.is_disabled = FALSE;

-- view all comments for customer by product id
CREATE VIEW view_product_comments AS
SELECT r.rating, r.review_comment, r.review_date, up.username, p.product_id
FROM
    reviews r
    JOIN accounts a ON r.account_id = a.account_id
    JOIN user_profiles up ON a.account_id = up.account_id
    JOIN products p ON r.product_id = p.product_id
WHERE
    p.is_disabled = FALSE
    AND a.is_disabled = FALSE;

--view all orders for admin
CREATE VIEW view_all_orders AS
SELECT o.order_id, o.order_date, o.order_status, o.total_price, a.email AS customer_email
FROM orders o
    JOIN accounts a ON o.account_id = a.account_id;

--view customer orders by account id
CREATE VIEW view_customer_orders AS
SELECT o.order_id, o.order_date, o.order_status, o.total_price, a.account_id
FROM orders o
    JOIN accounts a ON o.account_id = a.account_id;

-- view order items with product details for admin and customers
CREATE VIEW view_order_items AS
SELECT p.product_name, p.product_id, oi.quantity, oi.variant_snapshot, d.discount_code, oi.order_id, o.order_status, a.email, a.account_id
FROM
    order_items oi
    JOIN products p ON oi.product_id = p.product_id
    JOIN orders o ON oi.order_id = o.order_id
    JOIN accounts a ON o.account_id = a.account_id
    LEFT JOIN discounts d ON oi.discount_id = d.discount_id;

--view all discounts for admin
CREATE VIEW view_all_discounts AS SELECT * FROM discounts;

--view active discounts for customers
CREATE VIEW view_active_discounts AS
SELECT *
FROM discounts
WHERE
    is_disabled = FALSE;

--view favorite products by customer id
CREATE VIEW view_favorite_products AS
SELECT f.product_id, f.added_at, p.product_name, p.variant_ref
FROM favorites f
    JOIN products p ON f.product_id = p.product_id
WHERE
    p.is_disabled = FALSE;

DELIMITER //
-- functions
--funcition validate reference constraint
CREATE FUNCTION is_valid_entity (
    p_id INT,
    p_entity VARCHAR(20)
)
RETURNS BOOLEAN
DETERMINISTIC
BEGIN
    RETURN CASE p_entity
        WHEN 'category' THEN EXISTS (
            SELECT 1 FROM categories
            WHERE category_id = p_id
              AND is_disabled = FALSE
        )
        WHEN 'brand' THEN EXISTS (
            SELECT 1 FROM brands
            WHERE brand_id = p_id
              AND is_disabled = FALSE
        )
        WHEN 'collection' THEN EXISTS (
            SELECT 1 FROM collections
            WHERE collection_id = p_id
              AND is_disabled = FALSE
        )
        ELSE FALSE
    END;
END 

-- stored procedures
--procedure to add a new product
CREATE PROCEDURE add_new_product (
    IN p_name VARCHAR(100),
    IN p_description TEXT,
    IN p_category_id INT,
    IN p_brand_id INT,
    IN p_collection_id INT,
    IN p_variant_ref VARCHAR(50)
) 
BEGIN 
    IF p_variant_ref IS NULL
    OR p_variant_ref = '' THEN SIGNAL SQLSTATE '45000'
    SET
        MESSAGE_TEXT = 'Variant_ref cannot be empty';
    END IF;

    IF NOT is_valid_entity(p_category_id, 'category') THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Invalid or disabled category';
    END IF;

    IF NOT is_valid_entity(p_brand_id, 'brand') THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Invalid or disabled brand';
    END IF;

    IF NOT is_valid_entity(p_collection_id, 'collection') THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Invalid or disabled collection';
    END IF;

INSERT INTO
    products (
        product_name,
        product_description,
        category_id,
        brand_id,
        collection_id,
        variant_ref
    )
VALUES
    (
        p_name,
        COALESCE(p_description, 'No description available'),
        p_category_id,
        p_brand_id,
        p_collection_id,
        p_variant_ref
    );

END


-- procedure to update product
CREATE PROCEDURE update_product (
    IN p_product_id INT,
    IN p_name VARCHAR(100),
    IN p_description TEXT,
    IN p_product_status ENUM('AVAILABLE', 'RESERVED', 'SOLD'),
    IN p_is_disabled BOOLEAN,
    IN p_category_id INT,
    IN p_brand_id INT,
    IN p_collection_id INT,
    IN p_variant_ref VARCHAR(50)
)
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM products
        WHERE product_id = p_product_id
    ) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Product not found';
    END IF;

    IF p_variant_ref IS NULL OR p_variant_ref = '' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Variant_ref cannot be empty';
    END IF;

    IF NOT is_valid_entity(p_category_id, 'category') OR p_category_id IS NOT NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Invalid or disabled category';
    END IF;

    IF NOT is_valid_entity(p_brand_id, 'brand') OR p_brand_id IS NOT NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Invalid or disabled brand';
    END IF;

    IF NOT is_valid_entity(p_collection_id, 'collection') OR p_collection_id IS NOT NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Invalid or disabled collection';
    END IF;

    -- Update product
    UPDATE products
    SET
        product_name        = COALESCE(p_name, product_name),
        product_description = COALESCE(p_description, product_description),
        product_status      = COALESCE(p_product_status, product_status),
        is_disabled         = COALESCE(p_is_disabled, is_disabled),
        category_id         = COALESCE(p_category_id, category_id),
        brand_id            = COALESCE(p_brand_id, brand_id),
        collection_id       = COALESCE(p_collection_id, collection_id),
        variant_ref         = COALESCE(p_variant_ref, variant_ref)
    WHERE product_id = p_product_id;

END


-- procedure to delete a product
CREATE PROCEDURE delete_product (
    IN p_product_id INT
)
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM products
        WHERE product_id = p_product_id
          AND is_disabled = FALSE
    ) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Product not found or disabled';
    END IF;

    DELETE FROM products
    WHERE product_id = p_product_id;

END


--procedure to add category, brand, collection
CREATE PROCEDURE add_entity (
    IN p_table_name   VARCHAR(64),
    IN p_name_column  VARCHAR(64),
    IN p_name_value   VARCHAR(100)
)
BEGIN
    DECLARE sql_stmt TEXT;

    -- Validate name
    IF p_name_value IS NULL OR p_name_value = '' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Name cannot be empty';
    END IF;

    SET sql_stmt = CONCAT(
        'INSERT INTO ',
        p_table_name,
        ' (', p_name_column, ') VALUES (?)'
    );

    PREPARE stmt FROM @sql_stmt;
    EXECUTE stmt USING @p_name_value;
    DEALLOCATE PREPARE stmt;
END


--procedure to update category, brand, collection
CREATE PROCEDURE update_entity (
    IN p_table_name        VARCHAR(64),
    IN p_id_column         VARCHAR(64),
    IN p_id_value          INT,
    IN p_name_column       VARCHAR(64),
    IN p_name_value        VARCHAR(100),
    IN p_toggle_is_disabled BOOLEAN
)
BEGIN
    DECLARE sql_stmt TEXT;

    IF p_name_value IS NOT NULL AND p_name_value = '' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Name cannot be empty';
    END IF;

    SET sql_stmt = CONCAT(
        'UPDATE ', p_table_name, ' SET '
    );

    IF p_name_value IS NOT NULL THEN
        SET sql_stmt = CONCAT(
            sql_stmt,
            p_name_column, ' = ?, '
        );
    END IF;

    IF p_toggle_is_disabled IS NOT NULL THEN
        SET sql_stmt = CONCAT(
            sql_stmt,
            'is_disabled = ?, '
        );
    END IF;

    SET sql_stmt = LEFT(sql_stmt, LENGTH(sql_stmt) - 2);

    SET sql_stmt = CONCAT(
        sql_stmt,
        ' WHERE ', p_id_column, ' = ?'
    );

    PREPARE stmt FROM @sql_stmt;

    IF p_name_value IS NOT NULL AND p_toggle_is_disabled IS NOT NULL THEN
        EXECUTE stmt USING @p_name_value, @p_toggle_is_disabled, @p_id_value;
    ELSEIF p_name_value IS NOT NULL THEN
        EXECUTE stmt USING @p_name_value, @p_id_value;
    ELSE
        EXECUTE stmt USING @p_toggle_is_disabled, @p_id_value;
    END IF;

    DEALLOCATE PREPARE stmt;
END


--procedure to delete category, brand, collection
CREATE PROCEDURE delete_entity (
    IN p_table_name     VARCHAR(64),
    IN p_id_column      VARCHAR(64),
    IN p_id_value       INT,
    IN p_product_column VARCHAR(64)
)
BEGIN
    DECLARE ref_count INT;
    DECLARE sql_check TEXT;
    DECLARE sql_delete TEXT;

    SET sql_check = CONCAT(
        'SELECT COUNT(*) INTO @ref_count FROM products WHERE ',
        p_product_column,
        ' = ?'
    );

    PREPARE stmt_check FROM @sql_check;
    EXECUTE stmt_check USING @p_id_value;
    DEALLOCATE PREPARE stmt_check;

    SET ref_count = @ref_count;

    IF ref_count > 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Cannot delete: entity is referenced by products';
    END IF;

    SET sql_delete = CONCAT(
        'DELETE FROM ',
        p_table_name,
        ' WHERE ',
        p_id_column,
        ' = ? AND is_disabled = TRUE'
    );

    PREPARE stmt_delete FROM @sql_delete;
    EXECUTE stmt_delete USING @p_id_value;
    DEALLOCATE PREPARE stmt_delete;
END


CREATE PROCEDURE add_account (
    IN p_email VARCHAR(255),
    IN p_password_hash VARCHAR(255)
)
BEGIN
    INSERT INTO accounts (email, password_hash)
    VALUES (p_email, p_password_hash);
END


CREATE PROCEDURE update_account (
    IN p_account_id INT,
    IN p_email VARCHAR(255),
    IN p_password_hash VARCHAR(255),
    IN p_is_admin BOOLEAN,
    IN p_is_disabled BOOLEAN,
    IN p_refresh_token VARCHAR(255)
)
BEGIN
    UPDATE accounts
    SET email = COALESCE(p_email, email),
        password_hash = COALESCE(p_password_hash, password_hash),
        is_admin = COALESCE(p_is_admin, is_admin),
        is_disabled = COALESCE(p_is_disabled, is_disabled),
        refresh_token = COALESCE(p_refresh_token, refresh_token)
    WHERE account_id = p_account_id;
END


CREATE PROCEDURE add_user_profile (
    IN p_account_id INT,
    IN p_username VARCHAR(50),
    IN p_phone_number VARCHAR(15),
    IN p_user_address TEXT
)
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM accounts
        WHERE account_id = p_account_id
          AND is_disabled = FALSE
    ) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Account not found or disabled';
    END IF;

    INSERT INTO user_profiles (username, phone_number, user_address, account_id)
    VALUES (p_username, p_phone_number, p_user_address, p_account_id);
END


CREATE PROCEDURE update_user_profile (
    IN p_account_id INT,
    IN p_username VARCHAR(50),
    IN p_phone_number VARCHAR(15),
    IN p_user_address TEXT
)
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM accounts a
        WHERE a.account_id = p_account_id
          AND a.is_disabled = FALSE
    ) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Account not found or is disabled';
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM user_profiles up
        WHERE up.account_id = p_account_id
    ) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'User profile not found';
    END IF;

    UPDATE user_profiles
    SET 
        username     = COALESCE(p_username, username),
        phone_number = COALESCE(p_phone_number, phone_number),
        user_address = COALESCE(p_user_address, user_address)
    WHERE account_id = p_account_id;
END


CREATE PROCEDURE add_order (
    IN p_account_id INT,
    IN p_total_price DECIMAL(10, 3)
)
BEGIN
    INSERT INTO orders (account_id, total_price)
    VALUES (p_account_id, p_total_price);
END


DELIMITER;


SELECT oi.quantity, oi.product_id, p.product_name, oi.variant_snapshot, oi.order_id, oi.discount_id
       FROM order_items oi 
       JOIN products p ON oi.product_id = p.product_id 
       WHERE oi.order_id = 6