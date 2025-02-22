import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository} from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

    async create(createUserDto: CreateUserDto): Promise<User> {
      const email = await this.usersRepository.findOneBy({email: createUserDto.email });
      if (email) {
        throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
      }
      const newUser = this.usersRepository.create(createUserDto);
      return this.usersRepository.save(newUser);
    }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }
  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
        throw new NotFoundException('User not found');
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const updateResult = await this.usersRepository.update(id, updateUserDto);
    if (updateResult.affected === 0) {
      throw new NotFoundException('User not found');
    }
    return this.findOne(id);
  }


  async remove(id: number): Promise<void> {
    const deleteResult = await this.usersRepository.delete(id);
    if (deleteResult.affected === 0) {
      throw new NotFoundException('User not found');
    }
    throw new HttpException(
      'User deleted successfully',
      HttpStatus.OK,
    );
  }
}
