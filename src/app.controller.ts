import { Controller, Get, UseGuards } from '@nestjs/common';
import { User } from './utils/decorators/user';
import { AuthGuard } from './auth.guard';

interface User {
  userId: string;
  email: string;
}

@Controller()
export class AppController {
  @UseGuards(AuthGuard) @Get() getHello(@User() user: User) {
    console.log(user);
  }
}
