import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { PostController } from './controllers';
import { PostEntity } from './entities';
import { PostFactory } from './factories';
import { PostService } from './services';

@Module({
  imports: [TypeOrmModule.forFeature([PostEntity]), UserModule],
  controllers: [PostController],
  exports: [PostService],
  providers: [PostService, PostFactory],
})
export class PostModule {}
