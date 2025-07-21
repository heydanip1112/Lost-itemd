// src/auth/auth.controller.ts

import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    const { username, password } = body;
    return this.authService.loginWithCredentials(username, password);
  }

  @Post('register')
  async register(@Body() body: { username: string; password: string }) {
    const { username, password } = body;
    return this.authService.register(username, password);
  }
}
