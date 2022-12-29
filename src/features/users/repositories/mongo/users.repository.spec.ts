/* eslint-disable @typescript-eslint/no-explicit-any */

import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';

import { UsersRepository } from './users.repository';
import { User } from '../../schemas/user.schema';
import { createUserDTO, mongoBuiltUser } from '../../tests/mocks';

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
            count: jest.fn(),
            exec: jest.fn(),
            create: jest.fn(),
            findOne: jest.fn(),
            lean: jest.fn(),
          },
        },
      ],
    }).compile();

    userModel = module.get<Model<User>>(getModelToken(User.name));
    usersRepository = module.get<UsersRepository>(UsersRepository);
  });

  describe('createUser method', () => {
    it('should call createUser usersRepository method without errors', async () => {
      jest.spyOn(userModel, 'count').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mongoBuiltUser),
      } as any);
      jest.spyOn(userModel, 'create').mockImplementation(() => mongoBuiltUser);

      const response = await usersRepository.createUser(createUserDTO);

      expect(response).toStrictEqual(mongoBuiltUser);
    });
  });

  describe('findByAddress method', () => {
    it('should get user by public address', async () => {
      jest.spyOn(userModel, 'findOne').mockReturnValue({
        lean: jest.fn().mockResolvedValue(mongoBuiltUser),
      } as any);

      const response = await usersRepository.findByAddress(
        mongoBuiltUser.publicAddress,
      );

      expect(response).toStrictEqual(mongoBuiltUser);
    });

    it('should throw NotFoundException', async () => {
      jest.spyOn(userModel, 'findOne').mockReturnValue({
        lean: jest.fn().mockResolvedValue(null),
      } as any);

      await expect(
        usersRepository.findByAddress(mongoBuiltUser.publicAddress),
      ).rejects.toThrowError(new NotFoundException());
    });
  });
});
