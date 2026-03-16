import { UserRoles } from 'src/modules/users/enums/UserType.enum';

export interface TokenPayload {
  userId: any;
  name: string;
  role: UserRoles;
  type: 'access' | 'refresh';
}
