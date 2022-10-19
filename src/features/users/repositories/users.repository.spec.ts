import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { HttpException } from '@nestjs/common';
import { Model } from 'mongoose';

import { UsersRepository } from './users.repository';
import { User } from '../schemas/user.schema';
import {
  createUserDTO,
  createUserServiceResponse,
  mongoBuiltUser,
} from '../tests/mocks';

describe('UsersRepository', () => {
  let usersRepository: UsersRepository;
  let userModel: Model<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersRepository,
        {
          provide: getModelToken(User.name),
          useValue: {
            create: jest.fn().mockResolvedValue(mongoBuiltUser),
            count: jest.fn().mockReturnThis(),
            exec: jest.fn().mockResolvedValue(0),
            save: jest.fn().mockResolvedValue(createUserServiceResponse),
          },
        },
      ],
    }).compile();

    userModel = module.get<Model<User>>(getModelToken(User.name));
    usersRepository = module.get<UsersRepository>(UsersRepository);
  });

  describe('createUser method', () => {
    it('should call createUser usersRepository method without errors', async () => {
      const response = await usersRepository.createUser(createUserDTO);

      expect(response).toStrictEqual(createUserServiceResponse);
    });

    it('should call createUser usersRepository method with a Precondition failed error', async () => {
      jest.spyOn(userModel, 'count').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(1),
      } as any);

      await expect(
        usersRepository.createUser(createUserDTO)
      ).rejects.toThrowError(HttpException);
    });
  });
});
