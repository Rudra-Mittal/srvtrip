import { Request,Response } from "express";

export const signoutRoute =(req:Request, res:Response) => {
    res.clearCookie('token');
    res.status(200).json({ "message": "User signed out successfully" });
}