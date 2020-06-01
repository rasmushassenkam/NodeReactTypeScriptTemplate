import { EStatusCode } from "../../enums/response/EStatusCode";

export interface IResponse<T> {
    status: EStatusCode;
    response: T;
}