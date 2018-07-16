# Create DB
CREATE DATABASE IF NOT EXISTS `test` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;

USE `test`;

# Create Table
CREATE TABLE `tbl` (`id` int(10) unsigned NOT NULL AUTO_INCREMENT, `value` varchar(255) DEFAULT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB;
CREATE TABLE `tbl_json` (`id` int(10) unsigned NOT NULL AUTO_INCREMENT, `value` json DEFAULT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB;
