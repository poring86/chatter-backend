import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

export class GqlAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;

    console.log('req', req)
    
    // 👇 Logando os cookies
    console.log('📦 Cookies recebidos no AuthGuard:', req.cookies);

    return req;
  }
}
