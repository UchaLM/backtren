import { pool } from "../database.js";

// Subjects CRUD
export const findAllSubjects = async () => {
  const { rows } = await pool.query(
    `SELECT s.id, s.name, s.professor_id, u.name as professor_name, s.created_at 
     FROM subjects s 
     JOIN users u ON s.professor_id = u.id 
     WHERE s.deleted_at IS NULL AND u.deleted_at IS NULL
     ORDER BY s.created_at DESC`
  );
  return rows;
};

export const findSubjectById = async (id) => {
  const { rows } = await pool.query(
    `SELECT s.id, s.name, s.professor_id, u.name as professor_name, s.created_at 
     FROM subjects s 
     JOIN users u ON s.professor_id = u.id 
     WHERE s.id = $1 AND s.deleted_at IS NULL AND u.deleted_at IS NULL`,
    [id]
  );
  return rows[0];
};

export const createSubjectService = async (name, professor_id) => {
  // Validate professor
  const { rows: profRows } = await pool.query(
    "SELECT role FROM users WHERE id = $1 AND deleted_at IS NULL",
    [professor_id]
  );
  if (profRows.length === 0 || profRows[0].role !== 'profesor') {
    throw new Error("Invalid professor");
  }

  const { rows } = await pool.query(
    "INSERT INTO subjects (name, professor_id) VALUES ($1, $2) RETURNING id, name, professor_id, created_at",
    [name, professor_id]
  );
  return rows[0];
};

export const updateSubjectService = async (id, name, professor_id) => {
  if (professor_id) {
    const { rows: profRows } = await pool.query(
      "SELECT role FROM users WHERE id = $1 AND deleted_at IS NULL",
      [professor_id]
    );
    if (profRows.length === 0 || profRows[0].role !== 'profesor') {
      throw new Error("Invalid professor");
    }
    const { rows } = await pool.query(
      "UPDATE subjects SET name = $1, professor_id = $2 WHERE id = $3 AND deleted_at IS NULL RETURNING id, name, professor_id, created_at",
      [name, professor_id, id]
    );
    return rows[0];
  } else {
    const { rows } = await pool.query(
      "UPDATE subjects SET name = $1 WHERE id = $2 AND deleted_at IS NULL RETURNING id, name, professor_id, created_at",
      [name, id]
    );
    return rows[0];
  }
};

export const deleteSubjectService = async (id) => {
  const { rowCount } = await pool.query(
    "UPDATE subjects SET deleted_at = timezone('utc'::text, now()) WHERE id = $1 AND deleted_at IS NULL",
    [id]
  );
  return rowCount;
};

// Cursan (Enrollments)
export const enrollStudentService = async (student_id, subject_id) => {
  // Validate student
  const { rows: stuRows } = await pool.query(
    "SELECT role FROM users WHERE id = $1 AND deleted_at IS NULL",
    [student_id]
  );
  if (stuRows.length === 0 || stuRows[0].role !== 'alumno') {
    throw new Error("Invalid student");
  }

  const { rows } = await pool.query(
    "INSERT INTO student_subjects (student_id, subject_id) VALUES ($1, $2) RETURNING student_id, subject_id, enrolled_at",
    [student_id, subject_id]
  );
  return rows[0];
};

export const unenrollStudentService = async (student_id, subject_id) => {
  const { rowCount } = await pool.query(
    "DELETE FROM student_subjects WHERE student_id = $1 AND subject_id = $2",
    [student_id, subject_id]
  );
  return rowCount;
};

// Get Subjects by User (Dictan for professors, Cursan for students)
export const findSubjectsByUser = async (user_id) => {
  const { rows: userRows } = await pool.query(
    "SELECT role FROM users WHERE id = $1 AND deleted_at IS NULL",
    [user_id]
  );
  if (userRows.length === 0) throw new Error("User not found");

  const role = userRows[0].role;
  if (role === 'profesor') {
    // Dictan
    const { rows } = await pool.query(
      "SELECT id, name, created_at FROM subjects WHERE professor_id = $1 AND deleted_at IS NULL",
      [user_id]
    );
    return { role, subjects: rows };
  } else {
    // Cursan
    const { rows } = await pool.query(
      `SELECT s.id, s.name, s.professor_id, ss.enrolled_at 
       FROM subjects s
       JOIN student_subjects ss ON s.id = ss.subject_id
       WHERE ss.student_id = $1 AND s.deleted_at IS NULL`,
      [user_id]
    );
    return { role, subjects: rows };
  }
};
