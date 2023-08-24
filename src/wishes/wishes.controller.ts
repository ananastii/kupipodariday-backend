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
import { JwtAuthGuard } from '../common/guards/jwt.guard';
import { AuthUser } from '../common/decorators/user.decorator';
import { User } from '../users/entities/user.entity';
import { WishOwnerGuard } from '../common/guards/wish-owner.guard';
import { IsOwned } from '../common/decorators/owner.decorator';

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
  @IsOwned(true)
  update(@Param('id') wishId: number, @Body() updateWishDto: UpdateWishDto) {
    return this.wishesService.update(wishId, updateWishDto);
  }

  @UseGuards(JwtAuthGuard, WishOwnerGuard)
  @Delete(':id')
  @IsOwned(true)
  async remove(@Param('id') wishId: number) {
    return this.wishesService.remove(wishId);
  }

  @UseGuards(JwtAuthGuard, WishOwnerGuard)
  @Post(':id/copy')
  @IsOwned(false)
  copy(@Param('id') wishId: number, @AuthUser() user: User) {
    return this.wishesService.copy(wishId, user);
  }
}
