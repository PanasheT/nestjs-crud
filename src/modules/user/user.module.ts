import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './controllers';
import { ProfileEntity, UserEntity } from './entities';
import { UserFactory } from './factories';
import { ProfileFactory } from './factories/profile.factory';
import { ProfileService, UserService } from './services';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, ProfileEntity])],
  controllers: [UserController],
  exports: [UserService, ProfileService],
  providers: [UserService, UserFactory, ProfileService, ProfileFactory],
})
export class UserModule {}
