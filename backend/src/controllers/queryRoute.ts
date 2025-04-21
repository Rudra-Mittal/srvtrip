import { Request, Response } from "express";
import { searchQuery } from "../utils/getSimilar";
import { querySchema } from "../zod/itinerary";

export const queryRoute = (req:any, res:any) => {
  try {
    const validatedData = querySchema.parse(req.body);
    const { query, placeName, limit } = validatedData;

    searchQuery(query, placeName, limit)
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ error: "Server Error" });
      });
  } catch (err: any) {
    if (err.name === "ZodError") {
      return res.status(400).json({ error: err.errors });
    }
    console.error("Query error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};