import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
    const wish = await this.wishRepository.findOne({
      where: { id },
      relations: ['owner', 'offers'],
    });
    if (!wish) {
      throw new NotFoundException('Wish not found');
    }
    return wish;
  }

  async findLast() {
    return (
      (await this.wishRepository.find({
        order: { createdAt: 'desc' },
        take: wishesLimit.last,
        relations: ['owner', 'offers', 'offers.user'],
      })) || []
    );
  }

  async findTop() {
    return (
      (await this.wishRepository.find({
        order: { copied: 'desc' },
        take: wishesLimit.top,
        relations: ['owner', 'offers', 'offers.user'],
      })) || []
    );
  }

  async update(wishId: number, updateWishDto: UpdateWishDto, userId: number) {
    const wish = await this.wishRepository.findOne({
      where: { id: wishId },
      relations: ['owner'],
    });
    if (!wish) {
      throw new NotFoundException('Wish not found');
    }
    if (wish.owner.id !== userId) {
      throw new BadRequestException('You are not the owner of the wish');
    }
    if (updateWishDto.price && wish.raised > 0) {
      throw new BadRequestException(
        'You cannot update price because some sum has already been raised',
      );
    }
    await this.wishRepository.update(wishId, updateWishDto);
    return await this.findById(wishId);
  }

  async remove(wishId: number, userId: number) {
    const wish = await this.wishRepository.findOne({
      where: { id: wishId },
      relations: ['owner'],
    });
    if (!wish) {
      throw new NotFoundException('Wish not found');
    }
    if (wish.owner.id !== userId) {
      throw new BadRequestException('You are not the owner of the wish');
    }
    await this.wishRepository.delete(wishId);
    return wish;
  }

  async copy(wishId: number, user: User) {
    const wish = await this.wishRepository.findOne({
      where: { id: wishId },
      relations: ['owner'],
    });
    if (!wish) {
      throw new NotFoundException('Wish not found');
    }
    if (wish.owner.id === user.id) {
      throw new BadRequestException('You сannot copy your own wish');
    }
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const {
        id,
        createdAt,
        updatedAt,
        copied,
        owner,
        offers,
        raised,
        ...wish
      } = await this.wishRepository.findOneBy({ id: wishId });
      await this.wishRepository.update(wishId, { copied: copied + 1 });

      const wishCopy = await this.create(wish, user);

      await queryRunner.commitTransaction();
      return wishCopy;
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async getManyByIds(ids: number[]) {
    return (
      (await this.wishRepository.find({
        where: { id: In(ids) },
      })) || []
    );
  }

  async updateRaised(id: number, raised: number) {
    const wish = await this.wishRepository.update(id, { raised });
    if (!wish) {
      throw new NotFoundException('Wish not found');
    }
    return wish;
  }
}
