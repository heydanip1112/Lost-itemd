import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body() body: { username: string; password: string }) {
    const { username, password } = body;
    return this.usersService.create(username, password);
  }
}
