import express from "express";
import { getTrending, searchByTerm } from "../controllers/podcast.controller.js";

const router = express.Router();

router.get("/trending", getTrending);
router.get("/search", searchByTerm);

export default router;
