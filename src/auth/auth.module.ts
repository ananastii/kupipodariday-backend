import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { HashModule } from '../hash/hash.module';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtConfigFactory } from '../config/jwt.config';
import config from '../config/config';

@Module({
  imports: [
    PassportModule,
    HashModule,
    UsersModule,
    JwtModule.registerAsync({ useClass: JwtConfigFactory }),
    ConfigModule.forRoot({
      load: [config],
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtConfigFactory, JwtStrategy, LocalStrategy],
})
export class AuthModule {}
