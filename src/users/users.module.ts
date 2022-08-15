import { Logger, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './interface/users.controller';
import { EmailModule } from '../email/email.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './infra/db/entity/user.entity';
import { AuthModule } from '../auth/auth.module';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateUserHandler } from './application/command/create-user.handler';
import { UserEventsHandler } from './application/event/user-events.handler';
import { GetUserInfoQueryHandler } from './application/query/get-user-info.handler';
import { UserRepository } from './infra/db/repository/UserRepository';

@Module({
  imports: [
    EmailModule,
    TypeOrmModule.forFeature([UserEntity]),
    AuthModule,
    CqrsModule,
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    Logger,
    CreateUserHandler,
    UserEventsHandler,
    GetUserInfoQueryHandler,
    {
      provide: 'UserRepository',
      useClass: UserRepository,
    },
  ],
})
export class UsersModule {}
