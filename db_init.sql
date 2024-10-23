-- db_init.sql

CREATE DATABASE IF NOT EXISTS app_didactica_db;
USE app_didactica_db;

-- Tabla de Usuarios
CREATE TABLE Usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    contraseña VARCHAR(255) NOT NULL,  -- Almacenada de forma segura (bcrypt hash)
    edad INT,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Puntajes
CREATE TABLE Puntajes (
    id_puntaje INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT,
    id_juego INT,
    puntaje INT,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario)
);

-- Tabla de Juegos
CREATE TABLE Juegos (
    id_juego INT AUTO_INCREMENT PRIMARY KEY,
    nombre_juego VARCHAR(100) NOT NULL,
    tipo_juego VARCHAR(50),  -- Ej: "Memoria Visual", "Sopa de Letras"
    nivel_dificultad INT,     -- Nivel de dificultad (1, 2, 3...)
    descripcion TEXT
);

-- Tabla de Actividades
CREATE TABLE Actividades (
    id_actividad INT AUTO_INCREMENT PRIMARY KEY,
    nombre_actividad VARCHAR(100) NOT NULL,
    descripcion TEXT,
    nivel_dificultad INT  -- Nivel de dificultad para la actividad
);

-- Tabla de Resultados
CREATE TABLE Resultados (
    id_resultado INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT,
    id_juego INT DEFAULT NULL,
    id_actividad INT DEFAULT NULL,
    puntuacion INT,
    tiempo_juego TIME,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario),
    FOREIGN KEY (id_juego) REFERENCES Juegos(id_juego),
    FOREIGN KEY (id_actividad) REFERENCES Actividades(id_actividad)
);

-- Tabla Perfiles
CREATE TABLE Perfiles (
    id_perfil INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT,
    notificaciones BOOLEAN DEFAULT TRUE,
    tema_preferido VARCHAR(100),
    nivel_preferido INT,
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario)
);

-- Tabla Roles
CREATE TABLE Roles (
    id_rol INT AUTO_INCREMENT PRIMARY KEY,
    nombre_rol VARCHAR(50) UNIQUE NOT NULL
);

-- Tabla de Rankings
CREATE TABLE Ranking (
    id_ranking INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT,
    puntaje_total INT,
    ranking_posicion INT,
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario)
);

CREATE TABLE RevokedTokens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    jti VARCHAR(255) NOT NULL,  -- jti es el identificador único del token JWT
    fecha_revocacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

