import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
// 🛑 REMOVER: import { Request } from 'express'; // Não é mais necessário para extração
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenPayload } from '../token-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      // ✅ CORREÇÃO AQUI: Extrair o token do cabeçalho 'Authorization: Bearer <token>'
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      secretOrKey: configService.getOrThrow('JWT_SECRET'),

      // Se você está verificando a expiração, esta linha é geralmente desnecessária,
      // pois é o comportamento padrão, mas garante que o 'exp' seja lido.
      // ignoreExpiration: false,
    });
  }

  validate(payload: TokenPayload) {
    // Se a validação for bem-sucedida, este payload é anexado a req.user
    return payload;
  }
}
