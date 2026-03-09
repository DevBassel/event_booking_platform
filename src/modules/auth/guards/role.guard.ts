import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from 'src/modules/decorators/role.decorator';
import { UserRoles } from 'src/modules/users/enums/UserType.enum';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const role =
      this.reflector.get(Roles, context.getHandler()) || Object.keys(UserRoles);

    const user = context.switchToHttp().getRequest().user;

    if (user) return role.includes(user.role);

    return false;
  }
}
