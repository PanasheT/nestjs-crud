import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JWT_CONFIG } from 'src/common';
import { JwtAuthGuard } from 'src/guards';
import { UserModule } from '../user/user.module';
import { AuthController } from './controllers';
import { AuthFactory } from './factories';
import { AuthService, SessionService } from './services';

@Module({
  imports: [UserModule, JwtModule.registerAsync(JWT_CONFIG)],
  controllers: [AuthController],
  exports: [JwtAuthGuard, SessionService],
  providers: [AuthService, AuthFactory, JwtAuthGuard, SessionService],
})
export class AuthModule {}
