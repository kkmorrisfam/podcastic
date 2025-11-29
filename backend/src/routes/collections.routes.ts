import express from "express";
import {
    getUserData,
    updateLibrary,
    updateFavorites,
    updateQueue,
} from "../controllers/collections.controller.js";

const router = express.Router();

router.get("/:userId", getUserData);

router.post("/:userId/library", updateLibrary);
router.post("/:userId/favorites", updateFavorites);
router.post("/:userId/queue", updateQueue);

export default router;
