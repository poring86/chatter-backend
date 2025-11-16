import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

export class GqlAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;

    // Coloque o console.log AQUI para ver os cookies
    console.log('📦 Cookies recebidos:', req.cookies); // Requer o middleware cookie-parser

    return req;
  }
}
