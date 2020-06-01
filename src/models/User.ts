import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "../interfaces/schemas/IUser";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String
    }
});

export const User = mongoose.model<IUser>("User", UserSchema);