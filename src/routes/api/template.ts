import {Request, Response, Router} from "express";
import { IResponse } from "../../interfaces/IResponse";
import { EStatusCode } from "../../enums/EStatusCode";

const router = Router();

router.get("/", async(req: Request, res: Response) => {
    //res.send(<IResponse>{response: "template root", status: EStatusCode.OK});
});

export const TemplateRoutes = router;