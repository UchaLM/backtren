import {
  findAllSubjects,
  findSubjectById,
  createSubjectService,
  updateSubjectService,
  deleteSubjectService,
  enrollStudentService,
  unenrollStudentService,
  findSubjectsByUser
} from "../services/subject.services.js";

export const getSubjects = async (req, res) => {
  try {
    const subjects = await findAllSubjects();
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getSubject = async (req, res) => {
  try {
    const subject = await findSubjectById(req.params.id);
    if (!subject) return res.status(404).json({ message: "Subject not found" });
    res.json(subject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createSubject = async (req, res) => {
  const { name, professor_id } = req.body;
  try {
    const newSubject = await createSubjectService(name, professor_id);
    res.status(201).json(newSubject);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateSubject = async (req, res) => {
  const { name, professor_id } = req.body;
  try {
    const updatedSubject = await updateSubjectService(req.params.id, name, professor_id);
    if (!updatedSubject) return res.status(404).json({ message: "Subject not found" });
    res.json(updatedSubject);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteSubject = async (req, res) => {
  try {
    const rowCount = await deleteSubjectService(req.params.id);
    if (rowCount === 0) return res.status(404).json({ message: "Subject not found" });
    res.json({ message: "Subject deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const enrollStudent = async (req, res) => {
  const { student_id } = req.body;
  try {
    const enrollment = await enrollStudentService(student_id, req.params.id);
    res.status(201).json(enrollment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const unenrollStudent = async (req, res) => {
  const { student_id } = req.body; 
  try {
    const rowCount = await unenrollStudentService(student_id, req.params.id);
    if (rowCount === 0) return res.status(404).json({ message: "Enrollment not found" });
    res.json({ message: "Student unenrolled successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getSubjectsByUser = async (req, res) => {
  try {
    const result = await findSubjectsByUser(req.params.userId);
    res.json(result);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};
