import { IUser } from '../../../features/users/schemas/user.schema';

declare module 'express' {
  export interface Request {
    user?: IUser;
  }
}
