import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { LoginPayload } from 'src/modules/auth/dto/LoginPayload.dto';

export const GetUser = createParamDecorator(
  (
    prop: keyof LoginPayload | undefined,
    ctx: ExecutionContext,
  ): LoginPayload | LoginPayload[keyof LoginPayload] => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const user = request.user as LoginPayload;

    return prop ? user[prop] : user;
  },
);
