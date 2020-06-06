import mongoose, { Schema } from "mongoose";
import { IRefreshToken } from "../interfaces/schemas/IRefreshToken";
import { constants } from "../config/constants";

const RefreshTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        required: true
    },
    createdAt: {
        type: Date,
        expires: constants.REFRESH_TOKEN_EXPIRY_SECONDS
    }
});

export const RefreshToken = mongoose.model<IRefreshToken>("RefreshToken", RefreshTokenSchema); 