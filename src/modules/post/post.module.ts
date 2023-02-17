import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostController } from './controllers';
import { PostEntity } from './entities';
import { PostFactory } from './factories';
import { PostService } from './services';

@Module({
  imports: [TypeOrmModule.forFeature([PostEntity])],
  controllers: [PostController],
  exports: [PostService],
  providers: [PostService, PostFactory],
})
export class PostModule {}
