import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthUserId } from '../common/decorators/user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { FindUserDto } from './dto/find-user.dto';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  findOwn(@AuthUserId() id: number) {
    return this.usersService.findById(id);
  }

  @Get(':username')
  findOne(@Param('username') username: string) {
    return this.usersService.findOne(username);
  }

  @Patch('me')
  update(@AuthUserId() id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Post('find')
  findMany(@Body() FindUserDto: FindUserDto) {
    return this.usersService.findMany(FindUserDto);
  }
}
