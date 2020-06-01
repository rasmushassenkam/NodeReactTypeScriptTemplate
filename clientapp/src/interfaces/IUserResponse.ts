import { IUser } from "./IUser";


export interface IUserResponse {
    user?: IUser;
    error?: string;
    token?: {
        jwtToken: string;
        expiresIn: number;
    }
}