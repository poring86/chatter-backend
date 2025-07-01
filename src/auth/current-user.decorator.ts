import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';

const getCurrentUserByContext = (context: ExecutionContext): User => {
  if (context.getType() === 'http') {
    const req = context.switchToHttp().getRequest();
    console.log('📦 HTTP Cookies:', req.cookies);
    return req.user;
  } else if (context.getType<GqlContextType>() === 'graphql') {
    const req = GqlExecutionContext.create(context).getContext().req;
    console.log('📦 GraphQL Cookies:', req.cookies);
    return req.user;
  }
};


export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) =>
    getCurrentUserByContext(context),
);
