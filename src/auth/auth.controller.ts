import { Controller, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';

import { CurrentUser } from './current-user.decorator';
import { User } from '../users/entities/user.entity';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) response: Response,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    await this.authService.login(user, response);
  }
}
