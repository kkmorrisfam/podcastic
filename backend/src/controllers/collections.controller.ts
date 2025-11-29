
import type { Request, Response } from "express";
import User from "../models/User.js";

export async function getUserData(req: Request, res: Response) {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    return res.json({
      library: user.library,
      favorites: user.favorites,
      queue: user.queue,
    });
  } catch (err) {
    return res.status(500).json({ error: "Failed to load user data" });
  }
}

export async function updateLibrary(req: Request, res: Response) {
  try {
    const { userId } = req.params;
    const { library } = req.body; // { [episodeId]: Episode }

    const user = await User.findByIdAndUpdate(
      userId,
      { library },
      { new: true }
    );

    return res.json({ library: user?.library });
  } catch (err) {
    return res.status(500).json({ error: "Failed to update library" });
  }
}

export async function updateFavorites(req: Request, res: Response) {
  try {
    const { userId } = req.params;
    const { favorites } = req.body; // string[]

    const user = await User.findByIdAndUpdate(
      userId,
      { favorites },
      { new: true }
    );

    return res.json({ favorites: user?.favorites });
  } catch (err) {
    return res.status(500).json({ error: "Failed to update favorites" });
  }
}

export async function updateQueue(req: Request, res: Response) {
  try {
    const { userId } = req.params;
    const { queue } = req.body; // { episodeId }[]

    const user = await User.findByIdAndUpdate(
      userId,
      { queue },
      { new: true }
    );

    return res.json({ queue: user?.queue });
  } catch (err) {
    return res.status(500).json({ error: "Failed to update queue" });
  }
}
