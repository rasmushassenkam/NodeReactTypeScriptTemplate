import { observable, action } from "mobx";
import { IUser } from "../interfaces/IUser";
import { apiEndpoint } from "../constants/config";
import { IResponse } from "../interfaces/response/IResponse";
import { IUserResponse } from "../interfaces/IUserResponse";
import { EStatusCode } from "../enums/response/EStatusCode";
import axios from "../utils/axios/apiClient";
import { getIsTokenExpired } from "../utils/auth/getIsTokenExpired";

class UserStore {
    @observable user: IUser | undefined = undefined;
    @observable token: string | undefined = undefined;
    @observable errorText: string | undefined = undefined;

    @action setUser = (user: IUser | undefined) => {
        this.user = user;
    }
    @action setToken = (token: string | undefined) => {
        this.token = token;
    }
    @action setErrorText = (errorText: string | undefined) => {
        this.errorText = errorText;
    }

    @action logoutUser = async () => {
        this.setToken(undefined);
        this.setUser(undefined);
        localStorage.setItem("logout", Date.now().toString());
        await this.logout();
    }

    // test request, use to test auth
    public test = async () => {
        if (getIsTokenExpired()) {
            await this.refreshToken();
            await axios.get("/auth/test", { headers: { Authorization: "Bearer " + this.token } });
        } else {
            await axios.get("/auth/test", { headers: { Authorization: "Bearer " + this.token } });
        }

    }

    public refreshToken = async () => {
        try {
            const response = await axios.get<IResponse<IUserResponse>>("/auth/refresh_token/");
            if (response.data.status === EStatusCode.OK) {
                this.setErrorText(undefined);
                this.setToken(response.data.response.token?.jwtToken);
                this.setUser(response.data.response.user);
            }
        } catch (err) {
            console.log(err);
            //todo: handle this somehow
            //throw Error("Something went terribly wrong");
        }
    }

    public authenticateUser = async (email: string, password: string) => {
        try {
            const response = await axios.post<IResponse<IUserResponse>>("/auth/login", {
                email,
                password
            });
            if (response.data.status === EStatusCode.OK) {
                this.setErrorText(undefined);
                this.setToken(response.data.response.token?.jwtToken);
                this.setUser(response.data.response.user);

                if (response.data.response.token) {
                    const now = new Date(Date.now());
                    now.setSeconds(now.getSeconds() + response.data.response.token.expiresIn);
                    localStorage.setItem("jwt_expiry", now.toString());
                }
            } else {
                this.setErrorText(response.data.response.error);
            }
        } catch (err) {
            console.log(err);
            //todo: handle this somehow
            //throw Error("Something went terribly wrong");
        }
    }

    public registerUser = async (name: string, email: string, password: string, password2: string) => {
        try {
            const response = await axios.post<IResponse<IUserResponse>>(apiEndpoint + "/auth/register", {
                name,
                email,
                password,
                password2
            });
            if (response.data.status === EStatusCode.OK) {
                this.setErrorText(undefined);
                this.setUser(response.data.response.user);
            } else if (response.data.status === EStatusCode.BAD_REQUEST) {
                this.setErrorText(response.data.response.error);
            }
        } catch (err) {
            console.log(err);
            //todo: handle this somehow
            throw Error("Something went terribly wrong");
        }
    }
    public logout = async () => {
        try {
            await axios.get("/auth/logout");
        } catch (err) {
            console.log(err);
            //todo: handle this somehow
            //throw Error("Something went terribly wrong");
        }
    }
}

export const userStore = new UserStore();