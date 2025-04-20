import { z } from "zod";

export const generateItinerarySchema = z.object({
  destination: z.string().min(2),
  number_of_days: z.number().min(1).max(7),
  budget: z.number().min(100).max(1000000),
  number_of_persons: z.number().min(1).max(12),
  interests: z.array(z.string()).max(200).optional(),
});

export const querySchema = z.object({
  query: z.string().min(1),
  placeName: z.string().min(1),
  limit: z.number().min(1),
});
