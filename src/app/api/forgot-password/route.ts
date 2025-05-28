import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import PasswordResetTokenModel from "@/model/passwordResetToken";
import { sendPasswordResetEmail } from "@/helpers/sendPasswordResetEmail";
import crypto, { randomBytes} from 'crypto'

export async function POST(request: Request){
    await dbConnect();

    try {
        const {email} = await request.json()
        const existingUser = await UserModel.findOne({
            email,
            isVerified: true
        })
        if(!existingUser){
            return Response.json({
                success: true,
                message: "Password reset link has been send to your email."
            },{status: 200})
        }


        const  pwResetToken= randomBytes(32).toString('hex')
        const hashedPwResetToken = crypto.createHash('sha256').update(pwResetToken).digest('hex')
        const pwResetTokenExpiry = new Date()
        pwResetTokenExpiry.setMinutes(pwResetTokenExpiry.getMinutes() + 10)

        const userId = existingUser._id

        const newPasswordResetToken = new PasswordResetTokenModel({
           pwResetToken: hashedPwResetToken,
           pwResetTokenExpiry,
           userId
        })

        await newPasswordResetToken.save()

        const emailResponse = await sendPasswordResetEmail(
            email,
            pwResetToken
        )

        if(!emailResponse.success){
            return Response.json({
                success: false,
                message: emailResponse.message
            },{status: 500})
        }

        return Response.json({
            success: true,
            message: "Password reset link has been sent to your email."
        },{status: 200})

    } catch (error) {
        console.log("Error generating password token", error)
         return Response.json({
            success: false,
            message: "Error generating password token"
        },{status: 500})
    }
}