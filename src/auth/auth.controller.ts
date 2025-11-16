import { Controller, Post, UseGuards } from '@nestjs/common';
// 🛑 REMOVER ESTAS IMPORTAÇÕES, se ainda existirem:
// import { Response } from 'express';
// import { Res } from '@nestjs/common';

import { LocalAuthGuard } from './guards/local-auth.guard';
import { CurrentUser } from './current-user.decorator';
import { User } from '../users/entities/user.entity';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(
    @CurrentUser() user: User,
    // 🛑 REMOVIDO: @Res({ passthrough: true }) response: Response,
  ): Promise<{ accessToken: string }> {
    // Define o retorno esperado

    // O AuthService retorna a string do token
    const token = await this.authService.login(user);

    // ✅ NestJS serializa o objeto retornado para JSON: {"accessToken": "..."}
    return { accessToken: token };
  }

  @Post('logout')
  // ✅ CORRIGIDO: Não recebe argumentos de resposta
  logout() {
    // Chama o logout no serviço (que agora não faz nada no backend)
    this.authService.logout();
    return { message: 'Logout successful.' };
  }
}
