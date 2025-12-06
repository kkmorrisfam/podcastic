import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export async function registerUser(req: Request, res: Response) {
  try {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: "Missing email or password" });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ error: "Email already used" });

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email,
      passwordHash: hash,
      library: {},
      favorites: [],
      queue: [],
      podcastLibrary: {},
    });

    return res.json({ id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Register failed" });
  }
}

export async function loginUser(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(401).json({ error: "Invalid password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    return res.json({
      token,
      user: {
        id: user._id,
        firstName: user.firstName,  
        lastName: user.lastName,     
        email: user.email,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Login failed" });
  }
}

export async function getAllUsers(_req: Request, res: Response) {
  try {
    const users = await User.find({}, "firstName lastName email createdAt");

    return res.json({ users });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to load users" });
  }
}



