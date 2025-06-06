import express from 'express';
import {
    createShortUrl,
    redirectFromShortUrl,
    getAllUrlsOfAuthUser
} from '../controllers/url.controllers.js';
import { isNotAuthenticated, isAuthenticated } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get("/all-urls", isAuthenticated, getAllUrlsOfAuthUser);
router.post("/create", isNotAuthenticated, createShortUrl);
router.get("/:id", redirectFromShortUrl);



export default router;
