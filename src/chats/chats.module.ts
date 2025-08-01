import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsResolver } from './chats.resolver';
import { DatabaseModule } from '../common/database/database.module';
import { Chat, ChatSchema } from './entities/chat.entity';
import { ChatsRepository } from './chats.repository';
import { MessagesModule } from './messages/messages.module';

@Module({
  imports: [
    DatabaseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
    MessagesModule,
  ],
  providers: [ChatsResolver, ChatsService, ChatsRepository],
})
export class ChatsModule {}
