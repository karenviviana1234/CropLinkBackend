-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 16-05-2024 a las 15:46:03
-- Versión del servidor: 10.4.28-MariaDB
-- Versión de PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `crop_link`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `actividad`
--

CREATE TABLE `actividad` (
  `id_actividad` int(11) NOT NULL,
  `nombre_actividad` varchar(200) NOT NULL,
  `tiempo` time NOT NULL,
  `observaciones` varchar(200) NOT NULL,
  `valor_actividad` float NOT NULL,
  `fk_id_variedad` int(11) NOT NULL,
  `observacion` varchar(100) NOT NULL,
  `estado` enum('activo','proceso','terminado','inactivo') NOT NULL,
  `admin_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `actividad`
--

INSERT INTO `actividad` (`id_actividad`, `nombre_actividad`, `tiempo`, `observaciones`, `valor_actividad`, `fk_id_variedad`, `observacion`, `estado`, `admin_id`) VALUES
(1, 'raspar', '08:30:52', 'trabajadito', 7888, 3, 'no pude ir por cuestionde salud', 'activo', NULL),
(2, 'raspar', '08:30:52', 'trabajadito', 7888, 1, '', 'terminado', NULL),
(3, 'undefined', '12:21:00', 'undefined', 12, 8, '', 'inactivo', NULL),
(4, 'abonaremos', '10:20:50', 'bien', 8000, 1, '', 'inactivo', NULL),
(5, 'undefined', '10:39:10', 'undefined', 21, 1, '', 'activo', NULL),
(6, 'desijar', '10:20:50', 'bien', 8000, 1, '', 'terminado', NULL),
(7, 'abonar', '10:20:50', 'bien', 8000, 1, '', 'terminado', NULL),
(8, 'abonar', '10:20:50', 'bien', 8000, 1, '', 'terminado', NULL),
(9, 'undefinened', '01:21:12', 'bien', 10, 1, '', 'inactivo', NULL),
(10, 'recolectar cafes', '10:39:10', 'no quiero', 12, 1, '', 'inactivo', NULL),
(11, 'recolectar', '10:20:50', 'bien', 8000, 1, 'si cogi cafe', 'terminado', NULL),
(12, 'raspar', '08:30:52', 'trabajadito', 7888, 1, '', 'inactivo', NULL),
(13, 'recolectar', '10:20:50', 'bien', 8000, 1, '', 'inactivo', NULL),
(14, 'raspar', '08:30:52', 'trabajadito', 7888, 3, '', 'terminado', NULL),
(15, 'raspar', '08:30:52', 'trabajadito', 7888, 3, 'si cogi cafe', 'inactivo', NULL),
(16, 'pan', '10:39:10', '22s', 221, 5, '', 'activo', NULL),
(17, 'cepillar caballo', '11:12:11', 'no', 2131430, 8, '', 'activo', NULL),
(18, 'pan', '12:21:00', 'DW', 54646, 5, '', 'activo', NULL),
(19, 'ws', '12:21:00', 'no', 210000, 5, '', 'activo', NULL),
(20, 'quitar cafe gonxaaaa', '10:00:00', 'utilizar machete', 80000, 9, '', 'activo', 666),
(21, 'cepillar caballo', '12:21:00', 'no', 32111, 9, '', 'activo', 666);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `costos`
--

CREATE TABLE `costos` (
  `id_costos` int(11) NOT NULL,
  `precio` int(11) NOT NULL,
  `fk_id_tipo_recursos` int(11) NOT NULL,
  `estado` enum('activo','inactivo') NOT NULL,
  `admin_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `costos`
--

INSERT INTO `costos` (`id_costos`, `precio`, `fk_id_tipo_recursos`, `estado`, `admin_id`) VALUES
(1, 11000, 5, 'activo', NULL),
(2, 1000, 2, 'activo', NULL),
(5, 200, 2, 'inactivo', NULL),
(6, 201, 2, 'inactivo', NULL),
(7, 49900, 2, 'activo', NULL),
(8, 2200, 1, 'activo', NULL),
(9, 2200, 1, 'activo', 666),
(10, 2200, 11, 'activo', 666);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cultivo`
--

CREATE TABLE `cultivo` (
  `id_cultivo` int(11) NOT NULL,
  `fecha_inicio` date NOT NULL,
  `cantidad_sembrada` int(11) NOT NULL,
  `fk_id_lote` int(11) NOT NULL,
  `fk_id_variedad` int(11) NOT NULL,
  `estado` enum('activo','inactivo') NOT NULL,
  `admin_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `cultivo`
--

INSERT INTO `cultivo` (`id_cultivo`, `fecha_inicio`, `cantidad_sembrada`, `fk_id_lote`, `fk_id_variedad`, `estado`, `admin_id`) VALUES
(1, '2024-10-19', 621, 1, 1, 'activo', NULL),
(2, '2024-10-19', 621, 2, 1, 'activo', NULL),
(7, '2022-10-19', 89, 1, 1, 'activo', NULL),
(8, '2022-10-19', 100, 1, 1, 'activo', NULL),
(9, '2024-10-19', 621, 1, 1, 'activo', NULL),
(10, '2022-10-19', 89, 1, 3, 'activo', NULL),
(12, '2022-10-19', 89, 15, 9, 'activo', 666);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `finca`
--

CREATE TABLE `finca` (
  `id_finca` int(11) NOT NULL,
  `nombre_finca` varchar(200) NOT NULL,
  `longitud` float NOT NULL,
  `latitud` float NOT NULL,
  `estado` enum('activo','inactivo') NOT NULL,
  `admin_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `finca`
--

INSERT INTO `finca` (`id_finca`, `nombre_finca`, `longitud`, `latitud`, `estado`, `admin_id`) VALUES
(1, 'pocho', 21, 21, 'activo', NULL),
(2, 'piso 21', 12, 21, 'activo', NULL),
(5, 'pepe', 213, 21, 'activo', NULL),
(6, 'San', -74.13, 23, 'activo', NULL),
(7, 'San pablo', -74.13, 4.5607, 'inactivo', NULL),
(8, 'San pepe', -74.13, 4.5607, 'activo', NULL),
(9, 'tin', 34, 34342, 'activo', NULL),
(10, 'San pepe', -74.13, 4.5607, 'activo', NULL),
(15, 'San pepe', -74.13, 4.5607, 'activo', NULL),
(16, 'San pepe', -74.13, 4.5607, 'activo', NULL),
(17, 'San pepe', -74.13, 4.5607, 'activo', NULL),
(18, 'San pepe', -74.13, 4.5607, 'activo', NULL),
(19, 'guaduales', -74.13, 4.5607, 'activo', NULL),
(20, 'pepe', 45, 231, 'activo', NULL),
(21, 'kaka', 1, 2, 'activo', NULL),
(22, 'juan', 2, 3543, 'activo', NULL),
(23, 'pan tostado', 34242, 1342, 'activo', NULL),
(24, 'tono', 21212, 122, 'activo', NULL),
(25, 'karla', 21, 22, 'activo', NULL),
(26, 'HOLAAA', 23, 32, 'activo', NULL),
(27, 'pepe', 21, 32, 'inactivo', NULL),
(28, 'yamboro', -74.13, 4.5607, 'activo', NULL),
(29, 'pepe', 323, 34211, 'activo', 666),
(30, 'sonso', 21, 5433, 'activo', 666);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `inversiones`
--

CREATE TABLE `inversiones` (
  `id_inversiones` int(11) NOT NULL,
  `fk_id_costos` int(11) NOT NULL,
  `fk_id_programacion` int(11) NOT NULL,
  `valor_inversion` float NOT NULL,
  `admin_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `inversiones`
--

INSERT INTO `inversiones` (`id_inversiones`, `fk_id_costos`, `fk_id_programacion`, `valor_inversion`, `admin_id`) VALUES
(1, 1, 3, 0, NULL),
(2, 2, 3, 0, NULL),
(3, 1, 3, 0, NULL),
(4, 2, 3, 0, NULL),
(5, 1, 3, 0, NULL),
(6, 6, 11, 0, NULL),
(7, 5, 11, 24400, NULL),
(8, 1, 9, 0, NULL),
(9, 5, 9, 24400, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `lotes`
--

CREATE TABLE `lotes` (
  `id_lote` int(11) NOT NULL,
  `nombre` varchar(200) NOT NULL,
  `longitud` float NOT NULL,
  `latitud` float NOT NULL,
  `fk_id_finca` int(11) NOT NULL,
  `estado` enum('activo','inactivo') NOT NULL,
  `admin_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `lotes`
--

INSERT INTO `lotes` (`id_lote`, `nombre`, `longitud`, `latitud`, `fk_id_finca`, `estado`, `admin_id`) VALUES
(1, 'os', 23, 32, 1, 'activo', NULL),
(2, 'DANIEL', 21, 21, 1, 'activo', NULL),
(5, 'pepe el lote', 12, 21, 2, 'activo', NULL),
(6, 'f rosales', 12.78, 80.87, 5, 'activo', NULL),
(8, 'venecos', 12.78, 80.87, 1, 'activo', NULL),
(9, 'venecia', 12.78, 80.87, 1, 'activo', NULL),
(10, 'venecia', 12, 80, 2, 'activo', NULL),
(11, 'veneciaaaaa', 12, 80, 23, 'activo', NULL),
(12, 'dasd', 93, 12, 23, 'activo', NULL),
(13, 'veneciaa de g', 12, 80, 29, 'activo', NULL),
(14, 'veneno', 12, 82, 30, 'activo', NULL),
(15, 'venenitp', 12, 82, 30, 'activo', 666);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `produccion`
--

CREATE TABLE `produccion` (
  `id_producccion` int(11) NOT NULL,
  `cantidad_produccion` int(11) NOT NULL,
  `precio` float NOT NULL,
  `fk_id_programacion` int(11) NOT NULL,
  `admin_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `produccion`
--

INSERT INTO `produccion` (`id_producccion`, `cantidad_produccion`, `precio`, `fk_id_programacion`, `admin_id`) VALUES
(1, 500000, 900, 3, NULL),
(2, 5000, 900, 3, NULL),
(3, 8000, 1000, 3, NULL),
(4, 8, 1000, 3, NULL),
(5, 8, 1000, 25, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `programacion`
--

CREATE TABLE `programacion` (
  `id_programacion` int(11) NOT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date NOT NULL,
  `estado` enum('activo','proceso','terminado','inactivo') NOT NULL,
  `fk_identificacion` int(11) NOT NULL,
  `fk_id_actividad` int(11) NOT NULL,
  `fk_id_cultivo` int(11) NOT NULL,
  `admin_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `programacion`
--

INSERT INTO `programacion` (`id_programacion`, `fecha_inicio`, `fecha_fin`, `estado`, `fk_identificacion`, `fk_id_actividad`, `fk_id_cultivo`, `admin_id`) VALUES
(3, '2022-02-12', '2022-02-12', 'inactivo', 22, 1, 1, NULL),
(5, '2022-02-11', '2022-02-12', 'terminado', 18, 2, 2, NULL),
(6, '2022-01-12', '2023-02-12', 'activo', 22, 3, 1, NULL),
(7, '2022-02-11', '2022-02-12', 'terminado', 22, 2, 2, NULL),
(8, '2022-02-11', '2022-02-12', 'terminado', 22, 2, 2, NULL),
(9, '2022-02-15', '2022-02-16', 'terminado', 1232410273, 11, 2, NULL),
(10, '2022-02-15', '2022-02-16', '', 1232410273, 9, 2, NULL),
(11, '2022-02-15', '2022-02-16', 'activo', 1232410273, 10, 2, NULL),
(12, '2022-02-15', '2022-02-16', 'terminado', 1232410273, 11, 2, NULL),
(13, '2022-02-15', '2022-02-16', 'activo', 1232410273, 12, 2, NULL),
(14, '2022-02-15', '2022-02-16', 'inactivo', 1232410273, 13, 2, NULL),
(15, '2022-02-15', '2022-02-16', 'terminado', 1232410273, 14, 2, NULL),
(16, '2022-02-15', '2022-02-16', 'terminado', 1232410273, 11, 2, NULL),
(17, '2022-02-15', '2022-02-16', 'activo', 1232410273, 1, 2, NULL),
(18, '2022-02-15', '2022-02-16', 'activo', 1232410273, 1, 2, NULL),
(19, '2022-02-11', '2022-02-12', 'terminado', 22, 2, 2, NULL),
(20, '2024-04-05', '2024-04-30', 'activo', 101, 18, 8, NULL),
(22, '2022-02-15', '2022-02-16', 'activo', 1232410273, 11, 2, NULL),
(23, '2022-02-11', '2022-02-12', 'proceso', 22, 2, 2, NULL),
(24, '2022-02-11', '2022-02-12', 'activo', 22, 2, 2, NULL),
(25, '2022-02-11', '2022-02-12', 'activo', 1123, 20, 12, 666);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipo_recursos`
--

CREATE TABLE `tipo_recursos` (
  `id_tipo_recursos` int(11) NOT NULL,
  `nombre_recursos` varchar(200) NOT NULL,
  `cantidad_medida` float NOT NULL,
  `unidades_medida` enum('ml','litro','g','kg','unidad') NOT NULL,
  `extras` varchar(50) NOT NULL,
  `estado` enum('existente','gastada_o') NOT NULL,
  `admin_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `tipo_recursos`
--

INSERT INTO `tipo_recursos` (`id_tipo_recursos`, `nombre_recursos`, `cantidad_medida`, `unidades_medida`, `extras`, `estado`, `admin_id`) VALUES
(1, 'joo', 2, 'ml', '1', 'gastada_o', NULL),
(2, 'guante', 21, 'unidad', 'no', 'existente', NULL),
(5, 'fertilizante el macho', 122, 'litro', 'no se necesito nada mas', 'existente', NULL),
(6, 'fertilizan tecaña', 12, 'litro', 'no se necesito nada mas', 'gastada_o', NULL),
(7, 'pep', 21, 'ml', '1', 'gastada_o', NULL),
(8, 'pan', 1, 'unidad', 'no', 'existente', NULL),
(9, 'tela', 1, 'unidad', 'SE DAÑO y toco comprar otra', 'existente', NULL),
(10, 'tela', 1, 'unidad', 'no', 'existente', NULL),
(11, 'mata ton  maleza', 12, 'ml', 'no se necesito nada mas compa', 'gastada_o', 666);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `identificacion` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `apellido` varchar(50) NOT NULL,
  `correo` varchar(200) NOT NULL,
  `password` varchar(200) NOT NULL,
  `rol` enum('administrador','empleado','','') NOT NULL,
  `estado` enum('activo','inactivo') NOT NULL,
  `admin_id` int(11) DEFAULT NULL,
  `imagen` varchar(64) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`identificacion`, `nombre`, `apellido`, `correo`, `password`, `rol`, `estado`, `admin_id`, `imagen`) VALUES
(12, 'Lucia', 'guevara', 'luciaa@gmail.com', '123456789luciadiaz', '', 'activo', NULL, ''),
(18, 'danieel', 'felipe', 'dafe@gmail.com', '1234', 'empleado', 'activo', 1232410273, ''),
(22, 'cesar ', 'carrillo ', 'cesar@soy.com', '123456', 'empleado', 'inactivo', NULL, ''),
(101, 'ta', 'te', 'jaa@gmail.com', '1111', 'administrador', 'activo', NULL, ''),
(123, 'Danielito', 'Diaz', 'danigobra@gmail.com', '1234567890daniel', 'empleado', 'activo', 666, ''),
(657, 'Lucia', 'Diaz', 'luci@gmail.com', '1234567890karenlucia', '', 'activo', NULL, ''),
(666, 'Juanes', 'per  ', 'luci@12.com', 'lucifer', 'administrador', 'activo', NULL, ''),
(1123, 'pahsdas', 'carrillow ', 'cesitar@soy.com', '132311', 'empleado', 'activo', 666, ''),
(6570, 'Jose', 'Cuellar', 'josecu@gmail.com', '1234567890jose', 'empleado', 'inactivo', 666, ''),
(6789, 'Alejandro', 'guevara', 'ro@gmail.com', '123456789alejo', 'empleado', 'activo', 666, ''),
(5678900, 'Karen', 'Diaz', 'ro@gmail.com', '123456789karen', 'empleado', 'inactivo', 666, ''),
(12345900, 'Juan Camilo', 'Realpe Ceron', 'Juan@gmail.com', '12345', 'empleado', 'activo', 666, ''),
(1232410273, 'daniel', 'fefe', 'danigobra@gmail.com', 'dafe', 'administrador', 'activo', NULL, ''),
(1232410275, 'pablow ', 'carrillow ', 'cesar@soy.com', '1230', 'empleado', 'inactivo', NULL, ''),
(2027525554, 'dan ', 'felipe g ', 'dani@soy.com', '10dfssd', 'administrador', 'activo', NULL, ''),
(2147483647, 'cferney ', 'person', 'elfercho1@12.com', 'cfer', 'empleado', 'activo', NULL, '');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `variedad`
--

CREATE TABLE `variedad` (
  `id_variedad` int(11) NOT NULL,
  `nombre_variedad` varchar(25) NOT NULL,
  `tipo_cultivo` enum('alimentarios','textiles','oleaginosos','ornamentales','industriales') NOT NULL,
  `estado` enum('activo','inactivo') NOT NULL,
  `admin_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `variedad`
--

INSERT INTO `variedad` (`id_variedad`, `nombre_variedad`, `tipo_cultivo`, `estado`, `admin_id`) VALUES
(1, 'cilantro', 'alimentarios', 'activo', NULL),
(3, 'cebolla', 'alimentarios', 'activo', NULL),
(4, 'Zanahorias', 'alimentarios', 'activo', NULL),
(5, 'Zanahorios', 'alimentarios', 'activo', NULL),
(6, 'cebolla ver', 'alimentarios', 'activo', NULL),
(7, 'Zanahorios', 'oleaginosos', 'activo', NULL),
(8, 'cebol verdes', 'alimentarios', 'activo', NULL),
(9, 'Zanahorios gonza', 'oleaginosos', 'activo', 666);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `actividad`
--
ALTER TABLE `actividad`
  ADD PRIMARY KEY (`id_actividad`),
  ADD KEY `actividad_variedad` (`fk_id_variedad`),
  ADD KEY `fk_admin_id_actividad` (`admin_id`);

--
-- Indices de la tabla `costos`
--
ALTER TABLE `costos`
  ADD PRIMARY KEY (`id_costos`),
  ADD KEY `costos_tipo_recursos` (`fk_id_tipo_recursos`),
  ADD KEY `fk_admin_id_costos` (`admin_id`);

--
-- Indices de la tabla `cultivo`
--
ALTER TABLE `cultivo`
  ADD PRIMARY KEY (`id_cultivo`),
  ADD KEY `cultivo_variedad` (`fk_id_variedad`),
  ADD KEY `cultivo_lotes` (`fk_id_lote`),
  ADD KEY `fk_admin_id_cultivo` (`admin_id`);

--
-- Indices de la tabla `finca`
--
ALTER TABLE `finca`
  ADD PRIMARY KEY (`id_finca`),
  ADD KEY `admin_id` (`admin_id`);

--
-- Indices de la tabla `inversiones`
--
ALTER TABLE `inversiones`
  ADD PRIMARY KEY (`id_inversiones`),
  ADD KEY `inversiones_costos` (`fk_id_costos`),
  ADD KEY `inversiones_cultivos` (`fk_id_programacion`),
  ADD KEY `fk_admin_id_inversiones` (`admin_id`);

--
-- Indices de la tabla `lotes`
--
ALTER TABLE `lotes`
  ADD PRIMARY KEY (`id_lote`),
  ADD KEY `lotes_finca` (`fk_id_finca`),
  ADD KEY `fk_admin_id_lotes` (`admin_id`);

--
-- Indices de la tabla `produccion`
--
ALTER TABLE `produccion`
  ADD PRIMARY KEY (`id_producccion`),
  ADD KEY `produccion_cultivo` (`fk_id_programacion`),
  ADD KEY `fk_admin_id_produccion` (`admin_id`);

--
-- Indices de la tabla `programacion`
--
ALTER TABLE `programacion`
  ADD PRIMARY KEY (`id_programacion`),
  ADD KEY `fk_programacion_actividad` (`fk_id_actividad`),
  ADD KEY `programacion_usuarios` (`fk_identificacion`),
  ADD KEY `programacion_cultivos` (`fk_id_cultivo`),
  ADD KEY `fk_admin_id_programacion` (`admin_id`);

--
-- Indices de la tabla `tipo_recursos`
--
ALTER TABLE `tipo_recursos`
  ADD PRIMARY KEY (`id_tipo_recursos`),
  ADD KEY `fk_admin_id_tipo_recursos` (`admin_id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`identificacion`),
  ADD KEY `fk_admin_id` (`admin_id`);

--
-- Indices de la tabla `variedad`
--
ALTER TABLE `variedad`
  ADD PRIMARY KEY (`id_variedad`),
  ADD KEY `fk_admin_id_variedad` (`admin_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `actividad`
--
ALTER TABLE `actividad`
  MODIFY `id_actividad` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT de la tabla `costos`
--
ALTER TABLE `costos`
  MODIFY `id_costos` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `cultivo`
--
ALTER TABLE `cultivo`
  MODIFY `id_cultivo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `finca`
--
ALTER TABLE `finca`
  MODIFY `id_finca` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT de la tabla `inversiones`
--
ALTER TABLE `inversiones`
  MODIFY `id_inversiones` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `lotes`
--
ALTER TABLE `lotes`
  MODIFY `id_lote` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `produccion`
--
ALTER TABLE `produccion`
  MODIFY `id_producccion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `programacion`
--
ALTER TABLE `programacion`
  MODIFY `id_programacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT de la tabla `tipo_recursos`
--
ALTER TABLE `tipo_recursos`
  MODIFY `id_tipo_recursos` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `variedad`
--
ALTER TABLE `variedad`
  MODIFY `id_variedad` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `actividad`
--
ALTER TABLE `actividad`
  ADD CONSTRAINT `actividad_variedad` FOREIGN KEY (`fk_id_variedad`) REFERENCES `variedad` (`id_variedad`),
  ADD CONSTRAINT `fk_admin_id_actividad` FOREIGN KEY (`admin_id`) REFERENCES `usuarios` (`identificacion`);

--
-- Filtros para la tabla `costos`
--
ALTER TABLE `costos`
  ADD CONSTRAINT `costos_tipo_recursos` FOREIGN KEY (`fk_id_tipo_recursos`) REFERENCES `tipo_recursos` (`id_tipo_recursos`),
  ADD CONSTRAINT `fk_admin_id_costos` FOREIGN KEY (`admin_id`) REFERENCES `usuarios` (`identificacion`);

--
-- Filtros para la tabla `cultivo`
--
ALTER TABLE `cultivo`
  ADD CONSTRAINT `cultivo_lotes` FOREIGN KEY (`fk_id_lote`) REFERENCES `lotes` (`id_lote`),
  ADD CONSTRAINT `cultivo_variedad` FOREIGN KEY (`fk_id_variedad`) REFERENCES `variedad` (`id_variedad`),
  ADD CONSTRAINT `fk_admin_id_cultivo` FOREIGN KEY (`admin_id`) REFERENCES `usuarios` (`identificacion`);

--
-- Filtros para la tabla `finca`
--
ALTER TABLE `finca`
  ADD CONSTRAINT `finca_ibfk_1` FOREIGN KEY (`admin_id`) REFERENCES `usuarios` (`identificacion`);

--
-- Filtros para la tabla `inversiones`
--
ALTER TABLE `inversiones`
  ADD CONSTRAINT `fk_admin_id_inversiones` FOREIGN KEY (`admin_id`) REFERENCES `usuarios` (`identificacion`),
  ADD CONSTRAINT `inversiones_ibfk_1` FOREIGN KEY (`fk_id_programacion`) REFERENCES `programacion` (`id_programacion`),
  ADD CONSTRAINT `inversiones_ibfk_2` FOREIGN KEY (`fk_id_costos`) REFERENCES `costos` (`id_costos`);

--
-- Filtros para la tabla `lotes`
--
ALTER TABLE `lotes`
  ADD CONSTRAINT `fk_admin_id_lotes` FOREIGN KEY (`admin_id`) REFERENCES `usuarios` (`identificacion`),
  ADD CONSTRAINT `lotes_finca` FOREIGN KEY (`fk_id_finca`) REFERENCES `finca` (`id_finca`);

--
-- Filtros para la tabla `produccion`
--
ALTER TABLE `produccion`
  ADD CONSTRAINT `fk_admin_id_produccion` FOREIGN KEY (`admin_id`) REFERENCES `usuarios` (`identificacion`),
  ADD CONSTRAINT `produccion_ibfk_1` FOREIGN KEY (`fk_id_programacion`) REFERENCES `programacion` (`id_programacion`);

--
-- Filtros para la tabla `programacion`
--
ALTER TABLE `programacion`
  ADD CONSTRAINT `fk_admin_id_programacion` FOREIGN KEY (`admin_id`) REFERENCES `usuarios` (`identificacion`),
  ADD CONSTRAINT `fk_programacion_actividad` FOREIGN KEY (`fk_id_actividad`) REFERENCES `actividad` (`id_actividad`),
  ADD CONSTRAINT `programacion_cultivos` FOREIGN KEY (`fk_id_cultivo`) REFERENCES `cultivo` (`id_cultivo`),
  ADD CONSTRAINT `programacion_usuarios` FOREIGN KEY (`fk_identificacion`) REFERENCES `usuarios` (`identificacion`);

--
-- Filtros para la tabla `tipo_recursos`
--
ALTER TABLE `tipo_recursos`
  ADD CONSTRAINT `fk_admin_id_tipo_recursos` FOREIGN KEY (`admin_id`) REFERENCES `usuarios` (`identificacion`);

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `fk_admin_id` FOREIGN KEY (`admin_id`) REFERENCES `usuarios` (`identificacion`);

--
-- Filtros para la tabla `variedad`
--
ALTER TABLE `variedad`
  ADD CONSTRAINT `fk_admin_id_variedad` FOREIGN KEY (`admin_id`) REFERENCES `usuarios` (`identificacion`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
