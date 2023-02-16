import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostController } from './controllers';
import { PostService } from './services';
import { PostEntity } from './entities';

@Module({
    imports: [TypeOrmModule.forFeature([PostEntity])],
    controllers: [PostController],
    exports: [PostService],
    providers: [PostService],
})
export class PostModule {}
