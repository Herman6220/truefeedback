import mongoose, {Schema, Document} from "mongoose";

export interface PasswordResetToken extends Document{
    pwResetToken: string,
    pwResetTokenExpiry: Date,
    userId: string 
}

const PasswordResetTokenSchema: Schema<PasswordResetToken> = new Schema({
    pwResetToken: {
        type: String,
        required: [true, "Password reset token is required."]
    },
    pwResetTokenExpiry: {
        type: Date,
        required: [true, "Password reset token expiry is required"]
    },
    userId: {
        type: String,
        required: true
    }
})


const PasswordResetTokenModel = (mongoose.models.PasswordResetToken as mongoose.Model<PasswordResetToken>) || mongoose.model<PasswordResetToken>("PasswordResetToken", PasswordResetTokenSchema)

export default PasswordResetTokenModel;