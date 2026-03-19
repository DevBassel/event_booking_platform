import { Reflector } from '@nestjs/core';
import { UserRoles } from 'src/modules/users/enums/UserType.enum';

export const Roles = Reflector.createDecorator<UserRoles[]>();
