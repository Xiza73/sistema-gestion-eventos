import { Router } from "express";
import {
  renderNoteForm,
  createNewNote,
  createNewExhibitor,
  getExhibitors,
  renderNotes,
  renderEditForm,
  updateNote,
  deleteNote,
} from "../controllers/notes.controller";
import { isAuthenticated } from "../helpers/auth";

const router = Router();

// New Note
router.get("/notes/add", isAuthenticated, renderNoteForm);

router.post("/notes/new-note", isAuthenticated, createNewNote);
router.post("/notes/new-exhibitor", isAuthenticated, createNewExhibitor);

// Get All Notes
router.get("/notes", isAuthenticated, renderNotes);
router.get("/notes/exhibitors", isAuthenticated, getExhibitors);

// Edit Notes
router.get("/notes/edit/:id", isAuthenticated, renderEditForm);

router.put("/notes/edit-note/:id", isAuthenticated, updateNote);

// Delete Notes
router.delete("/notes/delete/:id", isAuthenticated, deleteNote);

export default router;
