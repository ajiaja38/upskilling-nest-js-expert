import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Model } from 'mongoose';
import User from './schema/user.schema';
import { RoleService } from '../role/role.service';
import { MessageService } from '../message/message.service';
import { TimezoneService } from '../timezone/timezone.service';
import UserRoleTrx from '../role/schema/userRole.schema';
import { BadRequestException } from '@nestjs/common';

describe('UserService', () => {
  let userService: UserService;
  let userModel: Model<User>;
  let cacheService: Cache;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            findOneAndUpdate: jest.fn(),
            deleteOne: jest.fn(),
            aggregate: jest.fn(),
            save: jest.fn(),
            db: {
              startSession: jest.fn().mockReturnValue({
                startTransaction: jest.fn(),
                commitTransaction: jest.fn(),
                abortTransaction: jest.fn(),
                endSession: jest.fn(),
              }),
            },
          },
        },
        {
          provide: getModelToken(UserRoleTrx.name),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            deleteOne: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
        {
          provide: RoleService,
          useValue: {
            getOrSave: jest.fn(),
            getRoleTrxByUserId: jest.fn(),
            getRoleById: jest.fn(),
            deleteRoleTrxByUserId: jest.fn(),
          },
        },
        {
          provide: MessageService,
          useValue: {
            setMessage: jest.fn(),
          },
        },
        {
          provide: TimezoneService,
          useValue: {
            getTimeZone: jest.fn(),
          },
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userModel = module.get<Model<User>>(getModelToken(User.name));
    cacheService = module.get<Cache>(CACHE_MANAGER);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('getAllUser', () => {
    it('should return all users from cache if available', async () => {
      const cachedUsers = [
        {
          id: '1',
          email: 'test@example.com',
          roles: ['CUSTOMER'],
          createdAt: '2022-01-01T00:00:00Z',
          updatedAt: '2022-01-01T00:00:00Z',
        },
      ];
      jest.spyOn(cacheService, 'get').mockResolvedValue(cachedUsers);

      const result = await userService.getAllUser();

      expect(result).toEqual(cachedUsers.reverse());
      expect(cacheService.get).toHaveBeenCalledWith('allUser');
    });

    it('should throw BadRequestException if an error occurs', async () => {
      jest.spyOn(cacheService, 'get').mockResolvedValue(null);
      jest.spyOn(userModel, 'find').mockRejectedValue(new Error('error'));

      await expect(userService.getAllUser()).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
