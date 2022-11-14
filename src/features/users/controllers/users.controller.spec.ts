import { Test, TestingModule } from '@nestjs/testing';

import { UsersController } from './users.controller';
import { UsersService } from '../services/users.service';
import { createUserDTO, mongoBuiltUser } from '../tests/mocks';

describe('UsersController', () => {
  let usersController: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            createUser: jest.fn().mockResolvedValue(mongoBuiltUser),
          },
        },
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
  });

  it('usersController should be defined', () => {
    expect(usersController).toBeDefined();
  });

  describe('createUser method', () => {
    it('should call createUser usersService method', async () => {
      const response = await usersController.createUser(createUserDTO);

      expect(response).toStrictEqual({ data: mongoBuiltUser });
    });
  });
});
