import { Router } from "express";
import { searchByTerm } from "../controllers/podcast.controller.js";

const router = Router();
router.get('/search', searchByTerm);


export default router;
