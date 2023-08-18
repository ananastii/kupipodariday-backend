import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import config from './config/config';
import { DatabaseConfigFactory } from './config/database.config';
import { UsersModule } from './users/users.module';
import { HashModule } from './hash/hash.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot({ load: [config], isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useClass: DatabaseConfigFactory,
    }),
    HashModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
