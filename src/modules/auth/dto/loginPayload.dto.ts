import { UserType } from 'src/modules/users/enums/UserType.enum';

export interface LoginPayload {
  sub: any;
  name: string;
  role: UserType;
  type: 'access' | 'refresh';
}
