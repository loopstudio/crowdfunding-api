/* eslint-disable @typescript-eslint/no-explicit-any */
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';

import { AuthService } from './auth.service';
import { UsersService } from 'src/features/users/services/users.service';
import {
  generatedJWT,
  mongoUserWithFunctions,
  userLoginData,
} from '../tests/mocks';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    jest.resetModules();
    process.env.JWT_PRIVATE_KEY = 'asd';

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findUserByAddress: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            constructor: jest.fn(),
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('generateJWT method', () => {
    it('should call generateJWT usersRepository method and throw an Unauthorized exception', async () => {
      jest
        .spyOn(usersService, 'findUserByAddress')
        .mockResolvedValue(mongoUserWithFunctions as any);

      const modifiedUserLoginData = {
        ...userLoginData,
        publicAddress: '0xE0dEc290373abd36164C61A7d737f4e309d0Ec42',
      };

      await expect(() =>
        authService.generateJWT(modifiedUserLoginData),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should call generateJWT usersRepository method succesfully', async () => {
      jest
        .spyOn(jwtService, 'sign')
        .mockReturnValue(generatedJWT.accessToken as any);
      jest
        .spyOn(usersService, 'findUserByAddress')
        .mockResolvedValue(mongoUserWithFunctions as any);

      const response = await authService.generateJWT(userLoginData);

      expect(response).toEqual(generatedJWT);
    });
  });
});
