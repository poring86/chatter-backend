import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcryptjs';
import { LocalStorageService } from '../common/storage/local-storage.service';
import { UserDocument } from './entities/user.document';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly localStorageService: LocalStorageService,
    private readonly configService: ConfigService,
  ) {}

  async create(createUserInput: CreateUserInput) {
    const user = await this.usersRepository.create({
      ...createUserInput,
      password: await bcrypt.hash(createUserInput.password, 10),
    });
    return this.toEntity(user);
  }

  async uploadImage(file: Buffer, userId: string) {
    try {
      const key = `${userId}.jpg`;
      await this.localStorageService.upload({
        bucket: 'chatter-user-images',
        key,
        file,
      });
      const imageUrl = this.localStorageService.getObjectUrl(key);
      await this.usersRepository.findOneAndUpdate(
        { _id: userId },
        {
          $set: {
            imageUrl,
          },
        },
      );
      return imageUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }

  private async hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }

  async findAll() {
    return (await this.usersRepository.find({})).map((userDocument) =>
      this.toEntity(userDocument),
    );
  }

  async findOne(_id: string) {
    return this.toEntity(await this.usersRepository.findOne({ _id }));
  }

  async update(_id: string, updateUserInput: UpdateUserInput) {
    if (updateUserInput.password) {
      updateUserInput.password = await this.hashPassword(
        updateUserInput.password,
      );
    }
    return this.toEntity(
      await this.usersRepository.findOneAndUpdate(
        { _id },
        {
          $set: {
            ...updateUserInput,
          },
        },
      ),
    );
  }

  async remove(_id: string) {
    return this.toEntity(await this.usersRepository.findOneAndDelete({ _id }));
  }

  async verifyUser(email: string, password: string) {
    const user = await this.usersRepository.findOne({ email });
    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      throw new UnauthorizedException('Credentials are not valid.');
    }
    return this.toEntity(user);
  }

  toEntity(userDocument: UserDocument): User {
    let imageUrl = userDocument.imageUrl;
    const port = this.configService.get('PORT');
    
    console.log('toEntity processing user:', userDocument._id, 'imageUrl:', imageUrl, 'PORT:', port);

    if (imageUrl && imageUrl.includes('localhost:3001')) {
      console.log('Replacing stale port 3001 with', port);
      imageUrl = imageUrl.replace('localhost:3001', `localhost:${port}`);
    } else if (!imageUrl) {
      imageUrl = this.localStorageService.getObjectUrl(
        `${userDocument._id.toHexString()}.jpg`,
      );
    }

    const user = {
      ...userDocument,
      imageUrl,
    };
    delete user.password;
    return user;
  }
}
