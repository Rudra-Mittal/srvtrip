import { Request,Response } from "express";

export const signoutRoute =(req:Request, res:Response) => {
    console.log("Received signout request");
    res.clearCookie('token');
    res.status(200).json({ "message": "User signed out successfully" });
}