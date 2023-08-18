import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HashService } from '../hash/hash.service';
import { CreateUserDto } from './dto/create-user.dto';
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

  findAll() {
    return this.userRepository.find();
  }

  findOne(query: string) {
    return this.userRepository.findOne({
      where: [{ email: query }, { username: query }],
    });
  }

  findOneById(id: number) {
    return this.userRepository.findOneBy({ id });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(id, updateUserDto);
  }
}
