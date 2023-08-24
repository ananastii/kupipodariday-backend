import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { JwtAuthGuard } from '../common/guards/jwt.guard';
import { IsOwned } from '../common/decorators/owner.decorator';
import { WishOwnerGuard } from '../common/guards/wish-owner.guard';
import { AuthUser } from '../common/decorators/user.decorator';
import { User } from '../users/entities/user.entity';

@UseGuards(JwtAuthGuard)
@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @UseGuards(WishOwnerGuard)
  @Post()
  @IsOwned(false)
  create(@Body() createOfferDto: CreateOfferDto, @AuthUser() user: User) {
    return this.offersService.create(createOfferDto, user);
  }

  @Get()
  findAll() {
    return this.offersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.offersService.findOne(id);
  }
}
