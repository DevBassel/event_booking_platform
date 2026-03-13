import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserRoles } from '../users/enums/UserType.enum';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { OrganizationService } from '../organization/organization.service';
import { BadRequestException, ConflictException } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let organizationService: jest.Mocked<OrganizationService>;

  const createUserDto: CreateUserDto = {
    email: 'test@test.com',
    role: UserRoles.USER,
    name: 'bassel',
    password: '123456789',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: { findOneByEmail: jest.fn(), create: jest.fn() },
        },
        {
          provide: ConfigService,
          useValue: { get: jest.fn().mockReturnValue('mock-secret') },
        },
        {
          provide: OrganizationService,
          useValue: { create: jest.fn() },
        },
        {
          provide: JwtService,
          useValue: { sign: jest.fn(), signAsync: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get(UsersService);
    organizationService = module.get(OrganizationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw BadRequestException if role is ADMIN', async () => {
    await expect(
      service.register({ ...createUserDto, role: UserRoles.ADMIN }),
    ).rejects.toThrow(BadRequestException);

    expect(usersService.findOneByEmail).not.toHaveBeenCalled();
  });

  it('should throw ConflictException if email already exists', async () => {
    usersService.findOneByEmail.mockResolvedValue({ id: '1' } as User);

    await expect(service.register(createUserDto)).rejects.toThrow(
      new ConflictException('User already exists'),
    );
    expect(usersService.create).not.toHaveBeenCalled();
  });
});
