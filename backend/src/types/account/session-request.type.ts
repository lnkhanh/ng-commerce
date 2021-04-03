import { Request } from "express";
import { IAccountModel } from "@src/types/account.type";

export type ISessionRequest = Request & {
  user?: IAccountModel;
  visitorId: string;
  isVisitor: boolean;
  sessionID: string;
  session: {
    user?: string;
  };
  query?: {
    [key: string]: any
  };
  files: any;
  flash: (type: string, param?: string) => void;
};
