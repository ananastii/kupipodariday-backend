import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { HashService } from '../hash/hash.service';
import { CreateUserDto } from './dto/create-user.dto';
import { FindUserDto } from './dto/find-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashService: HashService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { username, email, password } = createUserDto;

    const existingUser = await this.userRepository.findOne({
      where: [{ username }, { email }],
    });
    if (existingUser) {
      throw new ConflictException(
        'A user with this email or username already exists',
      );
    }
    const hashedPassword = await this.hashService.getHash(password);
    const user = await this.userRepository.save({
      ...createUserDto,
      password: hashedPassword,
    });
    return user;
  }

  async findOne(query: string) {
    const user = await this.userRepository.findOne({
      where: { username: query },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  findMany(query: FindUserDto) {
    return (
      this.userRepository.find({
        where: [
          { username: Like(`%${query.query}%`) },
          { email: Like(`%${query.query}%`) },
        ],
      }) || []
    );
  }

  async findById(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const { password, username, email } = updateUserDto;
    const existingUser = await this.userRepository.findOne({
      where: [{ username }, { email }],
    });
    if (existingUser) {
      throw new ConflictException(
        'A user with this email or username already exists',
      );
    }
    if (password) {
      updateUserDto.password = await this.hashService.getHash(password);
    }
    await this.userRepository.update(id, updateUserDto);
    return await this.findById(id);
  }

  async findOwnWishes(id: number) {
    const userWishes = await this.userRepository.findOne({
      where: { id },
      relations: [
        'wishes',
        'wishes.owner',
        'wishes.offers',
        'wishes.offers.user',
      ],
    });
    return userWishes.wishes || [];
  }

  async findWishes(username: string) {
    const user = await this.userRepository.findOne({
      where: { username },
      relations: [
        'wishes',
        'wishes.offers',
        'wishes.offers.item',
        'wishes.offers.user',
        'wishes.offers.item.owner',
      ],
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user.wishes || [];
  }
}
