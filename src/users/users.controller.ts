import {
  BadRequestException, // Adicionado para validação manual básica
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentUser } from '../auth/current-user.decorator';
import { TokenPayload } from '../auth/token-payload.interface';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadProfilePicture(
    // 💡 O @UploadedFile() é o que "pega" o arquivo do interceptor
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          // 100KB - Se sua imagem for maior, aumente este valor
          new MaxFileSizeValidator({ maxSize: 100000 }),
          // Permite JPEG/JPG
          new FileTypeValidator({ fileType: 'image/jpeg' }),
        ],
      }),
    )
    file: Express.Multer.File,
    @CurrentUser() user: TokenPayload,
  ) {
    // Verificação extra de segurança
    if (!file || !file.buffer) {
      throw new BadRequestException('Arquivo não enviado corretamente.');
    }

    // 1. Chama o Service e recebe o objeto User COMPLETO e atualizado
    const updatedUser = await this.usersService.uploadImage(
      file.buffer,
      user._id,
    );

    // 2. Retorna o JSON formatado que o Frontend (res.json()) espera
    return {
      message: 'Profile picture uploaded successfully.',
      user: updatedUser,
    };
  }
}
