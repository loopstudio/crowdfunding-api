import { Test, TestingModule } from '@nestjs/testing';

import { UsersController } from './users.controller';
import { UsersService } from '../services/users.service';
import { createUserDTO, createUserServiceResponse } from '../tests/mocks';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            createUser: jest.fn().mockResolvedValue(createUserServiceResponse),
          },
        },
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('usersController should be defined', () => {
    expect(usersController).toBeDefined();
  });

  describe('createUser method', () => {
    it('should call createUser usersService method', async () => {
      const response = await usersController.createUser(createUserDTO);

      expect(response).toStrictEqual({ data: createUserServiceResponse });
    });
  });
});
