import express from "express";
import { getTrending, searchByTerm, getPodcastDetail } from "../controllers/podcast.controller.js";

const router = express.Router();

router.get("/trending", getTrending);
router.get("/search", searchByTerm);
router.get("/detail/:id", getPodcastDetail);

export default router;
