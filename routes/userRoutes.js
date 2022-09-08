import express from "express";
import {
  register,
  authUser,
  confirm,
  forgotPassword,
  checkToken,
  newPassword,
  profile,
} from "../controllers/userController.js";
import checkAuht from "../middleware/checkAuth.js";

const router = express.Router();

//Auth, Registro y Confirmacion de Usuarios

router.post("/", register);
router.post("/login", authUser);
router.get("/confirm/:token", confirm);
router.post("/forgot-password", forgotPassword);
router.route("/forgot-password/:token").get(checkToken).post(newPassword);
router.get("/profile", checkAuht, profile);


export default router
    