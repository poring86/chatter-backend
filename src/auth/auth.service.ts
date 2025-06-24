import { Injectable } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from './token-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async login(user: User, response: Response): Promise<void> {
    const expires = new Date();

    // Converte a variável de ambiente para número de forma segura
    const jwtExpiration = Number(
      this.configService.getOrThrow('JWT_EXPIRATION'),
    );

    expires.setSeconds(expires.getSeconds() + jwtExpiration);

    const tokenPayload: TokenPayload = {
      _id: user._id.toHexString(),
      email: user.email,
    };

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const token = await this.jwtService.signAsync(tokenPayload);

    response.cookie('Authentication', token, {
      httpOnly: true,
      expires,
    });
  }
}
