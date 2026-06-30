---------------------------------------------------------
-- 🧹 PARTE 1: DESTRUCCIÓN TOTAL (BORRÓN Y CUENTA NUEVA)
---------------------------------------------------------
DROP TABLE IF EXISTS student_subjects CASCADE;
DROP TABLE IF EXISTS subjects CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;

---------------------------------------------------------
-- 🏗️ PARTE 2: CREACIÓN DE LAS NUEVAS TABLAS
---------------------------------------------------------
-- 1. Definir los roles permitidos
CREATE TYPE user_role AS ENUM ('profesor', 'alumno');

-- 2. Crear la tabla de usuarios (users)
CREATE TABLE users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role user_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    deleted_at TIMESTAMP WITH TIME ZONE -- Columna para manejar el soft delete
);

-- 3. Crear la tabla de materias (subjects)
CREATE TABLE subjects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    professor_id UUID REFERENCES users(id) ON DELETE RESTRICT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    deleted_at TIMESTAMP WITH TIME ZONE -- Columna para manejar el soft delete
);

-- 4. Crear la tabla intermedia para inscripciones (student_subjects)
CREATE TABLE student_subjects (
    student_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE NOT NULL,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    PRIMARY KEY (student_id, subject_id) 
);

-- 5. Crear índices para optimizar la velocidad
CREATE INDEX idx_subjects_professor_id ON subjects(professor_id);
CREATE INDEX idx_student_subjects_student_id ON student_subjects(student_id);
CREATE INDEX idx_student_subjects_subject_id ON student_subjects(subject_id);