-- Create database
CREATE DATABASE IF NOT EXISTS awana_db;
USE awana_db;

-- Set character set and collation
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;
SET character_set_connection=utf8mb4;

-- Create churchdb table
CREATE TABLE IF NOT EXISTS `churchdb` (
  `church_ID` int NOT NULL AUTO_INCREMENT,
  `church_reg_ID` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `church_sub_ID` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `church_Name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `church_Location` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`church_ID`),
  KEY `idx_church_reg_id` (`church_reg_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create eventdb table
CREATE TABLE IF NOT EXISTS `eventdb` (
  `event_ID` int NOT NULL AUTO_INCREMENT,
  `event_Name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `event_Location` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `event_Year` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `event_Start_Date` date DEFAULT NULL,
  `event_End_Date` date DEFAULT NULL,
  `event_Registration_Start_Date` date DEFAULT NULL,
  `event_Registration_End_Date` date DEFAULT NULL,
  `event_Open_Available` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '비공개',
  `event_Place` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `event_Month` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `event_Description` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`event_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create managerdb table
CREATE TABLE IF NOT EXISTS `managerdb` (
  `manager_ID` int NOT NULL AUTO_INCREMENT,
  `manager_Name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `manager_Phone` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `manager_Mail` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `manager_Bank` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `manager_Account` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`manager_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create event-churchdb table
CREATE TABLE IF NOT EXISTS `event-churchdb` (
  `id` int NOT NULL AUTO_INCREMENT,
  `event_ID` int NOT NULL,
  `church_ID` int NOT NULL,
  `manager_ID` int NOT NULL,
  `part_total` int NOT NULL DEFAULT '0',
  `part_student` int NOT NULL DEFAULT '0',
  `part_teacher` int NOT NULL DEFAULT '0',
  `part_ym` int NOT NULL DEFAULT '0',
  `costs` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `event_ID` (`event_ID`),
  KEY `church_ID` (`church_ID`),
  KEY `manager_ID` (`manager_ID`),
  CONSTRAINT `event-churchdb_ibfk_1` FOREIGN KEY (`event_ID`) REFERENCES `eventdb` (`event_ID`),
  CONSTRAINT `event-churchdb_ibfk_2` FOREIGN KEY (`church_ID`) REFERENCES `churchdb` (`church_ID`),
  CONSTRAINT `event-churchdb_ibfk_3` FOREIGN KEY (`manager_ID`) REFERENCES `managerdb` (`manager_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create event-church-memberdb table
CREATE TABLE IF NOT EXISTS `event-church-memberdb` (
  `id` int NOT NULL AUTO_INCREMENT,
  `event_church_id` int NOT NULL,
  `part_Name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `part_Phone` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `belong` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `state_add` tinyint(1) NOT NULL DEFAULT '0',
  `state_edit` tinyint(1) NOT NULL DEFAULT '0',
  `state_memo` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  KEY `event_church_id` (`event_church_id`),
  CONSTRAINT `event-church-memberdb_ibfk_1` FOREIGN KEY (`event_church_id`) REFERENCES `event-churchdb` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create receiptdb table
CREATE TABLE IF NOT EXISTS `receiptdb` (
  `receipt_ID` int NOT NULL AUTO_INCREMENT,
  `event_ID` int NOT NULL,
  `church_ID` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `receipt_Date` date NOT NULL,
  `receipt_Amount` int NOT NULL,
  `receipt_Of` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '영수증 지정인',
  `receipt_Participants` text COLLATE utf8mb4_unicode_ci COMMENT '비고',
  PRIMARY KEY (`receipt_ID`),
  KEY `event_ID` (`event_ID`),
  KEY `ReceiptDB_ibfk_2` (`church_ID`),
  CONSTRAINT `receiptdb_ibfk_1` FOREIGN KEY (`event_ID`) REFERENCES `eventdb` (`event_ID`),
  CONSTRAINT `receiptdb_ibfk_2` FOREIGN KEY (`church_ID`) REFERENCES `churchdb` (`church_reg_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create sampleeventdb table
CREATE TABLE IF NOT EXISTS `sampleeventdb` (
  `sampleEvent_ID` int NOT NULL AUTO_INCREMENT,
  `sampleEvent_Name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sampleEvent_Location` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sampleEvent_Year` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sampleEvent_Start_Date` date DEFAULT NULL,
  `sampleEvent_End_Date` date DEFAULT NULL,
  `sampleEvent_Registration_Start_Date` date DEFAULT NULL,
  `sampleEvent_Registration_End_Date` date DEFAULT NULL,
  `sampleEvent_Open_Available` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '비공개',
  `sampleEvent_Place` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sampleEvent_Month` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sampleEvent_Description` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`sampleEvent_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci; 