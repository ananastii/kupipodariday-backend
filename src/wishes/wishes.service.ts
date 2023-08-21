import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wish.entity';
import { wishesLimit } from './wishes.constants';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private readonly wishRepository: Repository<Wish>,
  ) {}
  create(createWishDto: CreateWishDto, user: User) {
    return this.wishRepository.save({ ...createWishDto, owner: user });
  }

  async findById(id: number) {
    return await this.wishRepository.findOne({
      where: { id },
      relations: ['owner'],
    });
  }

  async findLast() {
    return await this.wishRepository.find({
      order: { createdAt: 'desc' },
      take: wishesLimit.last,
    });
  }

  async findTop() {
    return await this.wishRepository.find({
      order: { copied: 'desc' },
      take: wishesLimit.top,
    });
  }

  async update(wishId: number, updateWishDto: UpdateWishDto) {
    await this.wishRepository.update(wishId, updateWishDto);
    return await this.findById(wishId);
  }

  async remove(id: number) {
    const wish = await this.findById(id);
    await this.wishRepository.delete(id);
    return wish;
  }
}
