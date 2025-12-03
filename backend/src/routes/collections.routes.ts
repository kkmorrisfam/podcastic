import express from "express";
import {
    getUserData,
    updateLibrary,
    updateFavorites,
    updateQueue,
} from "../controllers/collections.controller";
import { requireAuth } from "../middleware/requireAuth";

const router = express.Router();

// everything below this requires a valid JWT
router.use(requireAuth);

router.get("/:userId", getUserData);

router.post("/:userId/library", updateLibrary);
router.post("/:userId/favorites", updateFavorites);
router.post("/:userId/queue", updateQueue);

export default router;
