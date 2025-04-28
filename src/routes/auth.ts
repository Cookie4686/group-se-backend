import { Router } from "express";
import { protect, readToken } from "../middleware.js";
import { register, login, me, logout } from "../controllers/auth.js";
import { checkBan } from "../controllers/banIssue.js";

const router = Router();
router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/me", readToken, protect, me);
router.get("/checkBan", readToken, protect, checkBan);

export default router;
