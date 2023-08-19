import { Injectable } from '@nestjs/common';
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
    const hashedPassword = await this.hashService.getHash(
      createUserDto.password,
    );
    return this.userRepository.save({
      ...createUserDto,
      password: hashedPassword,
    });
  }

  findOne(query: string) {
    return this.userRepository.findOne({
      where: { username: query },
    });
  }

  findMany(query: FindUserDto) {
    return this.userRepository.find({
      where: [
        { username: Like(`%${query.query}%`) },
        { email: Like(`%${query.query}%`) },
      ],
    });
  }

  findById(id: number) {
    return this.userRepository.findOneBy({ id });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const { password } = updateUserDto;
    if (password) {
      updateUserDto.password = await this.hashService.getHash(password);
    }
    await this.userRepository.update(id, updateUserDto);
    return await this.findById(id);
  }
}
