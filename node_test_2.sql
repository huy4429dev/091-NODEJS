-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th4 01, 2021 lúc 04:35 PM
-- Phiên bản máy phục vụ: 10.4.17-MariaDB
-- Phiên bản PHP: 8.0.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `node_test_2`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `contacts`
--

CREATE TABLE `contacts` (
  `id` int(11) NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fullname` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(11) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subject` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `note` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `contactStatus` tinyint(4) NOT NULL,
  `createTime` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updateTime` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `orderdetails`
--

CREATE TABLE `orderdetails` (
  `id` int(11) NOT NULL,
  `orderId` int(11) NOT NULL,
  `utility` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` double NOT NULL,
  `createTime` timestamp NULL DEFAULT NULL,
  `updateTime` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `orderdetails`
--

INSERT INTO `orderdetails` (`id`, `orderId`, `utility`, `amount`, `createTime`, `updateTime`) VALUES
(1, 1, 'x y z and x x x', 100, '2021-03-03 17:00:00', '2021-03-04 00:00:00'),
(2, 1, 'x y z and y y y', 100, '2021-03-03 17:00:00', '2021-03-04 00:00:00');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `code` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` int(11) NOT NULL,
  `roomId` int(11) NOT NULL,
  `customerId` int(11) NOT NULL,
  `amount` int(11) NOT NULL,
  `status` int(11) NOT NULL,
  `createTime` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updateTime` datetime NOT NULL,
  `note` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `checked` tinyint(4) NOT NULL,
  `timeCheckout` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `orders`
--

INSERT INTO `orders` (`id`, `code`, `userId`, `roomId`, `customerId`, `amount`, `status`, `createTime`, `updateTime`, `note`, `checked`, `timeCheckout`) VALUES
(1, 'DH-001', 1, 1, 15, 200000, 3, '2021-03-03 17:00:00', '2021-03-04 00:00:00', NULL, 0, '2021-03-31 21:00:53'),
(2, 'DH-002', 1, 1, 15, 250000, 1, '2021-03-03 17:00:00', '2021-03-04 00:00:00', NULL, 0, '2021-03-31 21:00:53');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `postcategories`
--

CREATE TABLE `postcategories` (
  `id` int(11) NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` tinyint(4) NOT NULL,
  `createTime` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updateTime` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `postcategories`
--

INSERT INTO `postcategories` (`id`, `name`, `slug`, `status`, `createTime`, `updateTime`) VALUES
(296, 'Tên danh mục', NULL, 0, '2021-03-16 17:56:46', '0000-00-00 00:00:00'),
(297, 'Tên danh mục', NULL, 2, '2021-03-16 17:56:46', '0000-00-00 00:00:00'),
(298, 'co duoc binh yen XZC', NULL, 2, '2021-03-16 17:56:46', '0000-00-00 00:00:00'),
(299, 'co duoc binh yen XZC  11 111 222 1', NULL, 2, '2021-03-16 17:56:46', '0000-00-00 00:00:00'),
(300, 'co duoc binh yen XZC', NULL, 2, '2021-03-16 17:56:46', '0000-00-00 00:00:00'),
(301, 'co duoc binh yen XZC', NULL, 2, '2021-03-16 17:56:46', '0000-00-00 00:00:00'),
(302, 'OKE DONE', NULL, 1, '2021-03-16 17:56:46', '0000-00-00 00:00:00'),
(303, 'co duoc binh yen', NULL, 2, '2021-03-16 17:56:46', '0000-00-00 00:00:00'),
(304, 'zzzzz', NULL, 1, '2021-03-16 17:56:46', '0000-00-00 00:00:00'),
(305, 'cham lai mot giay thoi', NULL, 1, '2021-03-16 17:56:46', '0000-00-00 00:00:00'),
(306, 'zzzzzz', NULL, 1, '2021-03-16 17:56:46', '0000-00-00 00:00:00'),
(307, 'co duoc binh yen', NULL, 1, '2021-03-16 17:56:46', '0000-00-00 00:00:00'),
(308, 'anh_xin_loi', NULL, 1, '2021-03-16 17:56:46', '0000-00-00 00:00:00'),
(309, 'cham lai mot giay thoi', NULL, 1, '2021-03-16 17:56:46', '0000-00-00 00:00:00'),
(310, 'zxzc', NULL, 1, '2021-03-16 17:56:46', '0000-00-00 00:00:00'),
(311, 'zxzcxzc', NULL, 1, '2021-03-16 17:56:46', '0000-00-00 00:00:00'),
(312, 'yuka madara', NULL, 1, '2021-03-16 17:56:46', '0000-00-00 00:00:00'),
(313, 'xxxxxxxxx', NULL, 1, '2021-03-16 17:56:46', '0000-00-00 00:00:00'),
(314, 'yuka madara', NULL, 1, '2021-03-16 17:56:46', '0000-00-00 00:00:00'),
(315, 'yuka madara', NULL, 1, '2021-03-16 17:56:46', '0000-00-00 00:00:00'),
(316, 'wowwowy', NULL, 1, '2021-03-16 17:56:46', '0000-00-00 00:00:00'),
(317, 'yuka madara', NULL, 2, '2021-03-16 17:56:46', '0000-00-00 00:00:00'),
(318, 'yuka madara', NULL, 2, '2021-03-16 17:56:46', '0000-00-00 00:00:00'),
(319, 'fxxxxxx', NULL, 2, '2021-03-16 17:56:46', '0000-00-00 00:00:00'),
(320, 'xxxxx', NULL, 2, '2021-03-16 17:56:46', '0000-00-00 00:00:00'),
(321, 'The thao', NULL, 1, '2021-03-16 17:56:46', '0000-00-00 00:00:00'),
(322, 'Tin hot', NULL, 1, '2021-03-16 17:56:46', '0000-00-00 00:00:00'),
(323, 'Tin mới', NULL, 2, '2021-03-16 17:56:46', '0000-00-00 00:00:00'),
(324, 'Tên danh mục', NULL, 1, '2021-03-16 17:56:46', '0000-00-00 00:00:00'),
(325, 'Tên danh mục', NULL, 0, '2021-03-16 18:01:04', '0000-00-00 00:00:00'),
(326, 'Tên danh mục', NULL, 2, '2021-03-16 18:01:04', '0000-00-00 00:00:00'),
(327, 'co duoc binh yen XZC', NULL, 2, '2021-03-16 18:01:04', '0000-00-00 00:00:00'),
(328, 'co duoc binh yen XZC  11 111 222 1', NULL, 2, '2021-03-16 18:01:04', '0000-00-00 00:00:00'),
(329, 'co duoc binh yen XZC', NULL, 2, '2021-03-16 18:01:04', '0000-00-00 00:00:00'),
(330, 'co duoc binh yen XZC', NULL, 2, '2021-03-16 18:01:04', '0000-00-00 00:00:00'),
(331, 'OKE DONE', NULL, 1, '2021-03-16 18:01:04', '0000-00-00 00:00:00'),
(332, 'co duoc binh yen', NULL, 2, '2021-03-16 18:01:04', '0000-00-00 00:00:00'),
(333, 'zzzzz', NULL, 1, '2021-03-16 18:01:04', '0000-00-00 00:00:00'),
(334, 'cham lai mot giay thoi', NULL, 1, '2021-03-16 18:01:04', '0000-00-00 00:00:00'),
(335, 'zzzzzz', NULL, 1, '2021-03-16 18:01:04', '0000-00-00 00:00:00'),
(336, 'co duoc binh yen', NULL, 1, '2021-03-16 18:01:04', '0000-00-00 00:00:00'),
(337, 'anh_xin_loi', NULL, 1, '2021-03-16 18:01:04', '0000-00-00 00:00:00'),
(338, 'cham lai mot giay thoi', NULL, 1, '2021-03-16 18:01:04', '0000-00-00 00:00:00'),
(339, 'zxzc', NULL, 1, '2021-03-16 18:01:04', '0000-00-00 00:00:00'),
(340, 'zxzcxzc', NULL, 1, '2021-03-16 18:01:04', '0000-00-00 00:00:00'),
(341, 'yuka madara', NULL, 1, '2021-03-16 18:01:04', '0000-00-00 00:00:00'),
(342, 'xxxxxxxxx', NULL, 1, '2021-03-16 18:01:04', '0000-00-00 00:00:00'),
(343, 'yuka madara', NULL, 1, '2021-03-16 18:01:04', '0000-00-00 00:00:00'),
(344, 'yuka madara', NULL, 1, '2021-03-16 18:01:04', '0000-00-00 00:00:00'),
(345, 'wowwowy', NULL, 1, '2021-03-16 18:01:04', '0000-00-00 00:00:00'),
(346, 'yuka madara', NULL, 2, '2021-03-16 18:01:04', '0000-00-00 00:00:00'),
(347, 'yuka madara', NULL, 2, '2021-03-16 18:01:04', '0000-00-00 00:00:00'),
(348, 'fxxxxxx', NULL, 2, '2021-03-16 18:01:04', '0000-00-00 00:00:00'),
(349, 'xxxxx', NULL, 2, '2021-03-16 18:01:04', '0000-00-00 00:00:00'),
(350, 'The thao', NULL, 1, '2021-03-16 18:01:04', '0000-00-00 00:00:00'),
(351, 'Tin hot', NULL, 1, '2021-03-16 18:01:04', '0000-00-00 00:00:00'),
(352, 'Tin mới', NULL, 2, '2021-03-16 18:01:04', '0000-00-00 00:00:00'),
(353, 'Tên danh mục', NULL, 1, '2021-03-16 18:01:04', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `posts`
--

CREATE TABLE `posts` (
  `id` int(11) NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `thumbnails` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `desciption` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `content` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `postStatus` tinyint(4) NOT NULL,
  `userId` int(11) NOT NULL,
  `categoryId` int(11) NOT NULL,
  `createTime` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updateTime` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `roles`
--

INSERT INTO `roles` (`id`, `name`) VALUES
(1, 'admin'),
(2, 'shop'),
(3, 'customer');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `roomcategories`
--

CREATE TABLE `roomcategories` (
  `id` int(11) NOT NULL,
  `name` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` tinyint(4) NOT NULL,
  `createTime` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updateTime` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `roomcategories`
--

INSERT INTO `roomcategories` (`id`, `name`, `slug`, `status`, `createTime`, `updateTime`) VALUES
(1, 'VIP#1', '', 0, '2021-03-31 14:12:44', '0000-00-00 00:00:00'),
(2, 'VIP#2', '', 2, '2021-03-31 14:12:44', '0000-00-00 00:00:00'),
(3, 'NORMAL#1', '', 1, '2021-03-31 14:33:53', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `rooms`
--

CREATE TABLE `rooms` (
  `id` int(11) NOT NULL,
  `code` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(1000) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` tinyint(4) NOT NULL,
  `price` int(11) NOT NULL,
  `desposit` double NOT NULL,
  `acr` float NOT NULL,
  `capacity` tinyint(4) NOT NULL,
  `utilities` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `thumbnail` varchar(1000) COLLATE utf8mb4_unicode_ci NOT NULL,
  `images` varchar(1000) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdTime` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updatedTime` datetime NOT NULL,
  `description` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `categoryId` int(11) NOT NULL,
  `rate` tinyint(4) NOT NULL,
  `userid` int(11) NOT NULL,
  `countCheckout` int(11) NOT NULL,
  `address` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `timeOrderActive` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `rooms`
--

INSERT INTO `rooms` (`id`, `code`, `title`, `status`, `price`, `desposit`, `acr`, `capacity`, `utilities`, `thumbnail`, `images`, `createdTime`, `updatedTime`, `description`, `content`, `categoryId`, `rate`, `userid`, `countCheckout`, `address`, `timeOrderActive`) VALUES
(1, 'PH-001', 'Phong cao cap', 1, 200000, 100000, 50, 3, 'dh,qc', 'https://www.hoteljob.vn/files/Anh-HTJ-Hong/homestay-la-gi-1.jpg', 'https://www.hoteljob.vn/files/Anh-HTJ-Hong/homestay-la-gi-1.jpg,https://www.hoteljob.vn/files/Anh-HTJ-Hong/homestay-la-gi-3.jpg,https://www.hoteljob.vn/files/Anh-HTJ-Hong/homestay-la-gi-2.jpg', '2021-03-31 14:41:52', '2021-03-03 00:00:00', 'description', 'content', 1, 5, 1, 100, '', '2021-03-31 20:59:13'),
(2, 'PH-002', 'Phong nhe cap', 2, 200000, 100000, 50, 3, 'dh,qc,mb', 'https://vivuplus.com/wp-content/uploads/2019/05/homestay-dep-con-dao-con-dao-camping-2.png', 'https://vivuplus.com/wp-content/uploads/2019/05/homestay-dep-con-dao-con-dao-camping-2.png,https://vivuplus.com/wp-content/uploads/2019/05/homestay-dep-con-dao-uyen-house-3.jpg,https://vivuplus.com/wp-content/uploads/2019/05/gem-valley-homestay-sapa.jpg', '2021-03-31 14:43:16', '2021-03-03 00:00:00', 'description', 'content', 2, 5, 1, 100, '', '2021-03-31 20:59:13'),
(3, 'PH-003', 'Phong vua cap', 3, 200000, 100000, 50, 3, 'dh,qc', 'https://vivuplus.com/wp-content/uploads/2019/05/homestay-sapa-opal-house-2.jpg', 'https://vivuplus.com/wp-content/uploads/2019/05/homestay-sapa-opal-house-2.jpg,https://vivuplus.com/wp-content/uploads/2019/05/phori-house-homestay-2.jpg,https://vivuplus.com/wp-content/uploads/2019/05/nam-cang-riverside-lodge-2.jpg', '2021-03-31 14:41:53', '2021-03-03 00:00:00', 'description', 'content', 3, 5, 1, 100, '', '2021-03-31 20:59:13'),
(4, 'PH-004', 'zzzzzzzzz', 2, 100, 13434, 199, 1, 'dh,qc', '/static/assets/uploads/admin/2.png', ',/static/assets/uploads/admin/2.png,/static/assets/uploads/admin/bank.PNG', '2021-03-31 16:09:23', '0000-00-00 00:00:00', '<p>xxx</p>', '', 1, 0, 1, 0, 'tran duy hung - ha noi', '2021-03-31 23:01:04');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `userroles`
--

CREATE TABLE `userroles` (
  `userId` int(11) NOT NULL,
  `roleId` int(11) NOT NULL,
  `createTime` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updateTime` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `userroles`
--

INSERT INTO `userroles` (`userId`, `roleId`, `createTime`, `updateTime`) VALUES
(1, 1, '2021-03-01 16:28:08', '0000-00-00 00:00:00'),
(2, 2, '2021-03-01 16:28:08', '0000-00-00 00:00:00'),
(3, 3, '2021-03-01 16:28:08', '2021-03-01 23:28:08'),
(15, 3, '2021-03-21 06:39:12', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(11) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fullname` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `gender` tinyint(4) NOT NULL,
  `datebirth` datetime NOT NULL,
  `avatar` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `note` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userStatus` tinyint(4) NOT NULL,
  `createTime` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updateTime` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `email`, `phone`, `fullname`, `address`, `gender`, `datebirth`, `avatar`, `note`, `userStatus`, `createTime`, `updateTime`) VALUES
(1, 'admin', 'e10adc3949ba59abbe56e057f20f883e', 'admin@gmail.com', '', 'Admin', '', 0, '0000-00-00 00:00:00', '/static/assets/uploads/admin/profile.png', '', 1, '2021-03-18 07:46:18', '0000-00-00 00:00:00'),
(2, 'employee', 'e10adc3949ba59abbe56e057f20f883e', 'employee@gmail.com', '', 'Employee', '', 0, '0000-00-00 00:00:00', '/static/assets/uploads/admin/profile.png', '', 1, '2021-03-18 07:46:18', '0000-00-00 00:00:00'),
(3, 'customer', 'e10adc3949ba59abbe56e057f20f883e', 'customer@gmail.com', '', 'Customer', '', 0, '2021-12-12 00:00:00', '/static/assets/uploads/admin/profile.png', '', 1, '2021-03-18 07:46:18', '2021-12-12 00:00:00'),
(8, 'xxxxxxxxxxx', '123456', 'xxxxxxxxxxx@gmail.com', '0987654321', 'xxxxxxxxxxx', 'tran duy hung - ha noi', 1, '2021-03-14 00:00:00', '', '<p>XXX</p>', 1, '2021-03-21 06:23:35', '0000-00-00 00:00:00'),
(15, 'nguoithue', 'xxxxxxx', 'nguoithue@gmail.com', '0987654321', 'nguoithue', 'tran duy hung - ha noi', 1, '2021-03-14 00:00:00', '', '<ul><li>11</li><li>22</li></ul>', 1, '2021-03-21 07:13:13', '0000-00-00 00:00:00');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `contacts`
--
ALTER TABLE `contacts`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `orderdetails`
--
ALTER TABLE `orderdetails`
  ADD PRIMARY KEY (`id`),
  ADD KEY `orderId` (`orderId`);

--
-- Chỉ mục cho bảng `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`),
  ADD KEY `customerId` (`customerId`),
  ADD KEY `roomId` (`roomId`);

--
-- Chỉ mục cho bảng `postcategories`
--
ALTER TABLE `postcategories`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `categoryId` (`categoryId`),
  ADD KEY `userId` (`userId`);

--
-- Chỉ mục cho bảng `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `roomcategories`
--
ALTER TABLE `roomcategories`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `rooms`
--
ALTER TABLE `rooms`
  ADD PRIMARY KEY (`id`),
  ADD KEY `rooms_ibfk_1` (`categoryId`),
  ADD KEY `userid` (`userid`);

--
-- Chỉ mục cho bảng `userroles`
--
ALTER TABLE `userroles`
  ADD KEY `userId` (`userId`),
  ADD KEY `roleId` (`roleId`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `contacts`
--
ALTER TABLE `contacts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `orderdetails`
--
ALTER TABLE `orderdetails`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `postcategories`
--
ALTER TABLE `postcategories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=354;

--
-- AUTO_INCREMENT cho bảng `posts`
--
ALTER TABLE `posts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT cho bảng `roomcategories`
--
ALTER TABLE `roomcategories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT cho bảng `rooms`
--
ALTER TABLE `rooms`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `orderdetails`
--
ALTER TABLE `orderdetails`
  ADD CONSTRAINT `orderdetails_ibfk_1` FOREIGN KEY (`orderId`) REFERENCES `orders` (`id`);

--
-- Các ràng buộc cho bảng `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`customerId`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `orders_ibfk_3` FOREIGN KEY (`roomId`) REFERENCES `rooms` (`id`);

--
-- Các ràng buộc cho bảng `posts`
--
ALTER TABLE `posts`
  ADD CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`categoryId`) REFERENCES `postcategories` (`id`),
  ADD CONSTRAINT `posts_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`id`);

--
-- Các ràng buộc cho bảng `rooms`
--
ALTER TABLE `rooms`
  ADD CONSTRAINT `rooms_ibfk_1` FOREIGN KEY (`categoryId`) REFERENCES `roomcategories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `rooms_ibfk_2` FOREIGN KEY (`userid`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `userroles`
--
ALTER TABLE `userroles`
  ADD CONSTRAINT `userroles_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `userroles_ibfk_2` FOREIGN KEY (`roleId`) REFERENCES `roles` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
