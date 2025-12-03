import express from "express";
import { getTrending, searchByTerm, getPodcastDetail, getEpisodes, getEpisodeById } from "../controllers/podcast.controller";

const router = express.Router();

router.get("/trending", getTrending);
router.get("/search", searchByTerm);
router.get("/detail/:id", getPodcastDetail);
router.get("/episodes/byfeedid/:feedid", getEpisodes); // get episodes for one podcast feedid
router.get("/episodes/byid/:id", getEpisodeById);  // get one episode

export default router;
