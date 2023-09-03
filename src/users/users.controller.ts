import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthUserId } from '../common/decorators/user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt.guard';
import { FindUserDto } from './dto/find-user.dto';
import { PasswordInterceptor } from '../common/interceptors/password.interceptor';
import { ValidationExceptionFilter } from '../common/filters/validation-exception.filter';

@UseGuards(JwtAuthGuard)
@UseInterceptors(PasswordInterceptor)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getOwn(@AuthUserId() id: number) {
    return this.usersService.findById(id);
  }

  @Get(':username')
  findOne(@Param('username') username: string) {
    return this.usersService.findOne(username);
  }

  @Patch('me')
  @UseFilters(ValidationExceptionFilter)
  update(@AuthUserId() id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Post('find')
  findMany(@Body() findUserDto: FindUserDto) {
    return this.usersService.findMany(findUserDto);
  }

  @Get('me/wishes')
  getOwnWishes(@AuthUserId() id: number) {
    return this.usersService.findOwnWishes(id);
  }

  @Get(':username/wishes')
  getUserWishes(@Param('username') username: string) {
    return this.usersService.findWishes(username);
  }
}
