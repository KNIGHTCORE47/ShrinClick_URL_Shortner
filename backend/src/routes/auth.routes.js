import express from 'express';
import {
    checkAuth,
    logInUserAccount,
    registerUserAccount,
    logOutUserAccount
} from '../controllers/auth.controllers.js';
import { isAuthenticated } from '../middleware/auth.middleware.js'

const router = express.Router();


router.get("/check-auth", isAuthenticated, checkAuth);
router.post("/register", registerUserAccount);
router.post("/login", logInUserAccount);
router.post("/logout", logOutUserAccount);


export default router;