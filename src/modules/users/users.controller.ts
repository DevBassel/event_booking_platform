import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { Roles } from '../../utils/decorators/role.decorator';
import { UserRoles } from './enums/UserType.enum';
import { GetUser } from 'src/utils/decorators/get-user.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, RoleGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles([UserRoles.ADMIN])
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Roles([UserRoles.ADMIN])
  findAll(@Query('page') page: number, @Query('limit') limit: number) {
    return this.usersService.findAll(page, limit);
  }

  @Get(':id')
  @Roles([UserRoles.ADMIN])
  async findOne(@Param('id') id: string, @GetUser('userId') userId: string) {
    if (id === 'me') return this.usersService.findOne(userId);

    const user = await this.usersService.findOne(id);
    if (!user) throw new NotFoundException(`user not found => id: ${id}`);
    return user;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    if (updateUserDto.role !== UserRoles.ADMIN) {
      delete updateUserDto.password;
      delete updateUserDto.role;
    }
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles([UserRoles.ADMIN])
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
