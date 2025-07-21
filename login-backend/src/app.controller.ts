// src/app.controller.ts

import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Controller()  // ← Esto define que esta clase es un controlador
export class AppController {

  @UseGuards(JwtAuthGuard)
  @Get('protected')
  getProtectedData() {
    return "Accediste a una ruta protegida";
  }
}
