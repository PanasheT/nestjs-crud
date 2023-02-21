import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageController } from './controllers';
import { MessageService } from './services';
import { MessageEntity } from './entities';

@Module({
    imports: [TypeOrmModule.forFeature([MessageEntity])],
    controllers: [MessageController],
    exports: [MessageService],
    providers: [MessageService],
})
export class MessageModule {}
