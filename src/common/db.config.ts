import { ConfigModule, ConfigService } from '@nestjs/config';
import { CommonSubscriber, UserSubscriber } from 'src/subscribers';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export const DB_CONFIG: any = {
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => ({
    type: 'postgres',
    url: configService.get<string>('DB_URL'),
    synchronize: true,
    autoLoadEntities: true,
    namingStrategy: new SnakeNamingStrategy(),
    subscribers: [UserSubscriber, CommonSubscriber],
  }),
  inject: [ConfigService],
};
