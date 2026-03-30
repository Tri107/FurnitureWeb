-- SQL Seed Data for Furniture Web Project
USE furniture;

-- Clear old data (Optional / Caution)
-- SET FOREIGN_KEY_CHECKS = 0;
-- TRUNCATE TABLE cart_items;
-- TRUNCATE TABLE favorites;
-- TRUNCATE TABLE reviews;
-- TRUNCATE TABLE payments;
-- TRUNCATE TABLE order_items;
-- TRUNCATE TABLE orders;
-- TRUNCATE TABLE discounts;
-- TRUNCATE TABLE user_profiles;
-- TRUNCATE TABLE accounts;
-- TRUNCATE TABLE products;
-- TRUNCATE TABLE collections;
-- TRUNCATE TABLE brands;
-- TRUNCATE TABLE categories;
-- SET FOREIGN_KEY_CHECKS = 1;

-- 1. Categories (5)
INSERT INTO
    categories (category_name)
VALUES ('Bàn'),
    ('Ghế'),
    ('Tủ'),
    ('Giường'),
    ('Kệ');

-- 2. Brands (7)
INSERT INTO
    brands (brand_name)
VALUES ('Nội Thất Hòa Phát'),
    ('Nội Thất An Cường'),
    ('Nội Thất Minh Long'),
    ('Rossano'),
    ('JYSK'),
    ('Index Living'),
    ('IKEA');

-- 3. Collections (4)
INSERT INTO
    collections (collection_name)
VALUES ('Modern'),
    ('Classic'),
    ('Minimal'),
    ('Luxury');

-- 4. Discounts (4)
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
        'Giảm 10% cho tất cả sản phẩm'
    ),
    (
        'SALE20',
        20,
        '2025-06-01',
        '2025-12-31',
        'Khuyến mãi hè sôi động'
    ),
    (
        'WELCOME',
        15,
        '2025-01-01',
        '2025-12-31',
        'Quà tặng thành viên mới'
    ),
    (
        'SUMMER',
        25,
        '2025-04-01',
        '2025-08-31',
        'Ưu đãi đặc biệt mùa hè'
    );

-- 5. Accounts (1 Admin + 3 Users)
-- Note: password_hash uses placeholders as requested. Admin matches furniture.sql.
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
        '$2a$10$userhash',
        FALSE
    ),
    (
        'user2@gmail.com',
        '$2a$10$userhash',
        FALSE
    ),
    (
        'user3@gmail.com',
        '$2a$10$userhash',
        FALSE
    );

-- 6. User Profiles (Only for 3 User accounts - account_id 2, 3, 4)
INSERT INTO
    user_profiles (
        username,
        phone_number,
        user_address,
        account_id
    )
VALUES (
        'nguyenvan_a',
        '0912345678',
        '123 Cách Mạng Tháng 8, Quận 10, TP.HCM',
        2
    ),
    (
        'lethi_b',
        '0987654321',
        '456 Lê Lợi, TP. Đà Nẵng',
        3
    ),
    (
        'tranvan_c',
        '0905556667',
        '789 Nguyễn Huệ, Quận 1, TP.HCM',
        4
    );

-- 7. Products (20)
-- Distributed across cat(1-5), brand(1-7), col(1-4)
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
        'Bàn làm việc Modern Sồi',
        'Bàn gỗ sồi phong cách hiện đại tích hợp ngăn kéo',
        1,
        1,
        1,
        '65f1a123a123a123a1230001'
    ),
    (
        'Ghế Sofa Rossano Luxury',
        'Sofa da thật cao cấp, êm ái, bền bỉ',
        2,
        4,
        4,
        '65f1a123a123a123a1230002'
    ),
    (
        'Tủ quần áo JYSK Minimal',
        'Tủ 3 cánh gỗ MDF chống trầy, thiết kế tối giản',
        3,
        5,
        3,
        '65f1a123a123a123a1230003'
    ),
    (
        'Giường IKEA Hemnes',
        'Giường đôi khung gỗ chắc chắn, trắng cổ điển',
        4,
        7,
        2,
        '65f1a123a123a123a1230004'
    ),
    (
        'Kệ sách Minh Long Modern',
        'Kệ đa năng nhiều tầng, màu gỗ tự nhiên',
        5,
        3,
        1,
        '65f1a123a123a123a1230005'
    ),
    (
        'Bàn ăn Index Luxury',
        'Bàn tròn mặt đá marble, phong cách sang trọng',
        1,
        6,
        4,
        '65f1a123a123a123a1230006'
    ),
    (
        'Ghế xoay Hòa Phát Classic',
        'Ghế văn phòng tựa lưng cao, bọc da đen',
        2,
        1,
        2,
        '65f1a123a123a123a1230007'
    ),
    (
        'Tủ giày An Cường Minimal',
        'Tủ thông minh tiết kiệm diện tích, màu xám',
        3,
        2,
        3,
        '65f1a123a123a123a1230008'
    ),
    (
        'Giường ngủ Rossano Classic',
        'Giường tân cổ điển, bọc vải nhung cao cấp',
        4,
        4,
        2,
        '65f1a123a123a123a1230009'
    ),
    (
        'Kệ TV IKEA Lack',
        'Kệ nhẹ bền, màu vân gỗ, thiết kế đơn giản',
        5,
        7,
        3,
        '65f1a123a123a123a1230010'
    ),
    (
        'Bàn trà JYSK Scandinavian',
        'Bàn tròn chân gỗ tối giản, phong cách Bắc Âu',
        1,
        5,
        3,
        '65f1a123a123a123a1230011'
    ),
    (
        'Ghế ăn Minh Long Modern',
        'Bộ ghế gỗ ASH, tựa lưng thoải mái',
        2,
        3,
        1,
        '65f1a123a123a123a1230012'
    ),
    (
        'Tủ bếp Hòa Phát Luxury',
        'Hệ tủ bếp Acrylic sáng bóng, hiện đại',
        3,
        1,
        4,
        '65f1a123a123a123a1230013'
    ),
    (
        'Giường đơn An Cường Modern',
        'Giường compact tích hợp ngăn chứa đồ',
        4,
        2,
        1,
        '65f1a123a123a123a1230014'
    ),
    (
        'Kệ trang trí Rossano Luxury',
        'Kệ mạ vàng kết hợp kính cường lực',
        5,
        4,
        4,
        '65f1a123a123a123a1230015'
    ),
    (
        'Bàn họp Index Modern',
        'Bàn họp lớn, tích hợp hệ thống đi dây điện',
        1,
        6,
        1,
        '65f1a123a123a123a1230016'
    ),
    (
        'Ghế bành IKEA Strandmon',
        'Ghế thư giãn mang tính biểu tượng, màu xanh navy',
        2,
        7,
        2,
        '65f1a123a123a123a1230017'
    ),
    (
        'Tủ hồ sơ Hòa Phát Classic',
        'Tủ sắt sơn tĩnh điện cho văn phòng',
        3,
        1,
        2,
        '65f1a123a123a123a1230018'
    ),
    (
        'Giường tầng JYSK Minimal',
        'Giường an toàn, chắc chắn cho trẻ em',
        4,
        5,
        3,
        '65f1a123a123a123a1230019'
    ),
    (
        'Kệ treo tường An Cường Modern',
        'Hệ kệ treo linh hoạt, dễ lắp đặt',
        5,
        2,
        1,
        '65f1a123a123a123a1230020'
    );