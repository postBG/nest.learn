import * as uuid from 'uuid';
import { ulid } from 'ulid';
import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { UserEntity } from '../../entity/user.entity';
import { CreateUserCommand } from './create-user.command';

@Injectable()
@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    private connection: Connection,
    private eventBus: EventBus,
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async execute(command: CreateUserCommand) {
    const { name, email, password } = command;

    const userExist = await this.checkUserExists(email);
    if (userExist) {
      throw new UnprocessableEntityException(
        '해당 이메일로는 가입할 수 없습니다.',
      );
    }

    const signupVerifyToken = uuid.v1();

    await this.saveUserUsingTransaction(
      name,
      email,
      password,
      signupVerifyToken,
    );
  }

  private async checkUserExists(emailAddress: string): Promise<boolean> {
    const user = await this.usersRepository.findOne({ email: emailAddress });

    return user !== undefined;
  }

  private async saveUserUsingTransaction(
    name: string,
    email: string,
    password: string,
    signupVerifyToken: string,
  ) {
    await this.connection.transaction(async (manager) => {
      const user = new UserEntity();
      user.id = ulid();
      user.name = name;
      user.email = email;
      user.password = password;
      user.signupVerifyToken = signupVerifyToken;

      await manager.save(user);
    });
  }
}
