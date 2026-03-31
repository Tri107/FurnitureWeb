
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
        '$2a$12$qi5iD6VCHPnIOcdzvCzV9O9CGIDjQOquBzp.HqCuctzQW7tCE6etm',
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
    ),
    ('user4@gmail.com', '$2a$10$userhash', FALSE),
    ('user5@gmail.com', '$2a$10$userhash', FALSE),
    ('user6@gmail.com', '$2a$10$userhash', FALSE),
    ('user7@gmail.com', '$2a$10$userhash', FALSE),
    ('user8@gmail.com', '$2a$10$userhash', FALSE),
    ('user9@gmail.com', '$2a$10$userhash', FALSE),
    ('user10@gmail.com', '$2a$10$userhash', FALSE),
    ('user11@gmail.com', '$2a$10$userhash', FALSE),
    ('user12@gmail.com', '$2a$10$userhash', FALSE),
    ('user13@gmail.com', '$2a$10$userhash', FALSE),
    ('user14@gmail.com', '$2a$10$userhash', FALSE),
    ('user15@gmail.com', '$2a$10$userhash', FALSE),
    ('user16@gmail.com', '$2a$10$userhash', FALSE),
    ('user17@gmail.com', '$2a$10$userhash', FALSE),
    ('user18@gmail.com', '$2a$10$userhash', FALSE),
    ('user19@gmail.com', '$2a$10$userhash', FALSE),
    ('user20@gmail.com', '$2a$10$userhash', FALSE),
    ('user21@gmail.com', '$2a$10$userhash', FALSE),
    ('user22@gmail.com', '$2a$10$userhash', FALSE),
    ('user23@gmail.com', '$2a$10$userhash', FALSE);

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
    ),
    ('user_test_4', '0995822412', '115 Street 1, District 5, City HCM', 5),
    ('user_test_5', '0939958838', '143 Street 4, District 9, City HCM', 6),
    ('user_test_6', '0989254563', '433 Street 2, District 1, City HCM', 7),
    ('user_test_7', '0939345092', '239 Street 17, District 10, City HCM', 8),
    ('user_test_8', '0985329037', '204 Street 18, District 7, City HCM', 9),
    ('user_test_9', '0970291817', '604 Street 9, District 1, City HCM', 10),
    ('user_test_10', '0966722344', '349 Street 9, District 3, City HCM', 11),
    ('user_test_11', '0955176955', '105 Street 3, District 7, City HCM', 12),
    ('user_test_12', '0958181396', '868 Street 12, District 10, City HN', 13),
    ('user_test_13', '0915831819', '748 Street 15, District 9, City HCM', 14),
    ('user_test_14', '0960806024', '81 Street 18, District 5, City DN', 15),
    ('user_test_15', '0993016315', '907 Street 12, District 10, City HCM', 16),
    ('user_test_16', '0919335534', '47 Street 8, District 5, City HCM', 17),
    ('user_test_17', '0941244663', '888 Street 4, District 7, City HN', 18),
    ('user_test_18', '0970855700', '651 Street 12, District 3, City HN', 19),
    ('user_test_19', '0957683626', '215 Street 9, District 2, City DN', 20),
    ('user_test_20', '0995225343', '176 Street 18, District 4, City HCM', 21),
    ('user_test_21', '0972043515', '389 Street 9, District 9, City HCM', 22),
    ('user_test_22', '0953524491', '864 Street 2, District 4, City HCM', 23),
    ('user_test_23', '0952339391', '411 Street 9, District 2, City HCM', 24);


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
        'Bàn phong cách hiện đại tích hợp ngăn kéo',
        1,
        1,
        1,
        'abc'
    ),
    (
        'Ghế Sofa Rossano Luxury',
        'Sofa da thật cao cấp, êm ái, bền bỉ',
        2,
        4,
        4,
        'abc1'
    ),
    (
        'Tủ quần áo JYSK Minimal',
        'Tủ 3 cánh gỗ MDF chống trầy, thiết kế tối giản',
        3,
        5,
        3,
        'abc2'
    ),
    (
        'Giường IKEA Hemnes',
        'Giường đôi khung gỗ chắc chắn, trắng cổ điển',
        4,
        7,
        2,
        'abc3'
    ),
    (
        'Kệ sách Minh Long Modern',
        'Kệ đa năng nhiều tầng, màu gỗ tự nhiên',
        5,
        3,
        1,
        'abc4'
    ),
    (
        'Bàn ăn Index Luxury',
        'Bàn tròn mặt đá marble, phong cách sang trọng',
        1,
        6,
        4,
        'abc5'
    ),
    (
        'Ghế gỗ óc chó Hòa Phát Classic',
        'Ghế gỗ óc chó tựa lưng cao, chân gỗ sồi, phù hợp phòng ăn',
        2,
        1,
        2,
        'abc6'
    ),
    (
        'Tủ giày An Cường Minimal',
        'Tủ thông minh tiết kiệm diện tích',
        3,
        2,
        3,
        'abc7'
    ),
    (
        'Giường ngủ Rossano Classic',
        'Giường tân cổ điển, bọc vải nhung cao cấp',
        4,
        4,
        2,
        'abc8'
    ),
    (
        'Kệ TV IKEA Lack',
        'Kệ nhẹ bền, màu vân gỗ, thiết kế đơn giản',
        5,
        7,
        3,
        'abc9'
    ),
    (
        'Bàn trà JYSK Scandinavian',
        'Bàn tròn chân gỗ tối giản, phong cách Bắc Âu',
        1,
        5,
        3,
        'abc10'
    ),
    (
        'Ghế ăn Minh Long Modern',
        'Bộ ghế gỗ ASH, tựa lưng thoải mái',
        2,
        3,
        1,
        'abc11'
    ),
    (
        'Tủ bếp Hòa Phát Luxury',
        'Hệ tủ bếp gỗ sồi sẫm màu, hiện đại',
        3,
        1,
        4,
        'abc12'
    ),
    (
        'Giường đơn An Cường Modern',
        'Giường compact tích hợp ngăn chứa đồ',
        4,
        2,
        1,
        'abc13'
    ),
    (
        'Kệ trang trí Rossano Luxury',
        'Kệ gỗ hiện đại, tối giản',
        5,
        4,
        4,
        'abc14'
    ),
    (
        'Bàn họp Index Modern',
        'Bàn họp lớn, tích hợp hệ thống đi dây điện',
        1,
        6,
        1,
        'abc15'
    ),
    (
        'Ghế bành IKEA Strandmon',
        'Ghế thư giãn mang tính biểu tượng, màu xanh navy',
        2,
        7,
        2,
        'abc16'
    ),
    (
        'Tủ hồ sơ Hòa Phát Classic',
        'Tủ gỗ đơn giản cho văn phòng',
        3,
        1,
        2,
        'abc17'
    ),
    (
        'Giường tầng JYSK Minimal',
        'Giường an toàn, chắc chắn',
        4,
        5,
        3,
        'abc18'
    ),
    (
        'Kệ treo tường An Cường Modern',
        'Hệ kệ treo linh hoạt, dễ lắp đặt',
        5,
        2,
        1,
        'abc19'
    );

