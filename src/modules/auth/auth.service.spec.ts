import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserRoles } from '../users/enums/UserType.enum';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { OrganizationService } from '../organization/organization.service';
import {
  BadRequestException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let organizationService: jest.Mocked<OrganizationService>;
  let jwtService: jest.Mocked<JwtService>;

  const mockUser = {
    id: 'user-id-123',
    name: 'Test User',
    email: 'test@test.com',
    password: 'hashed-password',
    role: UserRoles.USER,
    refreshToken: null,
  } as User;

  const createUserDto: CreateUserDto = {
    email: 'test@test.com',
    role: UserRoles.USER,
    name: 'Test User',
    password: 'plain-password',
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findOneByEmail: jest.fn(),
            create: jest.fn(),
            updateUserRefreshToken: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: { getOrThrow: jest.fn().mockReturnValue('1h') },
        },
        {
          provide: OrganizationService,
          useValue: { create: jest.fn() },
        },
        {
          provide: JwtService,
          useValue: { sign: jest.fn(), verify: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get(UsersService);
    organizationService = module.get(OrganizationService);
    jwtService = module.get(JwtService);
  });

  describe('register', () => {
    it('should throw BadRequestException if role is ADMIN', async () => {
      await expect(
        service.register({ ...createUserDto, role: UserRoles.ADMIN }),
      ).rejects.toThrow(BadRequestException);
      expect(usersService.findOneByEmail).not.toHaveBeenCalled();
    });

    it('should throw ConflictException if email already exists', async () => {
      usersService.findOneByEmail.mockResolvedValue(mockUser);
      await expect(service.register(createUserDto)).rejects.toThrow(
        ConflictException,
      );
      expect(usersService.create).not.toHaveBeenCalled();
    });

    it('should successfully register a normal user', async () => {
      usersService.findOneByEmail.mockResolvedValue(null);
      usersService.create.mockResolvedValue(mockUser);

      const result = await service.register(createUserDto);

      expect(usersService.findOneByEmail).toHaveBeenCalledWith(
        createUserDto.email,
      );
      expect(usersService.create).toHaveBeenCalledWith(createUserDto);
      expect(organizationService.create).not.toHaveBeenCalled();
      expect(result).toEqual({ msg: 'User Registered Successfully' });
    });

    it('should throw BadRequestException if user creation fails', async () => {
      usersService.findOneByEmail.mockResolvedValue(null);
      usersService.create.mockResolvedValue(null as any);

      await expect(service.register(createUserDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should successfully register an organizer and create organization', async () => {
      const orgDto: any = {
        ...createUserDto,
        role: UserRoles.ORGANIZER,
        organization: { name: 'My Org' },
      };
      usersService.findOneByEmail.mockResolvedValue(null);
      usersService.create.mockResolvedValue(mockUser);

      const result = await service.register(orgDto);

      expect(usersService.create).toHaveBeenCalledWith(orgDto);
      expect(organizationService.create).toHaveBeenCalledWith(
        { name: 'My Org' },
        mockUser.id,
      );
      expect(result).toEqual({ msg: 'User Registered Successfully' });
    });
  });

  describe('validateUser', () => {
    it('should throw UnauthorizedException if user not found', async () => {
      usersService.findOneByEmail.mockResolvedValue(null);

      await expect(
        service.validateUser('test@test.com', 'pwd'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password does not match', async () => {
      usersService.findOneByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.validateUser('test@test.com', 'wrong'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should return user if credentials are valid', async () => {
      usersService.findOneByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser('test@test.com', 'correct');
      expect(result).toEqual(mockUser);
    });
  });

  describe('login', () => {
    it('should generate tokens, update refresh token and return user data with tokens', async () => {
      const loginDto = { email: 'test@test.com', password: 'password' };

      usersService.findOneByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      jwtService.sign
        .mockReturnValueOnce('access_token')
        .mockReturnValueOnce('refresh_token');

      const result = await service.login(loginDto);

      expect(jwtService.sign).toHaveBeenCalledTimes(2);
      expect(usersService.updateUserRefreshToken).toHaveBeenCalledWith(
        mockUser.id,
        'refresh_token',
      );
      expect(result).toEqual({
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
        access_token: 'access_token',
        refresh_token: 'refresh_token',
      });
    });
  });

  describe('refreshToken', () => {
    it('should throw BadRequestException if token is expired', async () => {
      jwtService.verify.mockImplementation(() => {
        const error = new Error('jwt expired');
        error.name = 'TokenExpiredError';
        throw error;
      });

      await expect(service.refreshToken('expired-token')).rejects.toThrow(
        'Refresh Token is expired',
      );
    });

    it('should throw BadRequestException if token is invalid (other error)', async () => {
      jwtService.verify.mockImplementation(() => {
        throw new Error('invalid token');
      });

      await expect(service.refreshToken('invalid-token')).rejects.toThrow(
        'Invalid Refresh Token',
      );
    });

    it('should throw BadRequestException if token type is not refresh', async () => {
      jwtService.verify.mockReturnValue({ type: 'access' });

      await expect(service.refreshToken('access-token')).rejects.toThrow(
        'Invalid token type',
      );
    });

    it('should throw BadRequestException if user not found', async () => {
      jwtService.verify.mockReturnValue({
        type: 'refresh',
        userId: mockUser.id,
      });
      usersService.findOne.mockResolvedValue(null);

      await expect(service.refreshToken('valid-token')).rejects.toThrow(
        'User not found',
      );
    });

    it('should throw BadRequestException if refresh token does not match db', async () => {
      jwtService.verify.mockReturnValue({
        type: 'refresh',
        userId: mockUser.id,
      });
      usersService.findOne.mockResolvedValue({
        ...mockUser,
        refreshToken: 'different-token',
      } as User);

      await expect(service.refreshToken('valid-token')).rejects.toThrow(
        'Invalid refresh token',
      );
    });

    it('should generate new tokens and update db if refresh token is valid', async () => {
      const dbUser = { ...mockUser, refreshToken: 'valid-token' } as User;
      jwtService.verify.mockReturnValue({ type: 'refresh', userId: dbUser.id });
      usersService.findOne.mockResolvedValue(dbUser);

      jwtService.sign
        .mockReturnValueOnce('new_access_token')
        .mockReturnValueOnce('new_refresh_token');

      const result = await service.refreshToken('valid-token');

      expect(jwtService.sign).toHaveBeenCalledTimes(2);
      expect(usersService.updateUserRefreshToken).toHaveBeenCalledWith(
        dbUser.id,
        'new_refresh_token',
      );
      expect(result).toEqual({
        access_token: 'new_access_token',
        refresh_token: 'new_refresh_token',
      });
    });
  });

  describe('logout', () => {
    it('should clear the user refresh token', async () => {
      usersService.updateUserRefreshToken.mockResolvedValue(undefined as any);

      const result = service.logout('user-id-123');

      expect(usersService.updateUserRefreshToken).toHaveBeenCalledWith(
        'user-id-123',
        null,
      );
      expect(result).toEqual({ message: 'Logged out successfully' });
    });
  });
});
