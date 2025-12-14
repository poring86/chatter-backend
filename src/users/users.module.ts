import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { UsersRepository } from './users.repository';
import { DatabaseModule } from '../common/database/database.module';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UserSchema } from './entities/user.document';
import { LocalStorageService } from '../common/storage/local-storage.service';

@Module({
  imports: [
    DatabaseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UsersResolver, UsersService, UsersRepository, LocalStorageService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
