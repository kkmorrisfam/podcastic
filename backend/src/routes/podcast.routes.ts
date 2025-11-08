import { Router } from "express";
import { searchByTerm } from "../controllers/podcast.controller.js";
import { getTrending } from "../controllers/podcast.controller.js";

const router = Router();

router.get('/search', searchByTerm);
router.get('/trending', getTrending);

export default router;
