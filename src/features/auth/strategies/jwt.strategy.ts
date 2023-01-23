import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { accessTokenType } from '../types';
import { UsersService } from './../../users/services/users.service';
import { User } from './../../users/schemas/user.schema';

const { JWT_PRIVATE_KEY } = process.env;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_PRIVATE_KEY,
    });
  }

  async validate(userToken: accessTokenType): Promise<User> {
    const user = await this.usersService.findUserByAddress(
      userToken?.publicAddress,
    );

    return user;
  }
}
