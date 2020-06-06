import { Document } from "mongoose";
import { IUser } from "../../../clientapp/src/interfaces/IUser";

export interface IRefreshToken extends Document {
    token: string;
    user: IUser["_id"];
    createdAt: Date;
} 