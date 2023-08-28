import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { DataSource, Repository, In } from 'typeorm';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wish.entity';
import { wishesLimit } from './wishes.constants';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private readonly wishRepository: Repository<Wish>,
    private readonly dataSource: DataSource,
  ) {}
  create(createWishDto: CreateWishDto, user: User) {
    return this.wishRepository.save({ ...createWishDto, owner: user });
  }

  async findById(id: number) {
    return await this.wishRepository.findOne({
      where: { id },
      relations: ['owner', 'offers'],
    });
  }

  async findLast() {
    return await this.wishRepository.find({
      order: { createdAt: 'desc' },
      take: wishesLimit.last,
      relations: ['owner', 'offers', 'offers.user'],
    });
  }

  async findTop() {
    return await this.wishRepository.find({
      order: { copied: 'desc' },
      take: wishesLimit.top,
      relations: ['owner', 'offers', 'offers.user'],
    });
  }

  async update(wishId: number, updateWishDto: UpdateWishDto) {
    const wish = await this.wishRepository.findOne({ where: { id: wishId } });
    if (updateWishDto.price && wish.raised > 0) {
      throw new BadRequestException(
        'You cannot update price because some sum is already raised',
      );
    }
    await this.wishRepository.update(wishId, updateWishDto);
    return await this.findById(wishId);
  }

  async remove(id: number) {
    const wish = await this.findById(id);
    await this.wishRepository.delete(id);
    return wish;
  }

  async copy(wishId: number, user: User) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { id, createdAt, updatedAt, copied, owner, offers, ...wish } =
        await this.findById(wishId);
      await this.wishRepository.update(wishId, { copied: copied + 1 });

      const wishCopy = await this.create(wish, user);

      await queryRunner.commitTransaction();
      return wishCopy;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      return false;
    } finally {
      await queryRunner.release();
    }
  }

  async getManyByIds(ids: number[]) {
    return await this.wishRepository.find({
      where: { id: In(ids) },
    });
  }
}
