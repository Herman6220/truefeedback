import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import PasswordResetTokenModel from "@/model/passwordResetToken";
import bcrypt from "bcryptjs";
import crypto from "crypto"

export async function POST(request: Request){
    await dbConnect();

    try {
        const {token, newPassword} = await request.json()

        const hashedPwResetToken = crypto.createHash('sha256').update(token).digest('hex')

        const isTokenValid = await PasswordResetTokenModel.findOne({pwResetToken: hashedPwResetToken})
        if(!isTokenValid){
            return Response.json({
                success: false,
                message: "Password reset link is not valid"
            }, {status: 400})
        }

        const isTokenNotExpired = new Date(isTokenValid.pwResetTokenExpiry) > new Date

        if(!isTokenNotExpired){
            return Response.json({
                success: false,
                message: "Password reset link is probably expired. Get a new one."
            }, {status: 400})
        }

        

        const userId = isTokenValid.userId
        const hashedPassword = await bcrypt.hash(newPassword, 10)


        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {password: hashedPassword}
        )

        if(!updatedUser){
            return Response.json({
                success: false,
                message: "User not found"
            }, {status: 400})
        }

        return Response.json({
            success: true,
            message: "Your password has been updated successfully"
        })


        
    } catch (error) {
        console.log("Error resetting password", error)
        return Response.json({
            success: false,
            message: "Internal server error"
        }, {status: 500})
        
    }
}