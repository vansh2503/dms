-- ============================================================
-- Dealer Management System - Data Seed File
-- This file contains ONLY INSERT statements
-- Tables are created by Hibernate (spring.jpa.hibernate.ddl-auto=update)
-- ============================================================

SET SESSION sql_mode = '';
SET FOREIGN_KEY_CHECKS = 0;

-- Fix existing customers that were inserted without is_active (defaulted to 0)
UPDATE customers SET is_active = TRUE WHERE is_active = FALSE AND created_by IS NULL;

-- ============================================================
-- 1. DEALERSHIPS
-- ============================================================
INSERT IGNORE INTO dealerships (dealership_code, dealership_name, address, city, state, pincode, phone, email, manager_name, is_active, created_at, updated_at) VALUES
('HYN-DL-001', 'Hyundai Karol Bagh Motors',     '15, Pusa Road, Karol Bagh',            'New Delhi',  'Delhi',          '110005', '9811001001', 'karolbagh@hyundai.in',   'Rajiv Malhotra',  TRUE, NOW(), NOW()),
('HYN-MH-001', 'Hyundai Andheri Auto World',     'Plot 22, MIDC, Andheri East',          'Mumbai',     'Maharashtra',    '400093', '9820002002', 'andheri@hyundai.in',     'Suresh Shenoy',   TRUE, NOW(), NOW()),
('HYN-KA-001', 'Hyundai Koramangala Motors',     '47, 100 Feet Road, Koramangala',       'Bengaluru',  'Karnataka',      '560034', '9845003003', 'koramangala@hyundai.in', 'Pradeep Rao',     TRUE, NOW(), NOW()),
('HYN-TN-001', 'Hyundai Anna Nagar',             '110, 2nd Avenue, Anna Nagar',          'Chennai',    'Tamil Nadu',     '600040', '9840004004', 'annanagar@hyundai.in',   'Murugan Pillai',  TRUE, NOW(), NOW()),
('HYN-TS-001', 'Hyundai Banjara Hills Drive',    'Road No 12, Banjara Hills',            'Hyderabad',  'Telangana',      '500034', '9848005005', 'banjarahills@hyundai.in','Venkat Reddy',    TRUE, NOW(), NOW()),
('HYN-GJ-001', 'Hyundai SG Highway Motors',      'B-5, Sun Gravitas, SG Highway',        'Ahmedabad',  'Gujarat',        '380054', '9825006006', 'sghighway@hyundai.in',   'Hitesh Shah',     TRUE, NOW(), NOW()),
('HYN-RJ-001', 'Hyundai Jaipur Pink City',       '24, Tonk Road, Durgapura',             'Jaipur',     'Rajasthan',      '302018', '9829007007', 'pinkcity@hyundai.in',    'Ajay Sharma',     TRUE, NOW(), NOW()),
('HYN-WB-001', 'Hyundai Salt Lake Motors',       'BF-142, Sector II, Salt Lake',         'Kolkata',    'West Bengal',    '700091', '9830008008', 'saltlake@hyundai.in',    'Subhash Ghosh',   TRUE, NOW(), NOW()),
('HYN-UP-001', 'Hyundai Lucknow Gomti Nagar',    '3/419, Vikas Nagar, Gomti Nagar',      'Lucknow',    'Uttar Pradesh',  '226010', '9839009009', 'gomtinagar@hyundai.in',  'Alok Srivastava', TRUE, NOW(), NOW()),
('HYN-PB-001', 'Hyundai Chandigarh Sector 34',   'SCO 171-172, Sector 34-A',             'Chandigarh', 'Punjab',         '160022', '9815010010', 'sector34@hyundai.in',    'Gurpreet Singh',  TRUE, NOW(), NOW()),
('HYN-KL-001', 'Hyundai Kochi Marine Drive',     'Opp. Cochin Shipyard, MG Road',        'Kochi',      'Kerala',         '682015', '9847011011', 'marinedrive@hyundai.in', 'Thomas Varghese', TRUE, NOW(), NOW()),
('HYN-MH-002', 'Hyundai Pune Baner',             'Godrej Infinity, Baner Road',          'Pune',       'Maharashtra',    '411045', '9822012012', 'baner@hyundai.in',       'Vikas Kulkarni',  TRUE, NOW(), NOW()),
('HYN-AP-001', 'Hyundai Vijayawada Auto Hub',    'Opp. NTR Statue, MG Road',             'Vijayawada', 'Andhra Pradesh', '520010', '9848013013', 'vijayawada@hyundai.in',  'Krishna Rao',     TRUE, NOW(), NOW()),
('HYN-MP-001', 'Hyundai Bhopal New Market',      '14, New Market, TT Nagar',             'Bhopal',     'Madhya Pradesh', '462003', '9826014014', 'newmarket@hyundai.in',   'Ramesh Tiwari',   TRUE, NOW(), NOW()),
('HYN-HR-001', 'Hyundai Gurugram Cyber Hub',     'DLF Cyber Hub, DLF Phase 2',           'Gurugram',   'Haryana',        '122002', '9810015015', 'cyberhub@hyundai.in',    'Deepak Arora',    TRUE, NOW(), NOW());

