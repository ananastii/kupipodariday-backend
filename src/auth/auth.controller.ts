import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthUserId } from '../common/decorators/user.decorator';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from '../common/guards/local.guard';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}
  @UseGuards(LocalAuthGuard)
  @Post('signin')
  signIn(@AuthUserId() userId: number) {
    return this.authService.signin(userId);
  }

  @Post('signup')
  signUp(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
}
