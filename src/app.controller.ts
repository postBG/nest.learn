import { Controller, Get, UseGuards, ValidationPipe } from '@nestjs/common';
import { UserData } from './utils/decorators/user';
import { AuthGuard } from './auth.guard';
import { IsString } from 'class-validator';

class UserEntity {
  @IsString() userId: string;

  @IsString() email: string;
}

@Controller()
export class AppController {
  @UseGuards(AuthGuard) @Get() getHello(
    @UserData(new ValidationPipe({ validateCustomDecorators: true }))
    user: UserEntity,
  ) {
    console.log(user);
  }

  @UseGuards(AuthGuard) @Get('/user-id') getUsername(
    @UserData('userId') userId: string,
  ) {
    console.log(userId);
  }
}
