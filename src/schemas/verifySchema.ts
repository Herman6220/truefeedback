import {z} from "zod"

export const verifySchema = z.object({
    code: z.string().min(6, "verification code must be of at least six digits")
})