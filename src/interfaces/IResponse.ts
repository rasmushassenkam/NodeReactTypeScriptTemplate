import { EStatusCode } from "../enums/EStatusCode";

export interface IResponse<T> {
    status: EStatusCode;
    response: T;
}