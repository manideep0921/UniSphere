import { z } from "zod";

export const franchiseLeadSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name").max(120),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9+\-\s]{7,20}$/, "Please enter a valid phone number"),
  email: z.union([z.literal(""), z.string().trim().email()]).optional(),
  city: z.string().trim().max(120).optional(),
  state: z.string().trim().max(120).optional(),
  preferredLocation: z.string().trim().max(240).optional(),
  hasLand: z.boolean(),
  propertyType: z.string().trim().max(120).optional(),
  investmentRange: z.string().trim().max(120).optional(),
  message: z.string().trim().max(2000).optional(),
  turnstileToken: z.string().min(1, "Please complete the verification"),
});

export type FranchiseLeadInput = z.infer<typeof franchiseLeadSchema>;
