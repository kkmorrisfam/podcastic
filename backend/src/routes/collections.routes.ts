import express from "express";
import {
    getUserData,
    updateLibrary,
    updateFavorites,
    updateQueue,
} from "../controllers/collections.controller.js";
import { requireAuth } from "../middleware/requireAuth";

const router = express.Router();

// everything below this requires a valid JWT
router.use(requireAuth);

router.get("/me", getUserData);

router.post("/me/library", updateLibrary);
router.post("/me/favorites", updateFavorites);
router.post("/me/queue", updateQueue);

export default router;
