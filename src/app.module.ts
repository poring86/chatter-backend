import { Logger, Module, UnauthorizedException } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { DatabaseModule } from './common/database/database.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { UsersModule } from './users/users.module';
import { LoggerModule } from 'nestjs-pino';
import { AuthModule } from './auth/auth.module';
import { ChatsModule } from './chats/chats.module';
import { AuthService } from './auth/auth.service';
import { PubSubModule } from './common/pubsub/pubsub.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
      }),
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useFactory: (authService: AuthService) => ({
        autoSchemaFile: true,
        subscriptions: {
          'graphql-ws': {
            onConnect: (context: any) => {
              try {
                // 1. O token é enviado no 'connectionParams' pelo cliente WS
                const authHeader = context.connectionParams?.Authorization;

                if (!authHeader) {
                  throw new UnauthorizedException(
                    'Token de conexão não encontrado.',
                  );
                }

                // 2. Cria um objeto simulado de Request
                // O authService.verifyWs espera um objeto com a estrutura { headers: { authorization: 'Bearer token' } }
                const simulatedRequest = {
                  headers: {
                    authorization: authHeader,
                  },
                } as any;

                // 3. Verifica o token e obtém o payload do usuário
                const user = authService.verifyWs(simulatedRequest);

                // Retorna o objeto de contexto que será usado nos Resolvers de Subscription
                return { user: user };
              } catch (err) {
                new Logger().error(err);
                // Lança uma exceção para abortar a conexão WebSocket
                throw new UnauthorizedException(
                  'Autenticação de WebSocket falhou.',
                );
              }
            },
          },
        },
      }),
      // Importa e injeta o AuthService, garantindo que ele esteja disponível
      imports: [AuthModule],
      inject: [AuthService],
    }),
    DatabaseModule,
    UsersModule,
    LoggerModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const isProduction = configService.get('NODE_ENV') === 'production';

        return {
          pinoHttp: {
            transport: isProduction
              ? undefined
              : {
                  target: 'pino-pretty',
                  options: {
                    singleLine: true,
                  },
                },
            level: isProduction ? 'info' : 'debug',
          },
        };
      },
      inject: [ConfigService],
    }),
    AuthModule,
    ChatsModule,
    PubSubModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
