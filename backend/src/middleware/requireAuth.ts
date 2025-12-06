import type { Request, Response, NextFunction } from "express";
import jwt, {JwtPayload} from "jsonwebtoken";

interface DecodedToken extends JwtPayload {
    id:string;
}

export function requireAuth(req:Request, res:Response, next:NextFunction) {
    const authHeader = req.headers.authorization;

    // expect Authoriation:Bearer<Token>
    if (!authHeader || !authHeader.startsWith("Bearer")) {
        return res.status(401).json({error:"Authorization token missing"});
    }

    const token = authHeader?.split(" ")[1];

     if (!process.env.JWT_SECRET) {
        console.error("JWT_SECRET is not set");
        return res.status(500).json({ error: "Server configuration error" });
        }

    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;

        //attach the user info to the request
        (req as any).user = {id:decoded.id};

        return next();
    } catch (err) {
        console.error("JWT verify error: ", err);
        return res.status(401).json({error: "Invalid or expired token"});
    }

}

