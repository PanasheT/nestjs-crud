import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './controllers';
import { ProfileEntity, UserEntity } from './entities';
import { UserFactory } from './factories';
import { UserService } from './services';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, ProfileEntity])],
  controllers: [UserController],
  exports: [UserService],
  providers: [UserService, UserFactory],
})
export class UserModule {}
