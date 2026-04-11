import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRoles } from './enums/UserType.enum';
import * as bcrypt from 'bcrypt';
import * as paginationUtils from 'src/utils/pagination.utils';

jest.mock('bcrypt');
jest.mock('src/utils/pagination.utils');

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: jest.Mocked<Repository<User>>;

  const mockUser: User = {
    id: 'user-id-123',
    name: 'Test User',
    email: 'test@example.com',
    password: 'hashed-password',
    role: UserRoles.USER,
    refreshToken: null,
    organization: null,
    subscription: null,
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockQueryBuilder = {
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            save: jest.fn(),
            findOne: jest.fn(),
            findOneBy: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get(getRepositoryToken(User));
  });

  describe('create', () => {
    it('should hash the password and save the user', async () => {
      const createUserDto: CreateUserDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'plain-password',
        role: UserRoles.USER,
      };

      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');
      userRepository.save.mockResolvedValue(mockUser);

      const result = await service.create(createUserDto);

      expect(bcrypt.hash).toHaveBeenCalledWith('plain-password', 10);
      expect(userRepository.save).toHaveBeenCalledWith({
        ...createUserDto,
        password: 'hashed-password',
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe('findAll', () => {
    it('should call pagination util with query builder', async () => {
      const page = 1;
      const limit = 10;
      const paginatedResult = {
        data: [mockUser],
        total: 1,
        pages: 1,
        page: 1,
        limit: 10,
      };

      (paginationUtils.pagination as jest.Mock).mockResolvedValue(
        paginatedResult,
      );

      const result = await service.findAll(page, limit);

      expect(userRepository.createQueryBuilder).toHaveBeenCalled();
      expect(paginationUtils.pagination).toHaveBeenCalledWith(
        mockQueryBuilder,
        page,
        limit,
      );
      expect(result).toEqual(paginatedResult);
    });
  });

  describe('findOne', () => {
    it('should find user by id with relations', async () => {
      userRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findOne('user-id-123');

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'user-id-123' },
        relations: ['subscription', 'organization'],
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe('update', () => {
    it('should update user by id', async () => {
      const updateUserDto: UpdateUserDto = { name: 'Updated Name' };
      userRepository.update.mockResolvedValue({
        affected: 1,
        raw: [],
        generatedMaps: [],
      });

      await service.update('user-id-123', updateUserDto);

      expect(userRepository.update).toHaveBeenCalledWith(
        { id: 'user-id-123' },
        updateUserDto,
      );
    });
  });

  describe('remove', () => {
    it('should delete user by id', async () => {
      userRepository.delete.mockResolvedValue({ affected: 1, raw: [] });

      await service.remove('user-id-123');

      expect(userRepository.delete).toHaveBeenCalledWith({ id: 'user-id-123' });
    });
  });

  describe('findOneByEmail', () => {
    it('should find user by email', async () => {
      userRepository.findOneBy.mockResolvedValue(mockUser);

      const result = await service.findOneByEmail('test@example.com');

      expect(userRepository.findOneBy).toHaveBeenCalledWith({
        email: 'test@example.com',
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe('updateUserRefreshToken', () => {
    it('should update the user refresh token', async () => {
      userRepository.update.mockResolvedValue({
        affected: 1,
        raw: [],
        generatedMaps: [],
      });

      await service.updateUserRefreshToken('user-id-123', 'new-token');

      expect(userRepository.update).toHaveBeenCalledWith(
        { id: 'user-id-123' },
        { refreshToken: 'new-token' },
      );
    });
  });
});
