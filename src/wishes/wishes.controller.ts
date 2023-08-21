import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { AuthUser, AuthUserId } from '../common/decorators/user.decorator';
import { User } from '../users/entities/user.entity';
import { WishOwnerGuard } from './guards/wish-owner.guard';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@AuthUser() user: User, @Body() createWishDto: CreateWishDto) {
    return this.wishesService.create(createWishDto, user);
  }

  @Get('last')
  findLast() {
    return this.wishesService.findLast();
  }

  @Get('top')
  findTop() {
    return this.wishesService.findTop();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wishesService.findById(+id);
  }

  @UseGuards(JwtAuthGuard, WishOwnerGuard)
  @Patch(':id')
  update(@Param('id') wishId: string, @Body() updateWishDto: UpdateWishDto) {
    return this.wishesService.update(+wishId, updateWishDto);
  }

  @UseGuards(JwtAuthGuard, WishOwnerGuard)
  @Delete(':id')
  async remove(@Param('id') wishId: number) {
    return this.wishesService.remove(wishId);
  }
}
