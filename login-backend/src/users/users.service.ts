import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(username: string, password: string): Promise<User> {
    // Validar username
    if (username.length < 3) {
      throw new BadRequestException('Username debe tener al menos 3 caracteres');
    }

    // Validar que el username solo contenga caracteres permitidos
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(username)) {
      throw new BadRequestException('Username solo puede contener letras, números y guiones bajos');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({
      username,
      password: hashedPassword,
    });

    try {
      return await this.userRepository.save(user);
    } catch (error) {
      if (error.code === '23505') { // Código de error de PostgreSQL para duplicados
        throw new BadRequestException('El nombre de usuario ya existe');
      }
      throw error;
    }
  }

  async findByUsername(username: string): Promise<User | undefined> {
    const user = await this.userRepository.findOne({ where: { username } });
    return user ?? undefined;
  }
}