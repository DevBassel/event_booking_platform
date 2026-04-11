import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRoles } from './enums/UserType.enum';
import { NotFoundException } from '@nestjs/common';
import { User } from './entities/user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: jest.Mocked<UsersService>;

  const mockUser = {
    id: 'user-id-123',
    name: 'Test User',
    email: 'test@example.com',
    role: UserRoles.USER,
  } as User;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get(UsersService);
  });

  describe('create', () => {
    it('should call service layer to create user', async () => {
      const createUserDto: CreateUserDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password',
        role: UserRoles.USER,
      };

      usersService.create.mockResolvedValue(mockUser);

      const result = await controller.create(createUserDto);

      expect(usersService.create).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(mockUser);
    });
  });

  describe('findAll', () => {
    it('should call service layer to get paginated users', async () => {
      const page = 1;
      const limit = 10;
      const paginatedResult = {
        data: [mockUser],
        total: 1,
        pages: 1,
        page,
        limit,
      };

      usersService.findAll.mockResolvedValue(paginatedResult as any);

      const result = await controller.findAll(page, limit);

      expect(usersService.findAll).toHaveBeenCalledWith(page, limit);
      expect(result).toEqual(paginatedResult);
    });
  });

  describe('findOne', () => {
    it('should return the current user when id is "me"', async () => {
      usersService.findOne.mockResolvedValue(mockUser);

      const result = await controller.findOne('me', 'user-id-123');

      expect(usersService.findOne).toHaveBeenCalledWith('user-id-123');
      expect(result).toEqual(mockUser);
    });

    it('should return a user by id', async () => {
      usersService.findOne.mockResolvedValue(mockUser);

      const result = await controller.findOne('other-admin-id', 'user-id-123');

      expect(usersService.findOne).toHaveBeenCalledWith('other-admin-id');
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user is not found', async () => {
      usersService.findOne.mockResolvedValue(null);

      await expect(
        controller.findOne('non-existent-id', 'user-id-123'),
      ).rejects.toThrow(NotFoundException);
      expect(usersService.findOne).toHaveBeenCalledWith('non-existent-id');
    });
  });

  describe('update', () => {
    it('should selectively remove password and role for non-admins', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const updateUserDto: UpdateUserDto = {
        name: 'New Name',
        password: 'newpassword',
        role: UserRoles.ADMIN,
      };

      // In the controller, if role is NOT passed as ADMIN inside DTO, it filters them out.
      // E.g., if a USER tries to update their profile.
      const userUpdateAttempt: UpdateUserDto = {
        name: 'New Name',
        password: 'newpassword',
        role: UserRoles.USER,
      };

      usersService.update.mockResolvedValue({
        affected: 1,
        raw: [],
        generatedMaps: [],
      });

      await controller.update('user-id-123', userUpdateAttempt);

      // Verify the password and role properties were deleted before calling the service
      expect(usersService.update).toHaveBeenCalledWith('user-id-123', {
        name: 'New Name',
      });
    });

    it('should keep password and role for admins', async () => {
      const adminUpdateAttempt: UpdateUserDto = {
        name: 'New Name',
        password: 'newpassword',
        role: UserRoles.ADMIN,
      };

      usersService.update.mockResolvedValue({
        affected: 1,
        raw: [],
        generatedMaps: [],
      });

      await controller.update('user-id-123', adminUpdateAttempt);

      expect(usersService.update).toHaveBeenCalledWith(
        'user-id-123',
        adminUpdateAttempt,
      );
    });
  });

  describe('remove', () => {
    it('should call service layer to remove a user', async () => {
      usersService.remove.mockResolvedValue({ affected: 1, raw: [] });

      await controller.remove('user-id-123');

      expect(usersService.remove).toHaveBeenCalledWith('user-id-123');
    });
  });
});
