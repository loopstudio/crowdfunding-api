import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

import { accessTokenType } from '../types';
import { UsersService } from './../../users/services/users.service';
import { User } from './../../users/schemas/user.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_PRIVATE_KEY'),
    });
  }

  async validate(userToken: accessTokenType): Promise<User> {
    const user = await this.usersService.findUserByAddress(
      userToken?.publicAddress,
    );

    return user;
  }
}
