import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUserEmail = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.email;
  },
);
