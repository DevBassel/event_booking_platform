import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from 'src/modules/decorators/role.decorator';
import { UserType } from 'src/modules/users/enums/UserType.enum';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly userServices: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const role =
      this.reflector.get(Roles, context.getHandler()) || Object.keys(UserType);

    console.log(
      '🚀 ~ role.guard.ts:18 ~ RoleGuard ~ canActivate ~ role:',
      role,
    );

    const { sub } = context.switchToHttp().getRequest().user;

    const user = await this.userServices.findOne(sub);

    if (user) {
      return role.includes(user.role);
    }

    return false;
  }
}
