import { Injectable } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
// 🛑 REMOVER: import { Response } from 'express'; // Não precisamos mais disso
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from './token-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * ✅ NOVO LOGIN: Gera o token JWT e o retorna como string.
   * 🛑 Removemos o argumento 'response'.
   */
  async login(user: User): Promise<string> {
    // Mudar a assinatura para não receber Response
    // 🛑 REMOVER: A lógica de 'expires' do cookie não é mais necessária aqui
    // const expires = new Date(); ...

    const tokenPayload: TokenPayload = {
      _id: user._id.toHexString(),
      email: user.email,
    };

    const token = this.jwtService.sign(tokenPayload);

    // 🛑 REMOVER: A manipulação do cookie
    // response.cookie('Authentication', token, { ... });

    // Retorna o token em vez de defini-lo em um cookie
    return token;
  }

  verifyWs(request: Request): TokenPayload {
    // O tipo 'any' força o TypeScript a aceitar qualquer propriedade,
    // mas é mais seguro usar uma interface específica se você souber qual é.
    const headers = request.headers as any;

    // Acessa o cabeçalho 'authorization' no objeto 'headers'
    const authHeader: string = headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error(
        'Authorization header not found or not in "Bearer <token>" format',
      );
    }

    const jwt: string = authHeader.split(' ')[1];
    return this.jwtService.verify(jwt);
  }

  /**
   * ✅ NOVO LOGOUT: No modelo Bearer Token, o logout é puramente no cliente (apagar localStorage).
   * 🛑 Removemos o argumento 'response' e o corpo do método.
   */
  logout() {
    // Apenas um placeholder. A lógica de revogação/blacklist, se necessária, iria aqui.
  }
}
