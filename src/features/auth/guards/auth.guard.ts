import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

import { IS_PUBLIC_KEY, IS_ALLOW_UNAUTHENTICATE_REQUEST } from '../decorators';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const allowUnauthenticatedRequest =
      this.reflector.getAllAndOverride<boolean>(
        IS_ALLOW_UNAUTHENTICATE_REQUEST,
        [context.getHandler(), context.getClass()],
      );

    const req = context.switchToHttp().getRequest();
    const isAllowed = allowUnauthenticatedRequest && !req.headers.authorization;
    if (isPublic || isAllowed) {
      return true;
    }

    return super.canActivate(context);
  }
}
