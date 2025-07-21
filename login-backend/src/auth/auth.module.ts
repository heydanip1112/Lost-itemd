import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: 'mi_clave_secreta',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],  // 👈 Este debe estar presente
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
