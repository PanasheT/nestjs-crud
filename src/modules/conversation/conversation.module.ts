import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { ConversationController, MessageController } from './controllers';
import { ConversationEntity, MessageEntity } from './entities';
import { MessageFactory } from './factories';
import { ConversationFactory } from './factories/conversation.factory';
import { ConversationService, MessageService } from './services';

@Module({
  imports: [
    TypeOrmModule.forFeature([ConversationEntity, MessageEntity]),
    UserModule,
  ],
  controllers: [ConversationController, MessageController],
  exports: [ConversationService, MessageService],
  providers: [
    ConversationService,
    ConversationFactory,
    MessageService,
    MessageFactory,
  ],
})
export class ConversationModule {}
