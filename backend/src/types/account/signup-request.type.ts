import { Request } from 'express';

export type ISignUpRequest = Request & {
  body: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    gender: string;
  };
};
