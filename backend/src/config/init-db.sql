-- 데이터베이스 생성
CREATE DATABASE IF NOT EXISTS awana_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE awana_db;

-- 문자셋 설정
SET NAMES utf8mb4;
SET character_set_client = utf8mb4;

-- 이벤트 테이블
CREATE TABLE IF NOT EXISTS EventDB (
  event_ID INT AUTO_INCREMENT PRIMARY KEY,
  event_Name VARCHAR(100) NOT NULL,
  event_Location VARCHAR(200) NOT NULL,
  event_Year INT NOT NULL,
  event_Date DATE NOT NULL,
  event_Open_Available BOOLEAN NOT NULL DEFAULT TRUE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 교회 테이블
CREATE TABLE IF NOT EXISTS ChurchDB (
  church_ID INT AUTO_INCREMENT PRIMARY KEY,
  church_reg_ID VARCHAR(3) NOT NULL,
  church_sub_ID VARCHAR(1) NOT NULL DEFAULT 'a',
  church_Name VARCHAR(100) NOT NULL,
  church_Location VARCHAR(200) NOT NULL
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

-- 샘플 데이터 삽입
INSERT INTO EventDB (event_Name, event_Location, event_Year, event_Date, event_Open_Available)
VALUES 
  ('영성수련회', '서울', 2023, '2023-07-15', TRUE),
  ('성경퀴즈대회 설명회', '부산', 2023, '2023-08-20', TRUE),
  ('성경퀴즈대회', '대구', 2023, '2023-09-10', TRUE);

INSERT INTO ChurchDB (church_reg_ID, church_sub_ID, church_Name, church_Location)
VALUES 
  ('001', 'a', '서울교회', '서울시 강남구'),
  ('002', 'a', '부산교회', '부산시 해운대구'),
  ('003', 'a', '대구교회', '대구시 중구');

INSERT INTO ManagerDB (manager_Name, manager_Phone, manager_Mail, manager_Bank, manager_Account)
VALUES 
  ('김관리', '010-1234-5678', 'manager1@example.com', '신한은행', '123-456-789012'),
  ('이관리', '010-2345-6789', 'manager2@example.com', '국민은행', '234-567-890123'),
  ('박관리', '010-3456-7890', 'manager3@example.com', '우리은행', '345-678-901234'); 