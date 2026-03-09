import { UserRoles } from 'src/modules/users/enums/UserType.enum';

export interface LoginPayload {
  sub: any;
  name: string;
  role: UserRoles;
  type: 'access' | 'refresh';
}