-- 10. Orders (30)
INSERT INTO
    orders (
        order_status,
        total_price,
        address,
        note,
        account_id
    )
VALUES
    ('DELIVERED', 24000000, '147 Order Street 9, City HCM', 'Note 1', 20),
    ('DELIVERED', 40200000, '882 Order Street 4, City HCM', 'Note 2', 9),
    ('DELIVERING', 62200000, '788 Order Street 11, City HCM', 'Note 3', 22),
    ('CANCELLED', 11000000, '996 Order Street 17, City HCM', 'Note 4', 11),
    ('PENDING', 10400000, '20 Order Street 4, City HN', 'Note 5', 18),
    ('DELIVERING', 1800000, '750 Order Street 16, City HCM', 'Note 6', 11),
    ('DELIVERING', 24000000, '541 Order Street 20, City HN', 'Note 7', 19),
    ('DELIVERING', 27750000, '347 Order Street 1, City DN', 'Note 8', 8),
    ('DELIVERING', 10100000, '527 Order Street 8, City HN', 'Note 9', 19),
    ('CANCELLED', 3000000, '249 Order Street 16, City HN', 'Note 10', 23),
    ('PENDING', 8400000, '421 Order Street 15, City DN', 'Note 11', 8),
    ('PENDING', 25000000, '255 Order Street 7, City HCM', 'Note 12', 3),
    ('CANCELLED', 8400000, '474 Order Street 8, City HCM', 'Note 13', 19),
    ('PENDING', 1500000, '949 Order Street 8, City HCM', 'Note 14', 16),
    ('CANCELLED', 27500000, '400 Order Street 9, City HN', 'Note 15', 15),
    ('CANCELLED', 17400000, '59 Order Street 2, City DN', 'Note 16', 11),
    ('DELIVERING', 3500000, '71 Order Street 20, City HCM', 'Note 17', 17),
    ('DELIVERING', 21100000, '674 Order Street 19, City DN', 'Note 18', 23),
    ('DELIVERED', 6600000, '688 Order Street 10, City HN', 'Note 19', 18),
    ('PENDING', 5500000, '551 Order Street 7, City DN', 'Note 20', 12),
    ('DELIVERING', 11200000, '854 Order Street 18, City DN', 'Note 21', 10),
    ('PENDING', 18950000, '289 Order Street 20, City HCM', 'Note 22', 11),
    ('DELIVERED', 30000000, '928 Order Street 2, City HCM', 'Note 23', 24),
    ('CANCELLED', 17100000, '760 Order Street 15, City DN', 'Note 24', 22),
    ('CANCELLED', 15800000, '43 Order Street 10, City HN', 'Note 25', 24),
    ('DELIVERED', 3600000, '799 Order Street 18, City HN', 'Note 26', 3),
    ('DELIVERING', 19600000, '26 Order Street 6, City DN', 'Note 27', 21),
    ('CANCELLED', 43400000, '837 Order Street 15, City HN', 'Note 28', 12),
    ('DELIVERING', 9000000, '337 Order Street 9, City HCM', 'Note 29', 11),
    ('DELIVERED', 56500000, '40 Order Street 4, City DN', 'Note 30', 10);

