/* eslint-disable @typescript-eslint/no-explicit-any */
import { Test, TestingModule } from '@nestjs/testing';

import { AuthController } from './auth.controller';
import { AuthService } from '../services/auth.service';
import { UsersService } from '../../users/services/users.service';
import {
  createUserDTO,
  mongoBuiltUser,
  generatedJWT,
  userLoginData,
} from '../tests/mocks';

describe('Tokens Controller', () => {
  let authController: AuthController;
  let authService: AuthService;
  let usersService: UsersService;

  beforeEach(async () => {
    process.env.JWT_PRIVATE_KEY = 'some-strange-key';

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findUserByAddress: jest.fn(),
          },
        },
        {
          provide: AuthService,
          useValue: {
            generateJWT: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  describe('getUserNonce method', () => {
    it('should call getUserNonce usersService method', async () => {
      jest
        .spyOn(usersService, 'findUserByAddress')
        .mockResolvedValue(mongoBuiltUser as any);

      const response = await authController.getUserNonce(
        createUserDTO.publicAddress,
      );

      expect(response).toStrictEqual({ data: mongoBuiltUser.nonce });
    });
  });

  describe('loginUser method', () => {
    it('should call loginUser usersService method', async () => {
      jest
        .spyOn(authService, 'generateJWT')
        .mockResolvedValue(generatedJWT as any);

      const response = await authController.loginUser(userLoginData);

      expect(response).toStrictEqual({ data: generatedJWT });
    });
  });
});