-- ============================================================
-- 2. USERS (Password: password123 for all users)
-- ============================================================
INSERT IGNORE INTO users (username, password, email, full_name, phone, role, dealership_id, is_active) VALUES
('superadmin',      '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh3y', 'superadmin@hyundai.in',      'Karthik Rajan',      '9900000001', 'SUPER_ADMIN',     NULL, TRUE),
('rajiv.malhotra',  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh3y', 'rajiv.malhotra@hyundai.in',  'Rajiv Malhotra',     '9811001001', 'DEALER_MANAGER',  1,    TRUE),
('suresh.shenoy',   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh3y', 'suresh.shenoy@hyundai.in',   'Suresh Shenoy',      '9820002002', 'DEALER_MANAGER',  2,    TRUE),
('pradeep.rao',     '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh3y', 'pradeep.rao@hyundai.in',     'Pradeep Rao',        '9845003003', 'DEALER_MANAGER',  3,    TRUE),
('murugan.pillai',  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh3y', 'murugan.pillai@hyundai.in',  'Murugan Pillai',     '9840004004', 'DEALER_MANAGER',  4,    TRUE),
('ankit.sharma',    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh3y', 'ankit.sharma@hyundai.in',    'Ankit Sharma',       '9811100011', 'SALES_EXECUTIVE', 1,    TRUE),
('pooja.gupta',     '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh3y', 'pooja.gupta@hyundai.in',     'Pooja Gupta',        '9811200022', 'SALES_EXECUTIVE', 1,    TRUE),
('rohit.nair',      '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh3y', 'rohit.nair@hyundai.in',      'Rohit Nair',         '9820300033', 'SALES_EXECUTIVE', 2,    TRUE),
('divya.iyer',      '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh3y', 'divya.iyer@hyundai.in',      'Divya Iyer',         '9820400044', 'SALES_EXECUTIVE', 2,    TRUE),
('kiran.kumar',     '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh3y', 'kiran.kumar@hyundai.in',     'Kiran Kumar',        '9845500055', 'SALES_EXECUTIVE', 3,    TRUE),
('sneha.patil',     '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh3y', 'sneha.patil@hyundai.in',     'Sneha Patil',        '9845600066', 'SALES_EXECUTIVE', 3,    TRUE),
('arjun.menon',     '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh3y', 'arjun.menon@hyundai.in',     'Arjun Menon',        '9840700077', 'SALES_EXECUTIVE', 4,    TRUE),
('lakshmi.devi',    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh3y', 'lakshmi.devi@hyundai.in',    'Lakshmi Devi',       '9840800088', 'SALES_EXECUTIVE', 4,    TRUE),
('amit.verma',      '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh3y', 'amit.verma@hyundai.in',      'Amit Verma',         '9848900099', 'SALES_EXECUTIVE', 5,    TRUE),
('priya.reddy',     '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh3y', 'priya.reddy@hyundai.in',     'Priya Reddy',        '9848900111', 'SALES_EXECUTIVE', 5,    TRUE),
('venkat.reddy',    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh3y', 'venkat.reddy@hyundai.in',    'Venkat Reddy',       '9848005005', 'DEALER_MANAGER',  5,    TRUE),
('hitesh.shah',     '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh3y', 'hitesh.shah@hyundai.in',     'Hitesh Shah',        '9825006006', 'DEALER_MANAGER',  6,    TRUE),
('gurpreet.singh',  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh3y', 'gurpreet.singh@hyundai.in',  'Gurpreet Singh',     '9815010010', 'DEALER_MANAGER',  10,   TRUE),
('thomas.varghese', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh3y', 'thomas.varghese@hyundai.in', 'Thomas Varghese',    '9847011011', 'DEALER_MANAGER',  11,   TRUE);

-- ============================================================
-- 3. VEHICLE MODELS
-- ============================================================
INSERT IGNORE INTO vehicle_models (model_name, model_code, category, is_active) VALUES
('Creta',       'CRETA',   'SUV',       TRUE),
('Venue',       'VENUE',   'SUV',       TRUE),
('i20',         'I20',     'Hatchback', TRUE),
('i10',         'I10',     'Hatchback', TRUE),
('Verna',       'VERNA',   'Sedan',     TRUE),
('Exter',       'EXTER',   'Micro SUV', TRUE),
('Alcazar',     'ALCAZAR', 'SUV',       TRUE),
('Tucson',      'TUCSON',  'SUV',       TRUE),
('Ioniq 5',     'IONIQ5',  'Electric',  TRUE),
('Aura',        'AURA',    'Sedan',     TRUE),
('Kona',        'KONA',    'Electric',  TRUE),
('Grand i10',   'GI10N',   'Hatchback', TRUE),
('i20 N Line',  'I20NL',   'Hatchback', TRUE),
('Creta N Line','CRETAN',  'SUV',       TRUE),
('Stargazer',   'STRGZR',  'MPV',       TRUE);

-- ============================================================
-- 4. VEHICLE VARIANTS
-- ============================================================
INSERT IGNORE INTO vehicle_variants (model_id, variant_name, variant_code, fuel_type, transmission, engine_capacity, seating_capacity, base_price, ex_showroom_price, is_active) VALUES
(1,  'Creta E 1.5 Petrol MT',          'CRETA-E-15P-MT',    'PETROL',   'MANUAL',    '1497 cc',  5, 1050000.00, 1099000.00, TRUE),
(1,  'Creta S 1.5 Petrol MT',          'CRETA-S-15P-MT',    'PETROL',   'MANUAL',    '1497 cc',  5, 1189000.00, 1250000.00, TRUE),
(1,  'Creta SX 1.5 Petrol CVT',        'CRETA-SX-15P-CVT',  'PETROL',   'CVT',       '1497 cc',  5, 1480000.00, 1545000.00, TRUE),
(1,  'Creta SX(O) 1.5 Turbo DCT',      'CRETA-SXO-15T-DCT', 'PETROL',   'DCT',       '1497 cc',  5, 1850000.00, 1950000.00, TRUE),
(1,  'Creta SX 1.5 Diesel MT',         'CRETA-SX-15D-MT',   'DIESEL',   'MANUAL',    '1493 cc',  5, 1490000.00, 1560000.00, TRUE),
(2,  'Venue E 1.2 Petrol MT',          'VENUE-E-12P-MT',    'PETROL',   'MANUAL',    '1197 cc',  5,  799000.00,  840000.00, TRUE),
(2,  'Venue SX 1.0 Turbo MT',          'VENUE-SX-10T-MT',   'PETROL',   'MANUAL',    '998 cc',   5, 1150000.00, 1199000.00, TRUE),
(2,  'Venue SX+ 1.0 Turbo DCT',        'VENUE-SXP-10T-DCT', 'PETROL',   'DCT',       '998 cc',   5, 1320000.00, 1380000.00, TRUE),
(3,  'i20 Era 1.2 Petrol MT',          'I20-ERA-12P-MT',    'PETROL',   'MANUAL',    '1197 cc',  5,  749000.00,  785000.00, TRUE),
(3,  'i20 Sportz 1.2 Petrol MT',       'I20-SPT-12P-MT',    'PETROL',   'MANUAL',    '1197 cc',  5,  920000.00,  960000.00, TRUE),
(3,  'i20 Asta 1.5 Diesel MT',         'I20-AST-15D-MT',    'DIESEL',   'MANUAL',    '1493 cc',  5, 1050000.00, 1100000.00, TRUE),
(5,  'Verna EX 1.5 Petrol MT',         'VERNA-EX-15P-MT',   'PETROL',   'MANUAL',    '1497 cc',  5, 1099000.00, 1150000.00, TRUE),
(5,  'Verna SX 1.5 Turbo CVT',         'VERNA-SX-15T-CVT',  'PETROL',   'CVT',       '1497 cc',  5, 1650000.00, 1720000.00, TRUE),
(6,  'Exter S 1.2 Petrol AMT',         'EXTER-S-12P-AMT',   'PETROL',   'AMT',       '1197 cc',  5,  799000.00,  835000.00, TRUE),
(6,  'Exter SX CNG MT',                'EXTER-SX-CNG-MT',   'CNG',      'MANUAL',    '1197 cc',  5,  890000.00,  935000.00, TRUE),
(7,  'Alcazar Prestige 2.0 Petrol AT', 'ALCZR-PRE-20P-AT',  'PETROL',   'AUTOMATIC', '1999 cc',  7, 1999000.00, 2099000.00, TRUE),
(7,  'Alcazar Platinum 1.5 Diesel AT', 'ALCZR-PLT-15D-AT',  'DIESEL',   'AUTOMATIC', '1493 cc',  6, 2150000.00, 2250000.00, TRUE),
(9,  'Ioniq 5 Standard Range RWD',     'IONQ5-STD-RWD',     'ELECTRIC', 'AUTOMATIC', 'Electric', 5, 4400000.00, 4599000.00, TRUE),
(12, 'Grand i10 Magna 1.2 Petrol MT',  'GI10N-MGN-12P-MT',  'PETROL',   'MANUAL',    '1197 cc',  5,  649000.00,  680000.00, TRUE),
(13, 'i20 N8 1.0 Turbo DCT',           'I20NL-N8-10T-DCT',  'PETROL',   'DCT',       '998 cc',   5, 1290000.00, 1350000.00, TRUE);

-- ============================================================
-- 5. STOCKYARDS
-- ============================================================
INSERT IGNORE INTO stockyards (dealership_id, stockyard_name, location, capacity, is_active) VALUES
(1,  'Karol Bagh Main Yard',       'Plot 8, Peeragarhi Industrial Area, New Delhi',       80,  TRUE),
(1,  'Karol Bagh Secondary Yard',  'Shed C, Mayapuri Phase II, New Delhi',                50,  TRUE),
(2,  'Andheri Navi Mumbai Yard',   'Plot 18, TTC Industrial Estate, Turbhe, Navi Mumbai', 100, TRUE),
(3,  'Whitefield Storage Hub',     'Survey No 44, EPIP Zone, Whitefield, Bengaluru',      90,  TRUE),
(4,  'Chennai Sriperumbudur Yard', 'SIPCOT Industrial Park, Sriperumbudur',               120, TRUE),
(5,  'Hyderabad Patancheru Yard',  'IDA, Phase III, Patancheru, Hyderabad',               75,  TRUE),
(6,  'Ahmedabad Vatva Yard',       'GIDC Estate, Vatva, Ahmedabad',                       85,  TRUE),
(7,  'Jaipur Sitapura Yard',       'RIICO Industrial Area, Sitapura, Jaipur',             60,  TRUE),
(8,  'Kolkata Dankuni Yard',       'Dankuni Industrial Zone, Hooghly',                    70,  TRUE),
(9,  'Lucknow Amausi Yard',        'Transport Nagar, Amausi, Lucknow',                    55,  TRUE),
(10, 'Chandigarh Panchkula Yard',  'Industrial Area Phase II, Panchkula',                 45,  TRUE),
(11, 'Kochi Kalamassery Yard',     'KINFRA IT Park, Kalamassery, Kochi',                  65,  TRUE),
(12, 'Pune Ranjangaon Yard',       'MIDC Industrial Estate, Ranjangaon, Pune',            95,  TRUE),
(13, 'Vijayawada Gannavaram Yard', 'Auto Nagar, Gannavaram, Vijayawada',                  50,  TRUE),
(15, 'Gurugram IMT Manesar Yard',  'IMT Industrial Estate, Manesar, Gurugram',            110, TRUE);

-- ============================================================
-- 6. VEHICLES
-- ============================================================
INSERT IGNORE INTO vehicles
(variant_id, dealership_id, vin, chassis_number, engine_number, color, manufacturing_year, manufacturing_month, stockyard_id, status, purchase_price, selling_price, arrival_date)
WITH RECURSIVE numbers AS (
    SELECT 1 AS n
    UNION ALL
    SELECT n + 1 FROM numbers WHERE n < 120
)
SELECT
    (n % 10) + 1,
    (n % 10) + 1,
    CONCAT('VIN', LPAD(n,6,'0')),
    CONCAT('CHS', LPAD(n,6,'0')),
    CONCAT('ENG', LPAD(n,6,'0')),
    ELT((n % 5)+1,'White','Black','Red','Grey','Silver'),
    2024,
    (n % 12)+1,
    (n % 10)+1,
    ELT((n % 4)+1,'IN_SHOWROOM','SOLD','BOOKED','IN_STOCKYARD'),
    800000 + (n*1000),
    900000 + (n*1500),
    DATE_SUB(CURDATE(), INTERVAL (n % 60) DAY)
FROM numbers;

-- ============================================================
-- 7. CUSTOMERS
-- ============================================================
INSERT IGNORE INTO customers (first_name, last_name, email, phone, alternate_phone, address, city, state, pincode, date_of_birth, pan_number, aadhar_number, driving_license, customer_type, loyalty_points, is_active) VALUES
('Rajesh',    'Kumar',          'rajesh.kumar@gmail.com',      '9811234567', '9711234567', '14/8, Ramesh Nagar',                   'New Delhi',  'Delhi',           '110015', '1982-06-15', 'ABCPK1234R', '234567890123', 'DL0120150034567', 'INDIVIDUAL', 0, TRUE),
('Sunita',    'Sharma',         'sunita.sharma@gmail.com',     '9821345678', NULL,         'B-401, Neelkanth Heights, Thane',      'Mumbai',     'Maharashtra',     '400601', '1990-03-22', 'BCDPS1235S', '345678901234', 'MH0220180045678', 'INDIVIDUAL', 0, TRUE),
('Karthik',   'Subramaniam',    'karthik.sub@gmail.com',       '9845456789', '9745456789', '22, 4th Cross, Indiranagar',           'Bengaluru',  'Karnataka',       '560038', '1988-09-10', 'CCDQK1236T', '456789012345', 'KA0520160056789', 'INDIVIDUAL', 0, TRUE),
('Meenakshi', 'Pillai',         'meenakshi.p@yahoo.com',       '9840567890', '9940567890', '7, Venkatesa Agraharam St',            'Chennai',    'Tamil Nadu',      '600001', '1985-12-05', 'DDERL1237U', '567890123456', 'TN0520140067890', 'INDIVIDUAL', 0, TRUE),
('Venkatesh', 'Reddy',          'venkatesh.reddy@outlook.com', '9848678901', NULL,         'Plot 45, Madhapur Colony',             'Hyderabad',  'Telangana',       '500081', '1979-07-30', 'EEFVM1238V', '678901234567', 'TS0920100078901', 'INDIVIDUAL', 0, TRUE),
('Hitaben',   'Shah',           'hitaben.shah@rediffmail.com',  '9825789012', '9725789012', '12, Panchvati Society, CG Rd',         'Ahmedabad',  'Gujarat',         '380006', '1992-04-17', 'FFGWN1239W', '789012345678', 'GJ0120210089012', 'INDIVIDUAL', 0, TRUE),
('Arjun',     'Singh',          'arjun.singh85@gmail.com',     '9829890123', '9729890123', 'C-12, Shastri Nagar',                  'Jaipur',     'Rajasthan',       '302016', '1985-11-20', 'GGHXO1240X', '890123456789', 'RJ1420130090123', 'INDIVIDUAL', 0, TRUE),
('Subrata',   'Ghosh',          'subrata.ghosh@gmail.com',     '9830901234', NULL,         '34, Lake Gardens, 1st Lane',           'Kolkata',    'West Bengal',     '700045', '1975-08-25', 'HHIYP1241Y', '901234567890', 'WB0120020091234', 'INDIVIDUAL', 0, TRUE),
('Alok',      'Srivastava',     'alok.srivas@gmail.com',       '9839012345', '9739012345', '3/150, Viram Khand, Gomti Nagar',      'Lucknow',    'Uttar Pradesh',   '226010', '1991-02-14', 'IIJZQ1242Z', '012345678901', 'UP3220190092345', 'INDIVIDUAL', 0, TRUE),
('Gurjit',    'Kaur',           'gurjit.kaur@gmail.com',       '9815123456', '9715123456', 'H.No 245, Sector 20',                  'Chandigarh', 'Punjab',          '160020', '1987-05-30', 'JJKAR1243A', '123456789013', 'PB6520160093456', 'INDIVIDUAL', 0, TRUE),
('Thomas',    'Mathew',         'thomas.mathew@gmail.com',     '9847234567', '9747234567', 'TC 20/1449, Kesavadasapuram',          'Kochi',      'Kerala',          '695004', '1983-10-08', 'KKLBS1244B', '234567890124', 'KL0720120094567', 'INDIVIDUAL', 0, TRUE),
('Vikas',     'Kulkarni',       'vikas.kulk@gmail.com',        '9822345678', '9722345678', '102, Pride Icon, Baner',               'Pune',       'Maharashtra',     '411045', '1980-03-27', 'LLMCT1245C', '345678901235', 'MH1220080095678', 'INDIVIDUAL', 0, TRUE),
('Ananya',    'Krishnan',       'ananya.kris@gmail.com',       '9840456789', NULL,         '18, Warren Road, Mylapore',            'Chennai',    'Tamil Nadu',      '600004', '1995-07-12', 'MMNDV1246D', '456789012346', 'TN0220230096789', 'INDIVIDUAL', 0, TRUE),
('Deepak',    'Arora',          'deepak.arora@gmail.com',      '9810567890', '9710567890', '507, DLF Phase 3',                     'Gurugram',   'Haryana',         '122010', '1977-01-18', 'NNOEW1247E', '567890123457', 'HR2620040097890', 'INDIVIDUAL', 0, TRUE),
('Kavitha',   'Nair',           'kavitha.nair@gmail.com',      '9847678901', NULL,         '12, Sarojini Road, Vyttila',           'Kochi',      'Kerala',          '682019', '1993-09-25', 'OOPFX1248F', '678901234568', 'KL0720220098901', 'INDIVIDUAL', 0, TRUE),
('Ramesh',    'Tiwari',         'ramesh.tiwari@gmail.com',     '9826789012', '9726789012', '35, Arera Colony, E-5',                'Bhopal',     'Madhya Pradesh',  '462016', '1970-04-12', 'PPQGY1249G', '789012345679', 'MP0420000099012', 'INDIVIDUAL', 0, TRUE),
('Nisha',     'Agarwal',        'nisha.agarwal@gmail.com',     '9811890123', '9711890123', 'A-302, Sector 62',                     'Noida',      'Uttar Pradesh',   '201301', '1989-11-03', 'QQRHZ1250H', '890123456790', 'UP8520150099123', 'INDIVIDUAL', 0, TRUE),
('TechSoft',  'Solutions',      'hr@techsoft-solutions.com',   '9810001111', '9810002222', 'Unit 5, Okhla Industrial Estate Ph 3', 'New Delhi',  'Delhi',           '110020', NULL,         'TECHD0001T', NULL,           NULL,              'CORPORATE',  0, TRUE),
('Greenleaf', 'Agro',           'purchase@greenleafagro.com',  '9820003333', NULL,         '301, Nirmal Corporate Park',           'Mumbai',     'Maharashtra',     '400063', NULL,         'GREEG0002G', NULL,           NULL,              'CORPORATE',  0, TRUE),
('Surendra',  'Yadav',          'surendra.yadav@gmail.com',    '9839004444', '9739004444', '45, Indira Nagar, Sector 14',          'Lucknow',    'Uttar Pradesh',   '226016', '1975-03-05', 'SURDY1251Y', '900123456791', 'UP3220020099444', 'INDIVIDUAL', 0, TRUE);

-- ============================================================
-- 8. BOOKINGS
-- ============================================================
INSERT IGNORE INTO bookings
(booking_number, customer_id, vehicle_id, variant_id, dealership_id, sales_executive_id, booking_amount, total_amount, booking_date, expected_delivery_date, status, payment_mode, remarks)
WITH RECURSIVE numbers AS (
    SELECT 1 AS n
    UNION ALL
    SELECT n + 1 FROM numbers WHERE n < 120
)
SELECT
    CONCAT('HYN-2025-', LPAD(n,4,'0')),
    n,
    n,
    (n % 10)+1,
    (n % 10)+1,
    (n % 10)+6,
    20000 + (n*100),
    900000 + (n*2000),
    DATE_SUB(CURDATE(), INTERVAL (n % 30) DAY),
    DATE_ADD(CURDATE(), INTERVAL (n % 30) DAY),
    ELT((n % 4)+1,'CONFIRMED','PENDING','CANCELLED','COMPLETED'),
    ELT((n % 3)+1,'UPI','NEFT','Cash'),
    'Auto generated booking'
FROM numbers;

-- ============================================================
-- 9. BOOKING CANCELLATIONS
-- ============================================================
INSERT IGNORE INTO booking_cancellations (booking_id, cancellation_date, reason, refund_amount, refund_status, cancelled_by, remarks) VALUES
(13, '2024-09-20', 'Customer found better deal with competitor; exchange offer expired before vehicle arrived', 45000.00, 'COMPLETED', 7, 'Refund processed via NEFT to customer account within 7 days'),
(5,  '2024-11-06', 'Customer Venkatesh decided to wait for next year model launch; no penalty as within 24hrs', 50000.00, 'PENDING',   6, 'Full refund as cancellation within cooling-off period'),
(8,  '2024-11-13', 'Customer Subrata changed preference to Alcazar due to family size increase',                22500.00, 'PROCESSED', 6, 'Cancellation charges Rs 2500 deducted; balance refunded');

-- ============================================================
-- 10. TEST DRIVES
-- ============================================================
INSERT IGNORE INTO test_drives
(customer_id, vehicle_id, dealership_id, sales_executive_id, scheduled_date, scheduled_time, status, feedback)
WITH RECURSIVE numbers AS (
    SELECT 1 AS n
    UNION ALL
    SELECT n + 1 FROM numbers WHERE n < 120
)
SELECT
    n,
    n,
    (n % 10)+1,
    (n % 10)+6,
    DATE_SUB(CURDATE(), INTERVAL (n % 15) DAY),
    '11:00:00',
    ELT((n % 3)+1,'COMPLETED','SCHEDULED','NO_SHOW'),
    'Test drive auto feedback'
FROM numbers;

-- ============================================================
-- 11. EXCHANGE REQUESTS
-- ============================================================
INSERT IGNORE INTO test_drives
(customer_id, vehicle_id, dealership_id, sales_executive_id, scheduled_date, scheduled_time, status, feedback)
WITH RECURSIVE numbers AS (
    SELECT 1 AS n
    UNION ALL
    SELECT n + 1 FROM numbers WHERE n < 120
)
SELECT
    n,
    n,
    (n % 10)+1,
    (n % 10)+6,
    DATE_SUB(CURDATE(), INTERVAL (n % 15) DAY),
    '11:00:00',
    ELT((n % 3)+1,'COMPLETED','SCHEDULED','NO_SHOW'),
    'Test drive auto feedback'
FROM numbers;

-- ============================================================
-- 12. ACCESSORIES
-- ============================================================
INSERT IGNORE INTO accessories (accessory_name, accessory_code, category, description, price, is_active) VALUES
('3D Floor Mats – Premium PU Leather', 'ACC-FM-001', 'Interior',    'Custom fit PU leather 3D floor mats with Hyundai logo embossing',                  3500.00,  TRUE),
('Seat Covers – Leatherette Beige',    'ACC-SC-001', 'Interior',    'Beige leatherette seat covers with contrast stitching, 5-seater full set',          7500.00,  TRUE),
('Infotainment Screen Guard',          'ACC-SG-001', 'Interior',    'Tempered glass 9H anti-glare screen protector for Hyundai touchscreen',              899.00,   TRUE),
('Wireless Charger Pad 15W',           'ACC-WC-001', 'Interior',    'Qi-compatible 15W fast wireless charging pad with LED indicator',                    2999.00,  TRUE),
('Body Side Moulding – Chrome',        'ACC-BM-001', 'Exterior',    'OEM-style chrome-finished door body side mouldings, set of 4',                       3200.00,  TRUE),
('Mud Flaps – OEM Design',             'ACC-MF-001', 'Exterior',    'Original equipment style mud flaps set of 4 with Hyundai branding',                  1200.00,  TRUE),
('Hood Deflector / Wind Visor',        'ACC-WV-001', 'Exterior',    'Acrylic hood air deflector for bug and debris protection',                            2100.00,  TRUE),
('Chrome Door Handle Cover',           'ACC-DH-001', 'Exterior',    'ABS chrome plated door handle covers set of 4, easy clip-on installation',           1800.00,  TRUE),
('Dash Camera – Full HD 1080p',        'ACC-DC-001', 'Electronics', 'Sony IMX307 sensor dashcam with night vision, loop recording and G-sensor',          6500.00,  TRUE),
('Reverse Parking Sensors – 4 Sensor','ACC-PS-001', 'Electronics', 'Ultrasonic parking sensors with buzzer display panel, 4-sensor rear kit',            3800.00,  TRUE),
('Car Perfume – Hyundai Royal Musk',   'ACC-CP-001', 'Care',        'Luxury long-lasting royal musk fragrance branded Hyundai air freshener',              699.00,   TRUE),
('Car Cover – Custom Fit Outdoor',     'ACC-CC-001', 'Care',        'Waterproof, UV-resistant, dust-proof custom fit car cover with mirror pockets',      2200.00,  TRUE),
('Roof Carrier / Luggage Box 400L',    'ACC-RC-001', 'Utility',     'Aerodynamic 400-litre ABS roof box with key lock and universal fit rails',          14500.00,  TRUE),
('Tyre Inflator – Digital Auto',       'ACC-TI-001', 'Utility',     'Digital auto-cut tyre inflator with LED light, preset pressure, 12V DC',             2800.00,  TRUE),
('First Aid Kit – ISI Certified',      'ACC-FA-001', 'Safety',      'ISI certified 18-piece first aid kit in zippered pouch compliant with MV Act',       950.00,   TRUE);

-- ============================================================
-- 13. ACCESSORY ORDERS
-- ============================================================
INSERT IGNORE INTO accessory_orders (booking_id, accessory_id, quantity, unit_price, total_price, installation_required, installation_date, status) VALUES
(1,  1,  1, 3500.00,  3500.00,  TRUE,  '2024-11-18', 'INSTALLED'),
(1,  2,  1, 7500.00,  7500.00,  TRUE,  '2024-11-18', 'INSTALLED'),
(1,  9,  1, 6500.00,  6500.00,  TRUE,  '2024-11-18', 'INSTALLED'),
(2,  1,  1, 3500.00,  3500.00,  TRUE,  '2024-11-23', 'ORDERED'),
(2,  6,  1, 1200.00,  1200.00,  FALSE, NULL,          'ORDERED'),
(3,  4,  1, 2999.00,  2999.00,  TRUE,  '2024-11-28', 'ORDERED'),
(3,  8,  1, 1800.00,  1800.00,  FALSE, NULL,          'ORDERED'),
(4,  11, 1,  699.00,   699.00,  FALSE, NULL,          'INSTALLED'),
(6,  1,  1, 3500.00,  3500.00,  TRUE,  '2024-12-03', 'ORDERED'),
(6,  6,  1, 1200.00,  1200.00,  FALSE, NULL,          'ORDERED'),
(7,  13, 1,14500.00, 14500.00,  TRUE,  '2024-12-12', 'ORDERED'),
(7,  9,  1, 6500.00,  6500.00,  TRUE,  '2024-12-12', 'ORDERED'),
(10, 15, 1,  950.00,   950.00,  FALSE, NULL,          'INSTALLED'),
(12, 2,  1, 7500.00,  7500.00,  TRUE,  '2024-12-28', 'ORDERED'),
(14, 9,  1, 6500.00,  6500.00,  TRUE,  '2024-09-30', 'INSTALLED');

-- ============================================================
-- 14. DISPATCH RECORDS
-- ============================================================
INSERT IGNORE INTO dispatch_records (booking_id, vehicle_id, customer_id, dispatch_date, dispatch_time, dispatched_by, delivery_location, odometer_reading, fuel_level, documents_handed_over, keys_handed_over, customer_signature, remarks) VALUES
(4,  7,  4,  '2024-11-25', '11:30:00', 5,  '7, Venkatesa Agraharam St, Chennai',     12, 'Full', TRUE, TRUE, TRUE, 'Grand i10 Nios delivered to Meenakshi Pillai. All documents verified including RC and insurance. Customer received congratulatory bouquet.'),
(14, 14, 11, '2024-09-28', '14:00:00', 20, 'TC 20/1449, Kesavadasapuram, Kochi',     25, 'Full', TRUE, TRUE, TRUE, 'Ioniq 5 delivered to Thomas Mathew. Home charging setup guide explained. Green vehicle registration certificate handed over.'),
(3,  9,  3,  '2024-11-29', '10:00:00', 12, '22, 4th Cross, Indiranagar, Bengaluru',  18, 'Full', TRUE, TRUE, TRUE, 'Verna SX Turbo CVT delivered. Exchange Honda City taken over. Customer very satisfied. 5-star review promised.'),
(1,  1,  1,  '2024-11-19', '12:00:00', 6,  '14/8, Ramesh Nagar, New Delhi',          10, 'Full', TRUE, TRUE, TRUE, 'Creta SX(O) Titan Grey delivered to Rajesh Kumar. Accessories pre-installed. Vehicle detailed before delivery.'),
(12, 1,  14, '2024-12-29', '11:00:00', 6,  '507, DLF Phase 3, Gurugram',              8, 'Full', TRUE, TRUE, TRUE, 'Premium delivery for Deepak Arora. Creta SX(O) with all accessories. Corporate invoice issued.');

-- ============================================================
-- 15. SALES TRANSACTIONS
-- ============================================================
INSERT IGNORE INTO sales_transactions
(booking_id, vehicle_id, customer_id, dealership_id, sales_executive_id, sale_date, vehicle_price, accessories_price, insurance_amount, registration_charges, other_charges, discount_amount, exchange_value, total_amount, payment_mode, finance_company, loan_amount, down_payment, invoice_number, invoice_date)
WITH RECURSIVE numbers AS (
    SELECT 1 AS n
    UNION ALL
    SELECT n + 1 FROM numbers WHERE n < 90
)
SELECT
    n,
    n,
    n,
    (n % 10)+1,
    (n % 10)+6,
    CURDATE(),
    900000 + (n*2000),
    5000,
    30000,
    40000,
    2000,
    10000,
    250000,
    800000 + (n*1500),
    ELT((n % 2)+1,'Finance','NEFT'),
    'HDFC Bank',
    600000,
    200000,
    CONCAT('INV-',n),
    CURDATE()
FROM numbers;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- DASHBOARD LIVE DATA — uses CURDATE() so stats are always non-zero
-- ============================================================

-- ============================================================
-- BOOKINGS TODAY (booking_date = CURDATE())
-- Linked to existing customers, variants, dealerships, sales execs
-- ============================================================
INSERT IGNORE INTO bookings (booking_number, customer_id, vehicle_id, variant_id, dealership_id, sales_executive_id, booking_amount, total_amount, booking_date, expected_delivery_date, status, payment_mode, remarks) VALUES
('HYN-TODAY-001', 1,  NULL, 3,  1,  6,  50000.00,  1545000.00, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 30 DAY), 'CONFIRMED', 'UPI',    'Creta SX CVT – walk-in customer today'),
('HYN-TODAY-002', 3,  NULL, 7,  2,  8,  25000.00,  1199000.00, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 25 DAY), 'CONFIRMED', 'NEFT',   'Venue SX Turbo – referred by existing customer'),
('HYN-TODAY-003', 5,  NULL, 5,  1,  7,  50000.00,  1560000.00, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 35 DAY), 'PENDING',   'Cash',   'Creta SX Diesel – test drive done, booking confirmed'),
('HYN-TODAY-004', 8,  NULL, 12, 4,  12, 20000.00,  1150000.00, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 20 DAY), 'CONFIRMED', 'UPI',    'Verna EX – first-time buyer'),
('HYN-TODAY-005', 10, NULL, 14, 5,  14, 15000.00,   835000.00, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 28 DAY), 'CONFIRMED', 'UPI',    'Exter S AMT – compact city car preference');

-- ============================================================
-- DISPATCH RECORDS THIS MONTH (dispatch_date within current month)
-- dispatched_by references user IDs that exist (sales execs: 6,7,8,9,10)
-- ============================================================
INSERT IGNORE INTO dispatch_records (booking_id, vehicle_id, customer_id, dispatch_date, dispatch_time, dispatched_by, delivery_location, odometer_reading, fuel_level, documents_handed_over, keys_handed_over, customer_signature, remarks) VALUES
(4,  7,  4,  DATE_FORMAT(CURDATE(), '%Y-%m-01'), '10:00:00', 6,  '7, Venkatesa Agraharam St, Chennai',    12, 'Full', TRUE, TRUE, TRUE, 'Re-dispatch record for current month dashboard'),
(9,  16, 9,  DATE_FORMAT(CURDATE(), '%Y-%m-05'), '11:30:00', 9,  '3/150, Viram Khand, Gomti Nagar, Lucknow', 15, 'Full', TRUE, TRUE, TRUE, 'i20 N Line delivered to Alok Srivastava'),
(10, 19, 10, DATE_FORMAT(CURDATE(), '%Y-%m-08'), '14:00:00', 20, 'H.No 245, Sector 20, Chandigarh',       10, 'Full', TRUE, TRUE, TRUE, 'Venue E delivered to Gurjit Kaur'),
(6,  10, 6,  DATE_FORMAT(CURDATE(), '%Y-%m-10'), '09:30:00', 14, '12, Panchvati Society, CG Rd, Ahmedabad', 8, 'Full', TRUE, TRUE, TRUE, 'Exter AMT delivered to Hitaben Shah'),
(11, 18, 12, DATE_FORMAT(CURDATE(), '%Y-%m-12'), '12:00:00', 2,  '102, Pride Icon, Baner, Pune',           9, 'Full', TRUE, TRUE, TRUE, 'Creta S delivered to Vikas Kulkarni');

-- ============================================================
-- SALES TRANSACTIONS THIS MONTH (sale_date within current month)
-- invoice_number must be unique — using CURMONTH prefix
-- ============================================================
INSERT IGNORE INTO sales_transactions (booking_id, vehicle_id, customer_id, dealership_id, sales_executive_id, sale_date, vehicle_price, accessories_price, insurance_amount, registration_charges, other_charges, discount_amount, exchange_value, total_amount, payment_mode, finance_company, loan_amount, down_payment, invoice_number, invoice_date) VALUES
(4,  7,  4,  3,  10, DATE_FORMAT(CURDATE(), '%Y-%m-01'), 785000.00,   699.00,  25000.00,  32000.00, 2000.00, 10000.00, 0.00,       834699.00,  'Finance', 'ICICI Bank',          620000.00, 214699.00, CONCAT('INV-CM-', DATE_FORMAT(CURDATE(), '%Y%m'), '-001'), DATE_FORMAT(CURDATE(), '%Y-%m-01')),
(9,  16, 9,  9,  9,  DATE_FORMAT(CURDATE(), '%Y-%m-05'), 1350000.00,  0.00,    42000.00,  52000.00, 2500.00, 20000.00, 500000.00,  926500.00,  'Finance', 'Kotak Mahindra Bank', 700000.00, 226500.00, CONCAT('INV-CM-', DATE_FORMAT(CURDATE(), '%Y%m'), '-002'), DATE_FORMAT(CURDATE(), '%Y-%m-05')),
(10, 19, 10, 11, 20, DATE_FORMAT(CURDATE(), '%Y-%m-08'), 840000.00,   950.00,  26000.00,  33000.00, 1500.00, 0.00,     400000.00,  501450.00,  'Finance', 'HDFC Bank',           400000.00, 101450.00, CONCAT('INV-CM-', DATE_FORMAT(CURDATE(), '%Y%m'), '-003'), DATE_FORMAT(CURDATE(), '%Y-%m-08')),
(6,  10, 6,  5,  14, DATE_FORMAT(CURDATE(), '%Y-%m-10'), 835000.00,   4700.00, 27000.00,  34000.00, 1500.00, 10000.00, 120000.00,  772200.00,  'Finance', 'Bajaj Finserv',       600000.00, 172200.00, CONCAT('INV-CM-', DATE_FORMAT(CURDATE(), '%Y%m'), '-004'), DATE_FORMAT(CURDATE(), '%Y-%m-10')),
(11, 18, 12, 10, 2,  DATE_FORMAT(CURDATE(), '%Y-%m-12'), 1250000.00,  0.00,    39000.00,  50000.00, 2000.00, 25000.00, 340000.00,  976000.00,  'Finance', 'ICICI Bank',          750000.00, 226000.00, CONCAT('INV-CM-', DATE_FORMAT(CURDATE(), '%Y%m'), '-005'), DATE_FORMAT(CURDATE(), '%Y-%m-12'));

-- ============================================================
-- TODAY'S TEST DRIVES — scheduled_date = CURDATE()
-- vehicle_id references vehicles that exist in seed data
-- ============================================================
INSERT IGNORE INTO test_drives (customer_id, vehicle_id, dealership_id, sales_executive_id, scheduled_date, scheduled_time, status, feedback) VALUES
(1,  1,  1,  6,  CURDATE(), '10:00:00', 'SCHEDULED', NULL),
(3,  6,  3,  10, CURDATE(), '11:30:00', 'SCHEDULED', NULL),
(5,  3,  1,  7,  CURDATE(), '14:00:00', 'SCHEDULED', NULL),
(8,  8,  4,  12, CURDATE(), '15:30:00', 'SCHEDULED', NULL),
(10, 19, 11, 20, CURDATE(), '16:30:00', 'SCHEDULED', NULL);

-- ============================================================
-- 16. APRIL 2026 DASHBOARD LIVE DATA
-- ============================================================
SET SESSION sql_mode = '';
SET FOREIGN_KEY_CHECKS = 0;

-- Ad-hoc bookings for today (simulated date: 2026-04-14)
INSERT IGNORE INTO bookings (booking_number, customer_id, vehicle_id, variant_id, dealership_id, sales_executive_id, booking_amount, total_amount, booking_date, expected_delivery_date, status, payment_mode, remarks) VALUES
('B-2026-APR-001', 1, NULL, 3, 1, 6, 50000.00, 1545000.00, '2026-04-14', '2026-05-14', 'CONFIRMED', 'UPI', 'April Sample Booking 1'),
('B-2026-APR-002', 2, NULL, 7, 1, 7, 25000.00, 1199000.00, '2026-04-14', '2026-05-10', 'CONFIRMED', 'NEFT', 'April Sample Booking 2'),
('B-2026-APR-003', 3, NULL, 4, 1, 6, 75000.00, 1950000.00, '2026-04-14', '2026-05-20', 'PENDING', 'Bank Transfer', 'April Sample Booking 3'),
('B-2026-APR-004', 4, NULL, 1, 1, 8, 30000.00, 1099000.00, '2026-04-14', '2026-05-05', 'CONFIRMED', 'UPI', 'April Sample Booking 4'),
('B-2026-APR-005', 5, NULL, 2, 1, 9, 20000.00, 1250000.00, '2026-04-14', '2026-05-15', 'CONFIRMED', 'NEFT', 'April Sample Booking 5');

-- Ensure some existing bookings have current dates for metrics
UPDATE bookings SET booking_date = '2026-04-14' WHERE booking_id IN (1, 2, 3, 4, 5);

-- Dispatches (Deliveries) for April 2026
INSERT IGNORE INTO dispatch_records (booking_id, vehicle_id, customer_id, dispatch_date, dispatch_time, dispatched_by, delivery_location, odometer_reading, fuel_level, documents_handed_over, keys_handed_over, customer_signature, remarks) VALUES
(1, 1, 1, '2026-04-10', '10:00:00', 6, 'Ramesh Nagar, New Delhi', 10, 'Full', TRUE, TRUE, TRUE, 'April Delivery 1'),
(2, 4, 2, '2026-04-12', '11:30:00', 7, 'Thane, Mumbai', 15, 'Full', TRUE, TRUE, TRUE, 'April Delivery 2'),
(3, 6, 3, '2026-04-14', '14:00:00', 6, 'Indiranagar, Bengaluru', 12, 'Full', TRUE, TRUE, TRUE, 'April Delivery 3');

-- Sales Transactions for Revenue (April 2026)
INSERT IGNORE INTO sales_transactions (booking_id, vehicle_id, customer_id, dealership_id, sales_executive_id, sale_date, vehicle_price, accessories_price, insurance_amount, registration_charges, other_charges, discount_amount, exchange_value, total_amount, payment_mode, finance_company, loan_amount, down_payment, invoice_number, invoice_date) VALUES
(1, 1, 1, 1, 6, '2026-04-10', 1099000.00, 5000.00, 35000.00, 45000.00, 2000.00, 10000.00, 0.00, 1176000.00, 'NEFT', NULL, 0.00, 1176000.00, 'INV-APR-001', '2026-04-10'),
(2, 4, 2, 1, 7, '2026-04-12', 1250000.00, 8000.00, 40000.00, 50000.00, 2500.00, 15000.00, 200000.00, 1135500.00, 'Finance', 'HDFC', 800000.00, 335500.00, 'INV-APR-002', '2026-04-12'),
(3, 6, 3, 1, 6, '2026-04-14', 1545000.00, 12000.00, 45000.00, 60000.00, 3000.00, 20000.00, 0.00, 1645000.00, 'NEFT', NULL, 0.00, 1645000.00, 'INV-APR-003', '2026-04-14');

-- Sync vehicle status
UPDATE vehicles SET status = 'SOLD' WHERE vehicle_id IN (1, 4, 6);

SET FOREIGN_KEY_CHECKS = 1;

