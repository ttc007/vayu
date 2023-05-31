-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th5 31, 2023 lúc 06:17 AM
-- Phiên bản máy phục vụ: 10.4.22-MariaDB
-- Phiên bản PHP: 8.1.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `covay`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `room`
--

CREATE TABLE `room` (
  `id` int(11) NOT NULL,
  `status` varchar(50) COLLATE utf8mb4_vietnamese_ci NOT NULL DEFAULT 'wait',
  `moves` text COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `turn_playing` tinyint(4) DEFAULT NULL,
  `timer` int(11) DEFAULT NULL,
  `messages` text COLLATE utf8mb4_vietnamese_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

--
-- Đang đổ dữ liệu cho bảng `room`
--

INSERT INTO `room` (`id`, `status`, `moves`, `turn_playing`, `timer`, `messages`) VALUES
(24, 'wait', '[]', 0, 0, '[{\"sender\":\"Vũ Văn Càn Khôn\",\"content\":\"Nhường đó\"},{\"sender\":\"Thái Hư Tử\",\"content\":\"Này thì nhường\"},{\"sender\":\"Bộ Kinh Vân\",\"content\":\"Thái Hư Tử gà quá\"},{\"sender\":\"Thái Hư Tử\",\"content\":\"Lag\"},{\"sender\":\"Vũ Văn Càn Khôn\",\"content\":\"hi\"},{\"sender\":\"Thái Hư Tử\",\"content\":\"Chào\"},{\"sender\":\"Thái Hư Tử\",\"content\":\"Hello\"},{\"sender\":\"Vũ Văn Càn Khôn\",\"content\":\"Hi\"}]'),
(25, 'wait', '[]', 0, 0, '[{\"sender\":\"Thái Hư Tử\",\"content\":\"Alo\"}]'),
(26, 'wait', '[]', 0, 0, NULL),
(27, 'wait', '[]', 0, 0, NULL),
(28, 'wait', '[]', 0, 0, NULL),
(29, 'wait', '[]', 0, 0, NULL),
(30, 'wait', '[]', 0, 0, '[{\"sender\":\"Bộ Kinh Vân\",\"content\":\"hello\"},{\"sender\":\"Vũ Văn Càn Khôn\",\"content\":\"Gì vậy\"}]'),
(31, 'wait', '[]', 0, 0, NULL),
(32, 'wait', '[]', 0, 0, NULL),
(33, 'wait', '[]', 0, 0, NULL),
(34, 'wait', '[]', 0, 0, NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `room_user`
--

CREATE TABLE `room_user` (
  `room_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `status` varchar(255) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `color` tinyint(4) DEFAULT NULL,
  `score` int(11) DEFAULT 0,
  `move_count` int(11) DEFAULT 0,
  `wait_time` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `username` varchar(255) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `elo` int(100) NOT NULL DEFAULT 1000,
  `email` varchar(255) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

--
-- Đang đổ dữ liệu cho bảng `user`
--

INSERT INTO `user` (`id`, `name`, `username`, `password`, `elo`, `email`) VALUES
(1, 'Thái Hư Tử', 'Player1', '123456', 883, '54'),
(2, 'Vũ Văn Càn Khôn', 'Player2', '123456', 1138, '87'),
(3, 'Bộ Kinh Vân', 'Player3', '123456', 1000, NULL),
(4, 'An Hưởng Tuổi Già', 'player4', '123456', 1000, 'anhuong@mail.com'),
(5, 'Truong Thanh Cong', 'player16', '123456', 1000, 'sk_admin@mail'),
(6, 'Truong Thanh Cong', 'player151', '123456', 1000, 'sk_admin@mail1'),
(7, 'Điều khiển quạt', 'player1123', '123456', 1000, 'sk_admin@mail123'),
(8, 'Trương Thành Công', 'player7', '123456', 1000, 'truongthanhcong1909@gmail.com'),
(9, '', '', '', 1000, ''),
(10, 'Đỗ Thị', 'player25', '123456', 1000, 'truong@mail.com'),
(11, 'Đỗ ThịT', 'player34', '123456', 1000, 't@mail.com'),
(12, 'Táo đỏ của tôi', 'player1666', '123456', 1000, 'sk_admin@mail.com'),
(13, 'Hoa sen', 'player112aaa', '123456', 1000, 'admin1@mail.com'),
(14, 'Trương Hàn Phong', 'player166666', '123456', 1000, 'hoanhon_attp1@gmail.com'),
(15, 'An Hưởng Tuổi aGià', 'player17777', '123456', 1000, 'sk_admin1@mail.com'),
(16, 'Hoa sen H', 'player16677664', '123456', 1000, 'h@mail.com');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `room`
--
ALTER TABLE `room`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`,`username`,`email`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `room`
--
ALTER TABLE `room`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT cho bảng `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
