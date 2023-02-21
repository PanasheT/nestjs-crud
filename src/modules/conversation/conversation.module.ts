import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConversationController } from './controllers';
import { ConversationService } from './services';
import { ConversationEntity } from './entities';

@Module({
    imports: [TypeOrmModule.forFeature([ConversationEntity])],
    controllers: [ConversationController],
    exports: [ConversationService],
    providers: [ConversationService],
})
export class ConversationModule {}
