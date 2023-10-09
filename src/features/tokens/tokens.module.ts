import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { TokensService } from './services/tokens.service';
import { TokenRepository } from './repositories/mongo/tokens.repository';
import { Token, TokenSchema } from './schemas/token.schema';
import { TokensController } from './controllers/tokens.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Token.name,
        schema: TokenSchema,
      },
    ]),
  ],
  controllers: [TokensController],
  providers: [TokensService, TokenRepository],
  exports: [TokensService, TokenRepository],
})
export class TokensModule {}
