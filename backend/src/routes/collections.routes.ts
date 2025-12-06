import express from "express";
import {
    getUserData,
    updateLibrary,
    updateFavorites,
    updateQueue,
    updateMyPodcasts,
} from "../controllers/collections.controller.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = express.Router();

// everything below this requires a valid JWT
router.use(requireAuth);

router.get("/me", getUserData);

router.post("/me/library", updateLibrary);
router.post("/me/favorites", updateFavorites);
router.post("/me/queue", updateQueue);
// router.post("/me/updateMyPodcasts", updateMyPodcasts);
router.post("/me/updateMyPodcasts", (req, res, next) => {
  console.log("🔥 Route /me/updateMyPodcasts hit");
  next(); // pass control to the real handler
}, updateMyPodcasts);


export default router;
