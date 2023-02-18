import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSubscriber } from 'src/subscribers';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { AuthModule } from './auth/auth.module';
import { PostModule } from './post/post.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.register({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DB_URL'),
        synchronize: true,
        autoLoadEntities: true,
        namingStrategy: new SnakeNamingStrategy(),
        subscribers: [UserSubscriber],
      }),
      inject: [ConfigService],
    }),
    UserModule,
    PostModule,
    AuthModule,
  ],
})
export class AppModule {}
