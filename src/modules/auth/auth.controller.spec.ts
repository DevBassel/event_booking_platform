import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { UserRoles } from '../users/enums/UserType.enum';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
            login: jest.fn(),
            refreshToken: jest.fn(),
            logout: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
  });

  describe('register', () => {
    it('should call authService.register and return the result', async () => {
      const createUserDto: CreateUserDto = {
        name: 'Test',
        email: 'test@test.com',
        password: 'pass',
        role: UserRoles.USER,
      };

      authService.register.mockResolvedValue({ msg: 'Registered' });

      const result = await controller.register(createUserDto);

      expect(authService.register).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual({ msg: 'Registered' });
    });
  });

  describe('login', () => {
    it('should call authService.login and return tokens and user data', async () => {
      const loginDto: LoginDto = {
        email: 'test@test.com',
        password: 'pass',
      };

      const mockResponse = {
        id: '1',
        name: 'Test',
        email: 'test@test.com',
        access_token: 'acc',
        refresh_token: 'ref',
      };

      authService.login.mockResolvedValue(mockResponse);

      const result = await controller.login(loginDto);

      expect(authService.login).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('refreshToken', () => {
    it('should call authService.refreshToken and return new tokens', async () => {
      const token = 'old-refresh-token';

      const mockResponse = {
        access_token: 'new-acc',
        refresh_token: 'new-ref',
      };

      authService.refreshToken.mockResolvedValue(mockResponse);

      const result = await controller.refreshToken(token);

      expect(authService.refreshToken).toHaveBeenCalledWith(token);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('logout', () => {
    it('should call authService.logout with userId and return message', async () => {
      authService.logout.mockReturnValue({
        message: 'Logged out successfully',
      });

      const result = controller.logout('user-123');

      expect(authService.logout).toHaveBeenCalledWith('user-123');
      expect(result).toEqual({ message: 'Logged out successfully' });
    });
  });
});
