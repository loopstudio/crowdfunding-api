import { Test, TestingModule } from '@nestjs/testing';

import { UsersService } from './users.service';
import { UsersRepository } from '../repositories/users.repository';
import { createUserDTO, createUserServiceResponse } from '../tests/mocks';

describe('UsersService', () => {
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: {
            createUser: jest.fn().mockResolvedValue(createUserServiceResponse),
          },
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
  });

  it('usersService should be defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('createUser method', () => {
    it('should call createUser usersRepository method', async () => {
      const response = await usersService.createUser(createUserDTO);

      expect(response).toStrictEqual(createUserServiceResponse);
    });
  });
});
