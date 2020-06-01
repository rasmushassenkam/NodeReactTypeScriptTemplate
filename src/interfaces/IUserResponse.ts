import { IUser } from "../../clientapp/src/interfaces/IUser";

export interface IUserResponse {
    user?: IUser;
    error?: string;
    token?: {
        jwtToken: string;
        expiresIn: number;
    }
}