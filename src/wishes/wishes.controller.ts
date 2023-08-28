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

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') wishId: number,
    @Body() updateWishDto: UpdateWishDto,
    @AuthUser() userId: number,
  ) {
    return this.wishesService.update(wishId, updateWishDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') wishId: number, @AuthUser() userId: number) {
    return this.wishesService.remove(wishId, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/copy')
  copy(@Param('id') wishId: number, @AuthUser() user: User) {
    return this.wishesService.copy(wishId, user);
  }
}
