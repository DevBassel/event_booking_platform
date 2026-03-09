import { Request } from 'express';
import { UserRoles } from 'src/modules/users/enums/UserType.enum';

export interface IReq extends Request {
  user: {
    userId: string;
    name: string;
    role: UserRoles;
    email: string;
  };
}
