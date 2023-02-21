import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { MessageController } from './controllers';
import { MessageEntity } from './entities';
import { MessageFactory } from './factories';
import { MessageService } from './services';

@Module({
  imports: [TypeOrmModule.forFeature([MessageEntity]), UserModule],
  controllers: [MessageController],
  exports: [MessageService],
  providers: [MessageService, MessageFactory],
})
export class MessageModule {}
