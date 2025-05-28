import {resend} from "@/lib/resend";
import PasswordResetEmail from "../../emails/PasswordResetEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendPasswordResetEmail(
    email: string,
    token: string
): Promise<ApiResponse>{
    try {
        await resend.emails.send({
            from: "onboarding@resend.dev",
            to: email,
            subject: "Anonymouse Message | Password Reset Email",
            react: PasswordResetEmail({token})
        })
        return {success: true, message: "Password reset email sent successfully."}
    } catch (error) {
        console.error("Error sending password reset emails", error)
        return {success: false, message: "Failed to send password reset email."}
    }
}