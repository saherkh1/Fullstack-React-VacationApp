-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 31, 2021 at 09:03 PM
-- Server version: 10.4.20-MariaDB
-- PHP Version: 8.0.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `vacations`
--

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `firstName` varchar(20) NOT NULL,
  `lastName` varchar(20) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `firstName`, `lastName`, `username`, `password`) VALUES
(1, 'saher', 'khateeb', 'saherkh', '12345'),
(2, 'sa', 'kh', 'saherkh1', '12345'),
(3, 'miss', 'piggy', 'miss-piggy', '145a182d9b7b069006c275d15a41e762ed9ae904c4886b4a9ffea346c44ec7c3d649b1416cb687d2fcc0e885b6da08acc6db9507c9e80c399927911f4a6ffb5b'),
(4, 'saher', 'khateeb', 'saherkh12', '145a182d9b7b069006c275d15a41e762ed9ae904c4886b4a9ffea346c44ec7c3d649b1416cb687d2fcc0e885b6da08acc6db9507c9e80c399927911f4a6ffb5b'),
(5, 'saher', 'khateeb', 'saher-khateeb@hotmail.com', '145a182d9b7b069006c275d15a41e762ed9ae904c4886b4a9ffea346c44ec7c3d649b1416cb687d2fcc0e885b6da08acc6db9507c9e80c399927911f4a6ffb5b');

-- --------------------------------------------------------

--
-- Table structure for table `vacation`
--

CREATE TABLE `vacation` (
  `vacationId` int(11) NOT NULL,
  `description` varchar(255) NOT NULL,
  `destination` varchar(100) NOT NULL,
  `image` varchar(100) NOT NULL,
  `startTime` datetime NOT NULL,
  `endTime` datetime NOT NULL,
  `price` float NOT NULL,
  `followersCount` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `vacation`
--

INSERT INTO `vacation` (`vacationId`, `description`, `destination`, `image`, `startTime`, `endTime`, `price`, `followersCount`) VALUES
(16, 'we are not going to have fun', 'luna park', '9661e0fb-cad7-4643-a1d3-a55c0f5f619b.jfif', '2021-09-01 08:00:00', '2021-09-01 13:00:00', 300, 0),
(17, 'we are going to swim', 'luna gal', '5d170466-28ed-41cc-8cd1-cb312ca267bf.jpg', '2021-08-31 09:00:00', '2021-08-31 21:00:00', 400, 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `vacation`
--
ALTER TABLE `vacation`
  ADD PRIMARY KEY (`vacationId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `vacation`
--
ALTER TABLE `vacation`
  MODIFY `vacationId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
