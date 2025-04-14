-- MySQL dump 10.13  Distrib 8.0.37, for Win64 (x86_64)
--
-- Host: localhost    Database: awana_db
-- ------------------------------------------------------
-- Server version	8.0.37

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `churchdb`
--

DROP TABLE IF EXISTS `churchdb`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `churchdb` (
  `church_ID` int NOT NULL AUTO_INCREMENT,
  `church_reg_ID` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `church_sub_ID` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `church_Name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `church_Location` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`church_ID`),
  KEY `idx_church_reg_id` (`church_reg_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `churchdb`
--

LOCK TABLES `churchdb` WRITE;
/*!40000 ALTER TABLE `churchdb` DISABLE KEYS */;
INSERT INTO `churchdb` VALUES (1,'0000','a','테스트교회','임시 테스트구 입니동');
/*!40000 ALTER TABLE `churchdb` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `event-church-memberdb`
--

DROP TABLE IF EXISTS `event-church-memberdb`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `event-church-memberdb` (
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event-church-memberdb`
--

LOCK TABLES `event-church-memberdb` WRITE;
/*!40000 ALTER TABLE `event-church-memberdb` DISABLE KEYS */;
/*!40000 ALTER TABLE `event-church-memberdb` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `event-churchdb`
--

DROP TABLE IF EXISTS `event-churchdb`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `event-churchdb` (
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event-churchdb`
--

LOCK TABLES `event-churchdb` WRITE;
/*!40000 ALTER TABLE `event-churchdb` DISABLE KEYS */;
/*!40000 ALTER TABLE `event-churchdb` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `eventdb`
--

DROP TABLE IF EXISTS `eventdb`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `eventdb` (
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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `eventdb`
--

LOCK TABLES `eventdb` WRITE;
/*!40000 ALTER TABLE `eventdb` DISABLE KEYS */;
INSERT INTO `eventdb` VALUES (2,'올림픽','미정','2025','2025-05-17','2025-05-17','2025-04-24','2025-04-29','공개','미정','5월',NULL),(4,'YM Summit 2025','미정','2025','2025-07-17','2025-07-19','2025-06-17','2025-06-19','0','미정','7',NULL);
/*!40000 ALTER TABLE `eventdb` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `managerdb`
--

DROP TABLE IF EXISTS `managerdb`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `managerdb` (
  `manager_ID` int NOT NULL AUTO_INCREMENT,
  `manager_Name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `manager_Phone` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `manager_Mail` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `manager_Bank` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `manager_Account` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`manager_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `managerdb`
--

LOCK TABLES `managerdb` WRITE;
/*!40000 ALTER TABLE `managerdb` DISABLE KEYS */;
/*!40000 ALTER TABLE `managerdb` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `receiptdb`
--

DROP TABLE IF EXISTS `receiptdb`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `receiptdb` (
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
  CONSTRAINT `ReceiptDB_ibfk_2` FOREIGN KEY (`church_ID`) REFERENCES `churchdb` (`church_reg_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `receiptdb`
--

LOCK TABLES `receiptdb` WRITE;
/*!40000 ALTER TABLE `receiptdb` DISABLE KEYS */;
INSERT INTO `receiptdb` VALUES (3,2,'0000','2025-04-14',100000,'피은택','2팀'),(4,4,'0000','2025-04-25',200000,'김승정','피은택');
/*!40000 ALTER TABLE `receiptdb` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sampleeventdb`
--

DROP TABLE IF EXISTS `sampleeventdb`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sampleeventdb` (
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
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sampleeventdb`
--

LOCK TABLES `sampleeventdb` WRITE;
/*!40000 ALTER TABLE `sampleeventdb` DISABLE KEYS */;
INSERT INTO `sampleeventdb` VALUES (1,'성경퀴즈대회','미정','미정',NULL,NULL,NULL,NULL,'비공개','미정','1월',NULL),(2,'YM Summit','미정','미정',NULL,NULL,NULL,NULL,'비공개','미정','1월',NULL),(3,'상반기 연합 BT','미정','미정',NULL,NULL,NULL,NULL,'비공개','미정','2월',NULL),(4,'컨퍼런스','미정','미정',NULL,NULL,NULL,NULL,'비공개','미정','3월',NULL),(5,'올림픽 설명회','미정','미정',NULL,NULL,NULL,NULL,'비공개','미정','4월',NULL),(6,'올림픽','미정','미정',NULL,NULL,NULL,NULL,'비공개','미정','5월',NULL),(7,'조정관 학교 101','미정','미정',NULL,NULL,NULL,NULL,'비공개','미정','6월',NULL),(8,'조정관 학교 201','미정','미정',NULL,NULL,NULL,NULL,'비공개','미정','6월',NULL),(9,'T&T Camp','미정','미정',NULL,NULL,NULL,NULL,'비공개','미정','7월',NULL),(10,'감독관 학교 101','미정','미정',NULL,NULL,NULL,NULL,'비공개','미정','8월',NULL),(11,'YM MIT','미정','미정',NULL,NULL,NULL,NULL,'비공개','미정','8월',NULL),(12,'하반기 연합 BT','미정','미정',NULL,NULL,NULL,NULL,'비공개','미정','9월',NULL),(13,'영성수련회','미정','미정',NULL,NULL,NULL,NULL,'비공개','미정','10월',NULL),(14,'성경퀴즈대회 설명회','미정','미정',NULL,NULL,NULL,NULL,'비공개','미정','11월',NULL),(15,'비전캠프','미정','미정',NULL,NULL,NULL,NULL,'비공개','미정','12월',NULL),(16,'장학캠프','미정','미정',NULL,NULL,NULL,NULL,'비공개','미정','미정',NULL),(17,'수시 BT','미정','미정',NULL,NULL,NULL,NULL,'비공개','미정','미정',NULL);
/*!40000 ALTER TABLE `sampleeventdb` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-14 12:35:57
