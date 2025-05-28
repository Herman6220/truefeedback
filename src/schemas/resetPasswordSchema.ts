import { z } from "zod";

export const resetPasswordSchema = z.object({
    newPassword: z.string(),
    confirmNewPassword: z.string()
}).refine(data => data.newPassword === data.confirmNewPassword, {
    path: ["confirmNewPassword"],
    message: "Passwords do not match"
})