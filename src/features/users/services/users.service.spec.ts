import { Test, TestingModule } from '@nestjs/testing';

import { UsersService } from './users.service';
import { UsersRepository } from '../repositories/users/mongo/users.repository';
import { createUserDTO, mongoBuiltUser } from '../tests/mocks';

describe('UsersService', () => {
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: {
            createUser: jest.fn().mockResolvedValue(mongoBuiltUser),
            findByAddress: jest.fn().mockResolvedValue(mongoBuiltUser),
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

      expect(response).toStrictEqual(mongoBuiltUser);
    });
  });

  describe('findUserByAddress method', () => {
    it('should call findUserByAddress usersRepository method', async () => {
      const response = await usersService.findUserByAddress(
        createUserDTO.publicAddress,
      );

      expect(response).toStrictEqual(mongoBuiltUser);
    });
  });
});
