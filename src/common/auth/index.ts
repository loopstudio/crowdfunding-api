import { ConfigModule, ConfigService } from '@nestjs/config';

import { TOKEN_EXPIRATION_TIME } from '../constants';

export const authInitializationFactory = {
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => ({
    secret: configService.get<string>('JWT_PRIVATE_KEY'),
    signOptions: {
      expiresIn: TOKEN_EXPIRATION_TIME,
    },
  }),
  inject: [ConfigService],
};
