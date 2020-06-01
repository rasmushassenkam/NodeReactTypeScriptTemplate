import jwt from "jsonwebtoken";
import { NextFunction } from "express";
import { IResponse } from "../interfaces/IResponse";
import { EStatusCode } from "../enums/EStatusCode";
import { constants } from "../config/constants";

export const verifyToken = (req: any, res: any, next: NextFunction) => {
    // Get auth header value
    const bearerHeader = req.header("authorization");

    if (typeof bearerHeader !== "undefined") {
        // Split at the space after "bearer"
        const bearer = bearerHeader.split(" ");
        // Get token from array
        const bearerToken = bearer[1];

        try {
            const decoded: any = jwt.verify(bearerToken, constants.ACCESS_TOKEN_SECRET!);
            if (decoded) {
                if (decoded.exp < decoded.iat) {
                    res.send(<IResponse<string>>{ response: "Forbidden", status: EStatusCode.FORBIDDEN });
                }
                req.userId = decoded.id;
                next();
            } else {
                res.send(<IResponse<string>>{ response: "Forbidden", status: EStatusCode.FORBIDDEN });
            }
        } catch (err) {
            res.send(<IResponse<string>>{ response: "Forbidden", status: EStatusCode.FORBIDDEN });
        }
    } else {
        res.send(<IResponse<string>>{ response: "Forbidden", status: EStatusCode.FORBIDDEN });
    }
}