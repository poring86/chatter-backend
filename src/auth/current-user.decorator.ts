import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';

interface GraphQLContext {
  req: Request & { user: User };
}

const getCurrentUserByContext = (context: ExecutionContext): User => {
  if (context.getType() === 'http') {
    const req = context.switchToHttp().getRequest<Request & { user: User }>();
    return req.user;
  } else if (context.getType<GqlContextType>() === 'graphql') {
    const gqlContext =
      GqlExecutionContext.create(context).getContext<GraphQLContext>();
    return gqlContext.req.user;
  }

  throw new Error('Unsupported context type');
};

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): User =>
    getCurrentUserByContext(context),
);
