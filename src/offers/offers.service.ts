import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { WishesService } from '../wishes/wishes.service';
import { Repository } from 'typeorm';
import { CreateOfferDto } from './dto/create-offer.dto';
import { Offer } from './entities/offer.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,
    private readonly wishesService: WishesService,
  ) {}
  async create(offer: CreateOfferDto, user: User) {
    const { itemId, amount, ..._ } = offer;
    const wish = await this.wishesService.findById(itemId);
    const totalRaised = wish.raised + amount;

    if (totalRaised > wish.price) {
      throw new BadRequestException(
        'The offer amount exceeds the remaining amount',
      );
    }
    await this.wishesService.update(itemId, { raised: totalRaised });
    return await this.offerRepository.save({ ...offer, user, item: wish });
  }

  async findOne(id: number) {
    return await this.offerRepository.findOne({
      where: { id },
      relations: ['user', 'item'],
    });
  }

  async findAll() {
    return await this.offerRepository.find({ relations: ['item', 'user'] });
  }
}
