import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            required: true
        },
        bankName: {
            type: String,
            default: "GENERAL"
        }
    },
    { timestamps: true }
);

const UserModel = mongoose.model.user || mongoose.model("user", userSchema);

export default UserModel;