-- 11. Order Items
INSERT INTO
    order_items (
        quantity,
        product_id,
        variant_snapshot,
        order_id,
        discount_id
    )
VALUES
    (2, 16, '{"sku": "BAN-HOP-ID-MOD", "price": 12000000, "color": "Nâu Đậm", "material": "Gỗ MFC cao cấp"}', 1, NULL),
    (1, 19, '{"sku": "BED-TANG-JYSK", "price": 6800000, "color": "Gỗ Sáng", "material": "Gỗ Thông Tự Nhiên"}', 2, NULL),
    (2, 14, '{"sku": "BED-SINGLE-AC", "price": 4200000, "color": "Vân Gỗ", "material": "MDF An Cường"}', 2, NULL),
    (1, 13, '{"sku": "TU-BEP-HP-LUX", "price": 25000000, "color": "Trắng Bóng", "material": "Acrylic/MDF"}', 2, NULL),
    (2, 14, '{"sku": "BED-SINGLE-AC", "price": 4200000, "color": "Vân Gỗ", "material": "MDF An Cường"}', 3, NULL),
    (1, 3, '{"sku": "TU-MIN-3D-OAK", "price": 3800000, "color": "Vân sồi", "material": "Gỗ MDF"}', 3, NULL),
    (2, 13, '{"sku": "TU-BEP-HP-LUX", "price": 25000000, "color": "Trắng Bóng", "material": "Acrylic/MDF"}', 3, NULL),
    (2, 15, '{"sku": "KE-MO-BR", "price": 5500000, "color": "Nâu Đậm", "material": "Gỗ Óc Chó"}', 4, NULL),
    (2, 10, '{"sku": "KE-TV-IKEA", "price": 950000, "color": "Gỗ sáng", "material": "Ván dăm"}', 5, NULL),
    (1, 17, '{"sku": "GHE-BANH-IKEA-NV", "price": 3500000, "color": "Xanh Navy", "material": "Vải sợi"}', 5, NULL),
    (2, 7, '{"sku": "GHE-HP-CL-BK", "price": 2500000, "color": "Đen", "material": "Da PU"}', 5, NULL),
    (1, 8, '{"sku": "TU-AC-MIN-GY", "price": 1800000, "color": "Xám", "material": "MDF chống ẩm"}', 6, NULL),
    (2, 16, '{"sku": "BAN-HOP-ID-MOD", "price": 12000000, "color": "Nâu Đậm", "material": "Gỗ MFC cao cấp"}', 7, NULL),
    (2, 10, '{"sku": "KE-TV-IKEA", "price": 950000, "color": "Gỗ sáng", "material": "Ván dăm"}', 8, NULL),
    (1, 13, '{"sku": "TU-BEP-HP-LUX", "price": 25000000, "color": "Trắng Bóng", "material": "Acrylic/MDF"}', 8, NULL),
    (1, 12, '{"sku": "GHE-ML-MOD-GY", "price": 850000, "color": "Xám Gỗ", "material": "Gỗ ASH"}', 8, NULL),
    (1, 8, '{"sku": "TU-AC-MIN-GY", "price": 1800000, "color": "Xám", "material": "MDF chống ẩm"}', 9, NULL),
    (1, 1, '{"sku": "BAN-MODERN-BR", "price": 4500000, "color": "Nâu Đậm", "material": "Gỗ MDF"}', 9, NULL),
    (1, 3, '{"sku": "TU-MIN-3D-OAK", "price": 3800000, "color": "Vân sồi", "material": "Gỗ MDF"}', 9, NULL),
    (2, 18, '{"sku": "TU-HS-HP-CL", "price": 1500000, "color": "Ghi Sáng", "material": "Sắt sơn tĩnh điện"}', 10, NULL),
    (2, 14, '{"sku": "BED-SINGLE-AC", "price": 4200000, "color": "Vân Gỗ", "material": "MDF An Cường"}', 11, NULL),
    (1, 13, '{"sku": "TU-BEP-HP-LUX", "price": 25000000, "color": "Trắng Bóng", "material": "Acrylic/MDF"}', 12, NULL),
    (2, 14, '{"sku": "BED-SINGLE-AC", "price": 4200000, "color": "Vân Gỗ", "material": "MDF An Cường"}', 13, NULL),
    (1, 18, '{"sku": "TU-HS-HP-CL", "price": 1500000, "color": "Ghi Sáng", "material": "Sắt sơn tĩnh điện"}', 14, NULL),
    (1, 7, '{"sku": "GHE-HP-CL-BK", "price": 2500000, "color": "Đen", "material": "Da PU"}', 15, NULL),
    (1, 13, '{"sku": "TU-BEP-HP-LUX", "price": 25000000, "color": "Trắng Bóng", "material": "Acrylic/MDF"}', 15, NULL),
    (2, 18, '{"sku": "TU-HS-HP-CL", "price": 1500000, "color": "Ghi Sáng", "material": "Sắt sơn tĩnh điện"}', 16, NULL),
    (1, 16, '{"sku": "BAN-HOP-ID-MOD", "price": 12000000, "color": "Nâu Đậm", "material": "Gỗ MFC cao cấp"}', 16, NULL),
    (2, 5, '{"sku": "KE-ML-MOD-4", "price": 1200000, "color": "Gỗ sáng", "material": "Gỗ công nghiệp"}', 16, NULL),
    (1, 17, '{"sku": "GHE-BANH-IKEA-NV", "price": 3500000, "color": "Xanh Navy", "material": "Vải sợi"}', 17, NULL),
    (1, 4, '{"sku": "BED-IKEA-WH", "price": 7500000, "color": "Trắng", "material": "Gỗ thông"}', 18, NULL),
    (2, 19, '{"sku": "BED-TANG-JYSK", "price": 6800000, "color": "Gỗ Sáng", "material": "Gỗ Thông Tự Nhiên"}', 18, NULL),
    (2, 7, '{"sku": "GHE-HP-CL-BK", "price": 2500000, "color": "Đen", "material": "Da PU"}', 19, NULL),
    (1, 11, '{"sku": "BAN-TRA-JYSK", "price": 1600000, "color": "Mộc", "material": "Gỗ Tự Nhiên"}', 19, NULL),
    (1, 15, '{"sku": "KE-MO-BR", "price": 5500000, "color": "Nâu Đậm", "material": "Gỗ Óc Chó"}', 20, NULL),
    (2, 3, '{"sku": "TU-MIN-3D-OAK", "price": 3800000, "color": "Vân sồi", "material": "Gỗ MDF"}', 21, NULL),
    (2, 8, '{"sku": "TU-AC-MIN-GY", "price": 1800000, "color": "Xám", "material": "MDF chống ẩm"}', 21, NULL),
    (2, 18, '{"sku": "TU-HS-HP-CL", "price": 1500000, "color": "Ghi Sáng", "material": "Sắt sơn tĩnh điện"}', 22, NULL),
    (1, 10, '{"sku": "KE-TV-IKEA", "price": 950000, "color": "Gỗ sáng", "material": "Ván dăm"}', 22, NULL),
    (2, 4, '{"sku": "BED-IKEA-WH", "price": 7500000, "color": "Trắng", "material": "Gỗ thông"}', 22, NULL),
    (2, 9, '{"sku": "BED-ROS-CL-V", "price": 15000000, "color": "Kem", "material": "Vải Nhung"}', 23, NULL),
    (1, 2, '{"sku": "SOFA-LUX-GY", "price": 12500000, "color": "Xám", "material": "Da thật"}', 24, NULL),
    (1, 1, '{"sku": "BAN-MODERN-WH", "price": 4600000, "color": "Trắng", "material": "Gỗ sồi sơn trắng"}', 24, NULL),
    (1, 1, '{"sku": "BAN-MODERN-BR", "price": 4500000, "color": "Nâu Đậm", "material": "Gỗ MDF"}', 25, NULL),
    (1, 4, '{"sku": "BED-IKEA-WH", "price": 7500000, "color": "Trắng", "material": "Gỗ thông"}', 25, NULL),
    (1, 3, '{"sku": "TU-MIN-3D-OAK", "price": 3800000, "color": "Vân sồi", "material": "Gỗ MDF"}', 25, NULL),
    (2, 8, '{"sku": "TU-AC-MIN-GY", "price": 1800000, "color": "Xám", "material": "MDF chống ẩm"}', 26, NULL),
    (2, 6, '{"sku": "BAN-INDEX-LUX", "price": 9800000, "color": "Vân mây", "material": "Đá Cẩm Thạch"}', 27, NULL),
    (2, 8, '{"sku": "TU-AC-MIN-GY", "price": 1800000, "color": "Xám", "material": "MDF chống ẩm"}', 28, NULL),
    (2, 9, '{"sku": "BED-ROS-CL-V", "price": 15000000, "color": "Kem", "material": "Vải Nhung"}', 28, NULL),
    (1, 6, '{"sku": "BAN-INDEX-LUX", "price": 9800000, "color": "Vân mây", "material": "Đá Cẩm Thạch"}', 28, NULL),
    (2, 1, '{"sku": "BAN-MODERN-BR", "price": 4500000, "color": "Nâu Đậm", "material": "Gỗ MDF"}', 29, NULL),
    (1, 17, '{"sku": "GHE-BANH-IKEA-NV", "price": 3500000, "color": "Xanh Navy", "material": "Vải sợi"}', 30, NULL),
    (2, 13, '{"sku": "TU-BEP-HP-LUX", "price": 25000000, "color": "Trắng Bóng", "material": "Acrylic/MDF"}', 30, NULL),
    (2, 18, '{"sku": "TU-HS-HP-CL", "price": 1500000, "color": "Ghi Sáng", "material": "Sắt sơn tĩnh điện"}', 30, NULL);

