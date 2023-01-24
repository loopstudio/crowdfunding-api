import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { TOKEN_EXPIRATION_TIME } from '../../common/constants/index';

const { JWT_PRIVATE_KEY } = process.env;

@Module({
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: JWT_PRIVATE_KEY,
      signOptions: { expiresIn: TOKEN_EXPIRATION_TIME },
    }),
  ],
})
export class AuthModule {}
