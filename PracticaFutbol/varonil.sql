-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 12, 2025 at 02:43 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `yabasta`
--

-- --------------------------------------------------------

--
-- Table structure for table `varonil`
--

CREATE TABLE `varonil` (
  `nombre` varchar(256) NOT NULL,
  `apellido` varchar(256) NOT NULL,
  `correo` varchar(256) NOT NULL,
  `sexo` varchar(256) NOT NULL,
  `numeroTelefono` bigint(15) NOT NULL,
  `numeroDorsal` int(15) NOT NULL,
  `nombreEquipo` varchar(256) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `varonil`
--

INSERT INTO `varonil` (`nombre`, `apellido`, `correo`, `sexo`, `numeroTelefono`, `numeroDorsal`, `nombreEquipo`) VALUES
('Osvaldo', 'Ramiro', 'fabian@gmail.com', 'Masculino', 2147483647, 13, 'Chivas'),
('Myranda', 'Infante', 'infante@gmail.com', 'Femenino', 8756465783, 7, 'Monterrey'),
('marioooo', 'kkh', 'jjk@hh.jj', 'Masculino', 65465, 565, 'Monterrey');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
