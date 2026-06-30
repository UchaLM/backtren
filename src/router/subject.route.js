import { Router } from "express";
import {
  getSubjects,
  getSubject,
  createSubject,
  updateSubject,
  deleteSubject,
  enrollStudent,
  unenrollStudent,
  getSubjectsByUser
} from "../controllers/subject.controller.js";

const router = Router();

router.get("/", getSubjects);
router.get("/:id", getSubject);
router.post("/", createSubject);
router.put("/:id", updateSubject);
router.delete("/:id", deleteSubject);

router.post("/:id/enroll", enrollStudent);
router.delete("/:id/enroll", unenrollStudent);

// Special route for cursan/dictan
router.get("/user/:userId", getSubjectsByUser);

export default router;
