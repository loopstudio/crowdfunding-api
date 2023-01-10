import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

import { UsersService } from './users.service';
import { UsersRepository } from '../repositories/users/mongo/users.repository';
import {
  createUserDTO,
  generatedJWT,
  mongoBuiltUser,
  mongoUserWithFunctions,
  userLoginData,
} from '../tests/mocks';

describe('UsersService', () => {
  let usersService: UsersService;
  let usersRepository: UsersRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: {
            createUser: jest.fn().mockResolvedValue(mongoBuiltUser),
            findByAddress: jest.fn().mockResolvedValue(mongoUserWithFunctions),
          },
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    usersRepository = module.get<UsersRepository>(UsersRepository);
  });

  it('usersService should be defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('createUser method', () => {
    it('should call createUser usersRepository method', async () => {
      const response = await usersService.createUser(createUserDTO);

      expect(response).toStrictEqual(mongoBuiltUser);
    });
  });

  describe('findUserByAddress method', () => {
    it('should call findUserByAddress usersRepository method', async () => {
      const response = await usersService.findUserByAddress(
        createUserDTO.publicAddress,
      );

      expect(response).toStrictEqual(mongoUserWithFunctions);
    });

    it('should call findUserByAddress usersRepository method and throw a BadRequestException exception', async () => {
      jest.spyOn(usersRepository, 'findByAddress').mockReturnValue(null);

      await expect(() =>
        usersService.findUserByAddress(createUserDTO.publicAddress),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('generateJWT method', () => {
    it('should call generateJWT usersRepository method and throw an Unauthorized exception', async () => {
      const modifiedUserLoginData = {
        ...userLoginData,
        publicAddress: '0xE0dEc290373abd36164C61A7d737f4e309d0Ec42',
      };

      await expect(() =>
        usersService.generateJWT(modifiedUserLoginData),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should call generateJWT usersRepository method succesfully', async () => {
      const response = await usersService.generateJWT(userLoginData);

      expect(response).toEqual(generatedJWT);
    });
  });
});
