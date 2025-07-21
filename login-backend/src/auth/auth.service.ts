import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // Validar usuario por username y password
  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findByUsername(username);
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  // Método de login: genera token JWT si las credenciales son válidas
  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  // Método para hacer login con validación directa desde DTO
  async loginWithCredentials(username: string, password: string) {
    const user = await this.usersService.findByUsername(username);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(username: string, password: string) {
  // Validación básica
  if (!username || !password) {
    throw new BadRequestException('Username y password son requeridos');
  }
  
  if (password.length < 6) {
    throw new BadRequestException('La contraseña debe tener al menos 6 caracteres');
  }

  const existing = await this.usersService.findByUsername(username);
  if (existing) {
    throw new BadRequestException('El usuario ya existe');
  }

  const newUser = await this.usersService.create(username, password);
  
  // No devolver la contraseña ni el hash
  const { password: _, ...userWithoutPassword } = newUser;
  
  const payload = { username: newUser.username, sub: newUser.id };
  return {
    user: userWithoutPassword,
    access_token: this.jwtService.sign(payload),
  };
}

}
