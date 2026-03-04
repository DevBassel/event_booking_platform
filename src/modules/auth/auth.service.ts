import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { compare } from 'bcrypt';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}
  async register(createUserDto: CreateUserDto) {
    const user = await this.usersService.findOneByEmail(createUserDto.email);
    if (user) throw new ConflictException('User already exists');

    const createdUser = await this.usersService.create(createUserDto);

    if (!createdUser) throw new BadRequestException('Failed to create user');
    return { msg: 'User registered successfully' };
  }

  async login(loginDto: LoginDto) {
    // find user by email
    const user = await this.usersService.findOneByEmail(loginDto.email);
    if (!user) throw new BadRequestException('Invalid credentials');

    // compare password with hashed password in database
    const isVAlidPassword = await compare(loginDto.password, user.password);
    if (!isVAlidPassword) throw new BadRequestException('Invalid credentials');

    const { id, name, email } = user;

    const refresh_token = this.genRefreshToken(user);
    // update refresh token in database
    await this.usersService.updateUserRefreshToken(user.id, refresh_token);

    return {
      id,
      name,
      email,
      access_token: this.genAccessToken(user),
      refresh_token,
    };
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

    const refresh_token = this.genRefreshToken(userData);
    // update refresh token in database
    await this.usersService.updateUserRefreshToken(userData.id, refresh_token);

    // return new access token and refresh token
    return {
      access_token: this.genAccessToken(userData),
      refresh_token,
    };
  }
  // [ ] Implement logout functionality to invalidate refresh token in database
  logout() {}

  private genRefreshToken(user: User) {
    const payload = {
      sub: user.id,
      name: user.name,
      type: 'refresh',
    };
    return this.jwtService.sign(payload, { expiresIn: '7d' });
  }

  private genAccessToken(user: User) {
    const newPayload = {
      sub: user.id,
      name: user.name,
      role: user.role,
      type: 'access',
    };
    return this.jwtService.sign(newPayload, { expiresIn: '15m' });
  }
}
