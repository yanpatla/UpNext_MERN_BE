import express from "express";
import {
  getProjects,
  newProjects,
  getProject,
  editProject,
  deleteProject,
  addPartners,
  deletePartners,
  searchPartner,
} from "../controllers/projectController.js";

import checkAuht from "../middleware/checkAuth.js";
const router = express.Router();
router.route("/").get(checkAuht, getProjects).post(checkAuht, newProjects);

router
  .route("/:id")
  .get(checkAuht, getProject)
  .put(checkAuht, editProject)
  .delete(checkAuht, deleteProject);
router.post("/partners", checkAuht, searchPartner);
router.post("/partners/:id", checkAuht, addPartners);
router.post("/delete-partners/:id", checkAuht, deletePartners);
export default router;
