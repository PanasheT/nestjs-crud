import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from 'src/guards';
import { UserModule } from '../user/user.module';
import { AuthController } from './controllers';
import { AuthFactory } from './factories';
import { AuthService, SessionService } from './services';

@Module({
  imports: [
    UserModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('TOKEN_SECRET'),
        signOptions: {
          expiresIn: configService.get<number>('TOKEN_DURATION'),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  exports: [JwtAuthGuard, SessionService],
  providers: [AuthService, AuthFactory, JwtAuthGuard, SessionService],
})
export class AuthModule {}
