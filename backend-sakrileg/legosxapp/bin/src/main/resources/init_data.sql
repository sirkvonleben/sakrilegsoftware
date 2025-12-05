
-- 1. Insertar Roles (Maestros)
INSERT INTO rol (id_rol, nombre_rol, descripcion) VALUES
(1, 'ADMINISTRADOR', 'Control total del sistema y gestión de usuarios.'),
(2, 'JEFE_ALMACEN', 'Supervisión de stock, anulación de movimientos.'),
(3, 'OPERADOR', 'Registro de movimientos de ingreso y salida.');

-- 2. Insertar Sucursales (Maestros)
INSERT INTO sucursal (id_sucursal, nombre, ubicacion, estado) VALUES
(1, 'Sede Central - Lima', 'Av. Central 101, Lima', 1),
(2, 'Almacén Principal - Sur', 'Jr. Los Álamos 250, Surco', 1),
(3, 'Tienda Retail - Norte', 'CC Plaza Norte, Tienda 5', 1);

-- 3. Insertar Productos (Maestros)
INSERT INTO producto (id_producto, codigo, nombre, categoria, talla, color, precio_referencia, stock_minimo, estado) VALUES
(1, 'PoloSTR001', 'Polo Strech Fit V1', 'POLO', 'M', 'AZUL', 35.00, 50, 1),
(2, 'TSHIRTDX1', 'T-Shirt Algodón Deluxe', 'T-SHIRT', 'L', 'BLANCO', 25.00, 75, 1),
(3, 'POLODX005', 'Polo Manga Larga', 'POLO', 'S', 'ROJO', 45.00, 20, 1);

-- 4. Insertar Usuarios (con Hashes BCrypt)
-- (Contraseñas: 'admin123', 'jefe123', 'op123')
-- (Asumiendo que la columna se llama 'clave' después de renombrarla)
INSERT INTO usuario (id_usuario, login_u, clave, nombre_u, apellido_u, correo_u, celular_u, cargo_u, id_rol, id_sucursal, estado_u, fecha_creacion) VALUES
(1, 'admin', '$2a$10$9seNo1RzQao/DrEN7SjI3uNLHxLz87gw5njvy3oScRuJGIuyasEpG
', 'Félix', 'Leyton', 'felix@legosx.com', '999123456', 'Project Manager', 1, 1, 1, NOW()),
(2, 'jefe_almacen', '$2a$10$woVVg1an1vpfc2iDGd/g1OX9iKuTMbBEwe5n9uMhUCXVRGNm6TxcC', 'Jesús', 'Contreras', 'jesus@legosx.com', '987654321', 'Jefe de Almacén', 2, 2, 1, NOW()),
(3, 'operador_lima', '$2a$10$jiYwfGkn.vtngYX0VJPAyO7CQXn.k2gGnJlHlB9P5oPG7AxGsIESC', 'María', 'Pérez', 'maria@legosx.com', '987111222', 'Operador Logístico', 3, 1, 1, NOW());

-- 5. Inventario Inicial
INSERT INTO inventario (id_inventario, id_producto, id_sucursal, stock_actual, stock_minimo) VALUES
(1, 1, 1, 100, 50),
(2, 2, 1, 20, 75),
(3, 1, 2, 300, 50);