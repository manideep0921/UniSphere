import { z } from "zod";

export const feedbackSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(120),
  email: z.union([z.literal(""), z.string().trim().email()]).optional(),
  phone: z.string().trim().max(20).optional(),
  stationId: z.union([z.literal(""), z.string().uuid()]).optional(),
  rating: z.number().int().min(1).max(5),
  message: z.string().trim().min(5, "Please share a few details").max(2000),
  turnstileToken: z.string().min(1, "Please complete the verification"),
});

export type FeedbackInput = z.infer<typeof feedbackSchema>;
