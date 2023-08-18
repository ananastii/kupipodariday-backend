import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const AuthUserId = createParamDecorator(
  (data: never, context: ExecutionContext): number => {
    const request = context.switchToHttp().getRequest();
    return request.user.id;
  },
);
