import express, { Request, Response } from "express";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../../models/User";
import { IResponse } from "../../interfaces/IResponse";
import { EStatusCode } from "../../enums/EStatusCode";
import { constants } from "../../config/constants";
import { IUserResponse } from "../../interfaces/IUserResponse";
import { IUser } from "../../interfaces/schemas/IUser";
import { verifyToken } from "../../utils/verifyToken";
import { IRefreshToken } from "../../interfaces/schemas/IRefreshToken";
import { RefreshToken } from "../../models/RefreshToken";

const router = express.Router();
// Register
router.post("/register", async (req: Request, res: Response) => {
    const { name, email, password, password2 } = req.body;

    if (!name || !email || !password || !password2) {
        return res.send(<IResponse<IUserResponse>>{ response: { error: "All fields needs to be filled" }, status: EStatusCode.BAD_REQUEST });
    }

    if (password !== password2) {
        return res.send(<IResponse<IUserResponse>>{ response: { error: "Passwords must match" }, status: EStatusCode.BAD_REQUEST });
    }

    if (password.length < 6) {
        return res.send(<IResponse<IUserResponse>>{ response: { error: "Password length must be at least 6" }, status: EStatusCode.BAD_REQUEST });
    }

    const user = await User.findOne({ email: email });

    if (user) {
        // User exists
        return res.send(<IResponse<IUserResponse>>{ response: { error: "Email already in use" }, status: EStatusCode.BAD_REQUEST });
    } else {
        const newUser: IUser = new User({
            name,
            email,
            password,
        });
        // Hash Password
        bcryptjs.genSalt(10, (err, salt) => {
            if (err) throw err;
            bcryptjs.hash(newUser.password, salt, async (err, hash) => {
                if (err) throw err;
                // Set password to hashed
                newUser.password = hash;
                // Save user
                await newUser.save((err) => {
                    if (err) {
                        console.log(err);
                    }
                    return res.send(<IResponse<IUserResponse>>{ response: { user: newUser }, status: EStatusCode.OK });
                });
            });
        });
    }
});

// Login
router.post("/login", async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email) {
        return res.send(<IResponse<IUserResponse>>{ response: { error: "Email is required" }, status: EStatusCode.BAD_REQUEST });
    }

    if (!password) {
        return res.send(<IResponse<IUserResponse>>{ response: { error: "Password is required" }, status: EStatusCode.BAD_REQUEST });
    }

    const user: IUser | null = await User.findOne({ email: email });

    if (user) {
        bcryptjs.compare(password, user.password, (err, response) => {
            if (err) {
                console.log(err);
            }
            if (response) {
                const { expiresIn, accessToken, refreshToken } = signToken(user._id);

                const newRefreshToken: IRefreshToken = new RefreshToken({
                    token: refreshToken,
                    user: user._id,
                    createdAt: new Date(Date.now())
                } as IRefreshToken);

                setHttpOnlyCookie(res, refreshToken);
                newRefreshToken.save();
                const token = {
                    jwtToken: accessToken,
                    expiresIn: expiresIn
                }

                return res.send(<IResponse<IUserResponse>>{ response: { user, token }, status: EStatusCode.OK });
            } else {
                return res.send(<IResponse<IUserResponse>>{ response: { error: "Password or email incorrect" }, status: EStatusCode.FORBIDDEN });
            }
        });
    } else {
        return res.send(<IResponse<IUserResponse>>{ response: { error: "Password or email incorrect" }, status: EStatusCode.FORBIDDEN });
    }

});

router.get("/logout", async (req, res) => {
    const { jwt_token } = req.cookies;
    const token: IRefreshToken | null = await RefreshToken.findOneAndDelete({ token: jwt_token });
    return res.send(<IResponse<string>>{ response: "Successfully logged out", status: EStatusCode.OK });
});

// test route, use to test auth
router.get("/test", verifyToken, async (req, res) => {
    res.send("test");
})

router.get("/me", verifyToken, async (req, res) => {
    const { jwt_token } = req.cookies;
    const decoded: any = jwt.decode(jwt_token);

    if (decoded) {
        const me: IUser | null = await User.findOne({ _id: decoded.id });
        if (me) {
            return res.send(<IResponse<IUserResponse>>{ response: { user: me }, status: EStatusCode.OK })
        } else {
            return res.send(<IResponse<IUserResponse>>{ response: { error: "Not able to authenticate" }, status: EStatusCode.FORBIDDEN });
        }
    } else {
        return res.send(<IResponse<IUserResponse>>{ response: { error: "Not able to authenticate" }, status: EStatusCode.FORBIDDEN });
    }
})

// refresh access token
router.get("/refresh_token/", async (req, res) => {
    const { jwt_token } = req.cookies;
    const token: IRefreshToken | null = await RefreshToken.findOne({ token: jwt_token });
    if (token) {
        const { expiresIn, accessToken, refreshToken } = signToken(token.user);
        // update old refresh token
        token.token = refreshToken;
        token.createdAt = new Date(Date.now())
        token.save();
        // set httpOnly cookie with refresh token
        setHttpOnlyCookie(res, refreshToken);
        // send access token to client
        const clientAccessToken = {
            jwtToken: accessToken,
            expiresIn: expiresIn
        }
        return res.send(<IResponse<IUserResponse>>{ response: { token: clientAccessToken }, status: EStatusCode.OK });
    } else {
        return res.send(<IResponse<IUserResponse>>{ response: { error: "Not able to authenticate" }, status: EStatusCode.FORBIDDEN });
    }
});

const signToken = (userId: string) => {
    const expiresIn = 900;
    const accessToken = jwt.sign({ id: userId }, constants.ACCESS_TOKEN_SECRET, { expiresIn: expiresIn });
    const refreshToken = jwt.sign({ id: userId }, constants.REFRESH_TOKEN_SECRET, { expiresIn: constants.REFRESH_TOKEN_EXPIRY_SECONDS });
    return { expiresIn, accessToken, refreshToken };
}

const setHttpOnlyCookie = (res: Response, refreshToken: string) => {
    // set httpOnly cookie with refresh token
    res.cookie("jwt_token", refreshToken, {
        maxAge: constants.REFRESH_TOKEN_EXPIRY_SECONDS * 1000,
        httpOnly: true,
        secure: false
    });
}

export const AuthRoutes = router;