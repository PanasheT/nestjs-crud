import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { ConversationController } from './controllers';
import { ConversationEntity } from './entities';
import { ConversationFactory } from './factories/conversation.factory';
import { ConversationService } from './services';

@Module({
  imports: [TypeOrmModule.forFeature([ConversationEntity]), UserModule],
  controllers: [ConversationController],
  exports: [ConversationService],
  providers: [ConversationService, ConversationFactory],
})
export class ConversationModule {}
