import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import CreateUserDTO from './dto/create-user-request.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {}

  public async findUserById(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });
    return user;
  }

  public async createUser(user: CreateUserDTO) {
    const newUser = this.userRepository.create(user);
    await this.userRepository.save(newUser).catch(() => {
      throw new BadRequestException('unvalid user info');
    });

    return newUser;
  }

  public async accumulateMaskPoint(userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    user.maskPoint++;
    await this.userRepository.save(user);
  }

  public async useMaskCoupon(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });

    user.maskPoint -= 5;
    if (user.maskPoint < 0) {
      throw new BadRequestException('mask point is less than 5');
    }
    await this.userRepository.save(user);
  }
}
