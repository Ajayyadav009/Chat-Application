import express from "express";
import { login, signup, logout }from "../controllers/auth.controller.js";
const router = express.Router();
import { protectRoute } from "../middleware/auth.middleware.js";
import { checkAuth } from "../controllers/auth.controller.js";
import { updateProfile } from "../controllers/auth.controller.js";


router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

router.put('/update-profile', protectRoute, updateProfile);

router.get("/check", protectRoute, checkAuth); 


export default router;
