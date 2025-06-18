import { Request, Response } from "express";
import { searchQuery } from "../utils/getSimilar";
import { querySchema } from "../zod/itinerary";

export const queryRoute = (req:any, res:any) => {
  try {
    console.log("Query Route:", req.body);
    const validatedData = querySchema.parse(req.body);
    const { query, placeName, limit } = validatedData;

    searchQuery(query, placeName, limit)
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        // console.error(err);
        res.status(500).send( "Server Error" );
      });
  } catch (err: any) {
    if (err.name === "ZodError") {
      return res.status(400).send( "Invalid request data " );
    }
    console.error("Query error:", err);
    res.status(500).send("Internal Server Error" );
  }
};