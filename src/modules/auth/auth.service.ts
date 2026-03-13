import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { compare } from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { OrganizationService } from '../organization/organization.service';
import { UserRoles } from '../users/enums/UserType.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly OrganizationService: OrganizationService,
  ) {}
  async register(createUserDto: CreateUserDto) {
    if (createUserDto.role === UserRoles.ADMIN) throw new BadRequestException();

    const user = await this.usersService.findOneByEmail(createUserDto.email);
    if (user) throw new ConflictException('User already exists');

    const createdUser = await this.usersService.create(createUserDto);

    if (createUserDto.role === UserRoles.ORGANIZER)
      await this.OrganizationService.create({
        ...createUserDto.organization,
        userId: createdUser.id,
      });

    if (!createdUser) throw new BadRequestException('Failed to create user');
    return { msg: 'User Registered Successfully' };
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    const [access_token, refresh_token] = await Promise.all([
      this.genAccessToken(user),
      this.genRefreshToken(user),
    ]);
    await this.usersService.updateUserRefreshToken(user.id, refresh_token);
    const { id, name, email } = user;
    return { id, name, email, access_token, refresh_token };
  }

  // return new access token if refresh token ( one time use ) is valid
  async refreshToken(token: string) {
    // verify refresh token
    const payload = this.jwtService.verify(token);
    if (payload.type !== 'refresh')
      throw new BadRequestException('Invalid token');

    // get user data from database
    const userData = await this.usersService.findOne(payload.sub);
    if (!userData) throw new BadRequestException('User not found');

    if (userData.refreshToken !== token)
      throw new BadRequestException('Invalid refresh token');

    const [access_token, refresh_token] = await Promise.all([
      this.genAccessToken(userData),
      this.genRefreshToken(userData),
    ]);
    // update refresh token in database
    await this.usersService.updateUserRefreshToken(userData.id, refresh_token);

    // return new access token and refresh token
    return {
      access_token,
      refresh_token,
    };
  }

  logout(userId: string) {
    this.usersService.updateUserRefreshToken(userId, null);
    return { message: 'Logged out successfully' };
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const isValidPassword = await compare(password, user.password);
    if (!isValidPassword)
      throw new UnauthorizedException('Invalid credentials');
    return user;
  }

  private genAccessToken(user: User) {
    const newPayload = {
      sub: user.id,
      name: user.name,
      role: user.role,
      type: 'access',
    };
    return this.jwtService.sign(newPayload);
  }
  private genRefreshToken(user: User) {
    const payload = {
      sub: user.id,
      name: user.name,
      type: 'refresh',
    };
    return this.jwtService.sign(payload, {
      expiresIn: this.configService.getOrThrow('REFRESH_TOKEN_EXPIRATION'),
    });
  }
}
