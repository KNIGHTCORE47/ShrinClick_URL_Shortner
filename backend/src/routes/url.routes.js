import express from 'express';
import { createShortUrl, redirectFromShortUrl } from '../controllers/url.controllers.js';
import { isNotAuthenticated } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get("/:id", redirectFromShortUrl);
router.post("/create", isNotAuthenticated, createShortUrl);



export default router;
