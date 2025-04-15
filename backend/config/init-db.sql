-- 데이터베이스 생성
CREATE DATABASE IF NOT EXISTS awana_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE awana_db;

-- 문자셋 설정
SET NAMES utf8mb4;
SET character_set_client = utf8mb4;

-- 기존 테이블 삭제
DROP TABLE IF EXISTS EventDB;
DROP TABLE IF EXISTS ChurchDB;
DROP TABLE IF EXISTS ReceiptDB;

-- 이벤트 테이블 생성
CREATE TABLE EventDB (
  event_ID INT AUTO_INCREMENT PRIMARY KEY,
  event_Name VARCHAR(100) NOT NULL,
  event_Location VARCHAR(100) NOT NULL,
  event_Year INT,
  event_Date DATE,
  event_Open_Available BOOLEAN NOT NULL DEFAULT FALSE,
  event_Place VARCHAR(200) NOT NULL,
  event_Month VARCHAR(10)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 교회 테이블 생성
CREATE TABLE ChurchDB (
  church_reg_ID VARCHAR(50) PRIMARY KEY,
  church_sub_ID VARCHAR(50),
  church_Name VARCHAR(100) NOT NULL,
  church_Location VARCHAR(200) NOT NULL
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 영수증 테이블 생성
CREATE TABLE ReceiptDB (
  receipt_ID INT AUTO_INCREMENT PRIMARY KEY,
  event_ID INT NOT NULL,
  church_reg_ID VARCHAR(50) NOT NULL,
  receipt_Date DATE NOT NULL,
  receipt_Amount INT NOT NULL,
  receipt_Payment_Method VARCHAR(50) NOT NULL,
  FOREIGN KEY (event_ID) REFERENCES EventDB(event_ID),
  FOREIGN KEY (church_reg_ID) REFERENCES ChurchDB(church_reg_ID)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 관리자 테이블
CREATE TABLE IF NOT EXISTS ManagerDB (
  manager_ID INT AUTO_INCREMENT PRIMARY KEY,
  manager_Name VARCHAR(100) NOT NULL,
  manager_Phone VARCHAR(20) NOT NULL,
  manager_Mail VARCHAR(100),
  manager_Bank VARCHAR(50),
  manager_Account VARCHAR(50)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 이벤트-교회 관계 테이블
CREATE TABLE IF NOT EXISTS `Event-ChurchDB` (
  id INT AUTO_INCREMENT PRIMARY KEY,
  event_ID INT NOT NULL,
  church_ID INT NOT NULL,
  manager_ID INT NOT NULL,
  part_total INT NOT NULL DEFAULT 0,
  part_student INT NOT NULL DEFAULT 0,
  part_teacher INT NOT NULL DEFAULT 0,
  part_ym INT NOT NULL DEFAULT 0,
  costs INT NOT NULL DEFAULT 0,
  FOREIGN KEY (event_ID) REFERENCES EventDB(event_ID),
  FOREIGN KEY (church_ID) REFERENCES ChurchDB(church_ID),
  FOREIGN KEY (manager_ID) REFERENCES ManagerDB(manager_ID)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 이벤트-교회-회원 테이블
CREATE TABLE IF NOT EXISTS `Event-Church-MemberDB` (
  id INT AUTO_INCREMENT PRIMARY KEY,
  event_church_id INT NOT NULL,
  part_Name VARCHAR(100) NOT NULL,
  part_Phone VARCHAR(20) NOT NULL,
  belong VARCHAR(50) NOT NULL,
  state_add BOOLEAN NOT NULL DEFAULT FALSE,
  state_edit BOOLEAN NOT NULL DEFAULT FALSE,
  state_memo TEXT,
  FOREIGN KEY (event_church_id) REFERENCES `Event-ChurchDB`(id)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 새로운 이벤트 데이터 추가
INSERT INTO EventDB (event_ID, event_Name, event_Location, event_Year, event_Date, event_Open_Available, event_Place, event_Month) VALUES
(1, '성경퀴즈대회', '미정', NULL, NULL, false, '미정', '1월'),
(2, 'YM Summit', '미정', NULL, NULL, false, '미정', '1월'),
(3, '상반기 연합 BT', '미정', NULL, NULL, false, '미정', '2월'),
(4, '컨퍼런스', '미정', NULL, NULL, false, '미정', '3월'),
(5, '올림픽 설명회', '미정', NULL, NULL, false, '미정', '4월'),
(6, '올림픽', '미정', NULL, NULL, false, '미정', '5월'),
(7, '조정관 학교 101', '미정', NULL, NULL, false, '미정', '6월'),
(8, '조정관 학교 201', '미정', NULL, NULL, false, '미정', '6월'),
(9, 'T&T Camp', '미정', NULL, NULL, false, '미정', '7월'),
(10, '감독관 학교 101', '미정', NULL, NULL, false, '미정', '8월'),
(11, 'YM MIT', '미정', NULL, NULL, false, '미정', '8월'),
(12, '하반기 연합 BT', '미정', NULL, NULL, false, '미정', '9월'),
(13, '영성수련회', '미정', NULL, NULL, false, '미정', '10월'),
(14, '성경퀴즈대회 설명회', '미정', NULL, NULL, false, '미정', '11월'),
(15, '비전캠프', '미정', NULL, NULL, false, '미정', '12월'),
(16, '장학캠프', '미정', NULL, NULL, false, '미정', '미정'),
(17, '수시 BT', '미정', NULL, NULL, false, '미정', '미정');

-- 테스트 교회 데이터 추가
INSERT INTO ChurchDB (church_reg_ID, church_sub_ID, church_Name, church_Location) VALUES
('001', 'A', '서울중앙교회', '서울특별시 중구'),
('002', 'A', '부산중앙교회', '부산광역시 중구'),
('003', 'A', '대전중앙교회', '대전광역시 중구');

INSERT INTO ManagerDB (manager_Name, manager_Phone, manager_Mail, manager_Bank, manager_Account)
VALUES 
  ('김관리', '010-1234-5678', 'manager1@example.com', '신한은행', '123-456-789012'),
  ('이관리', '010-2345-6789', 'manager2@example.com', '국민은행', '234-567-890123'),
  ('박관리', '010-3456-7890', 'manager3@example.com', '우리은행', '345-678-901234');

-- 테스트 데이터 추가
INSERT INTO EventDB (event_Name, event_Location, event_Year, event_Date, event_Open_Available, event_Place) VALUES
('영성수련회', '서울', 2024, '2024-05-01', true, '서울특별시 강남구'),
('성경퀴즈대회', '부산', 2024, '2024-06-15', true, '부산광역시 해운대구'),
('YM Summit', '대전', 2024, '2024-07-20', true, '대전광역시 유성구'),
('컨퍼런스', '서울', 2024, '2024-08-10', true, '서울특별시 송파구'),
('상반기 비티', '인천', 2024, '2024-03-15', false, '인천광역시 연수구');

-- 테스트 교회 데이터 추가
INSERT INTO ChurchDB (church_reg_ID, church_sub_ID, church_Name, church_Location) VALUES
('001', 'A', '서울중앙교회', '서울특별시 중구'),
('002', 'A', '부산중앙교회', '부산광역시 중구'),
('003', 'A', '대전중앙교회', '대전광역시 중구'); 