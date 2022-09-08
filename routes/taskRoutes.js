import express from "express";
import {
  addTask,
  getTask,
  editTask,
  deleteTask,
  changeStateTask,
} from "../controllers/taskController.js";
import checkAuht from "../middleware/checkAuth.js";
const router = express.Router();

router.post("/", checkAuht, addTask);
router
  .route("/:id")
  .get(checkAuht, getTask)
  .put(checkAuht, editTask)
  .delete(checkAuht, deleteTask);
router.post("/state/:id", checkAuht, changeStateTask);

export default router;
  