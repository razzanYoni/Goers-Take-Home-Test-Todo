import { Request } from 'express';

interface BlogPayload {
  uid: number;
  usr: string;
  fgp: string;
  exp: number;
  nbf: number;
  iss: string;
}

interface UserRequest extends Request {
    user: BlogPayload;
}

export { UserRequest, BlogPayload };