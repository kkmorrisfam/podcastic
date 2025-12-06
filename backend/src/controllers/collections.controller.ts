
import type { Request, Response } from "express";
import User from "../models/User.js";

export async function getUserData(req: Request, res: Response) {
  try {
    const userId = (req as any).user.id;  // from JWT auth
    const user = await User.findById(userId);  //took out req.params.userid
    if (!user) return res.status(404).json({ error: "User not found" });

    return res.json({
      library: user.library,
      favorites: user.favorites,
      queue: user.queue,
      podcastLibrary: user.podcastLibrary, 
    });
  } catch (err) {
    return res.status(500).json({ error: "Failed to load user data" });
  }
}

export async function updateLibrary(req: Request, res: Response) {
  try {
    const userId = (req as any).user.id;    
    const { library } = req.body; // { [episodeId]: Episode }

    const setPaths = Object.fromEntries(
      Object.entries(library).map(([id, ep]) => [`library.${id}`, ep])
    );

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: setPaths },   //merge/update individual episodes into map
      { new: true }
    );

    return res.json({ library: user?.library });
  } catch (err) {
    return res.status(500).json({ error: "Failed to update library" });
  }
}

export async function updateFavorites(req: Request, res: Response) {
  try {
    const userId = (req as any).user.id;
    // const { userId } = req.params;
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
    const userId = (req as any).user.id;
    //const { userId } = req.params;
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

export async function updateMyPodcasts(req: Request, res: Response) {
  console.log("⏩Running updateMyPodcast");
  try {
    const userId = (req as any).user.id;
    const {podcastLibrary} = req.body as{
      podcastLibrary: Record<string, any>;
    };

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({error: "User not found"});

    const incomingIds = Object.keys(podcastLibrary);  //ids from frontend

    //get ids from database
    const libraryMap = (user.podcastLibrary as Map <string, any>) || new Map<string, any>();
    const existingIds = Array.from(libraryMap.keys());
    
    const toRemove = existingIds.filter((id) => !incomingIds.includes(id));
    
    
    //create new object on the fly with data
    const setPaths = Object.fromEntries(
      Object.entries(podcastLibrary).map(([id,pod]) => [`podcastLibrary.${id}`, pod])
    )

    const unsetPaths = Object.fromEntries(
      toRemove.map((id) => [`podcastLibrary.${id}`, ""])
    );


console.log("incomingIds:", incomingIds);
console.log("existingIds:", existingIds);
console.log("toRemove:", toRemove);
console.log("unsetPaths:", unsetPaths);

    const updated = await User.findByIdAndUpdate(
      userId,
      { $set: setPaths, $unset:unsetPaths},  //merge/update individual podcasts into map
      // {podcastLibrary},
      {new: true},
    );
    
    return res.json({podcastLibrary: user?.podcastLibrary});
  } catch (err) {
    return res.status(500).json({ error: "Failed to update my podcasts" });
  }
}