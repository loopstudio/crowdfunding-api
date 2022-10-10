import { ConfigModule, ConfigService } from '@nestjs/config';

export const dbConnectionFactory = {
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => ({
    uri: configService.get<string>('MONGO_URI_CONNECTION'),
  }),
  inject: [ConfigService],
};
