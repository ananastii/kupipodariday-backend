import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import config from './config/config';
import { DatabaseConfigFactory } from './config/database.config';
import { UsersModule } from './users/users.module';
import { HashModule } from './hash/hash.module';
import { AuthModule } from './auth/auth.module';
import { WishesModule } from './wishes/wishes.module';
import { OffersModule } from './offers/offers.module';
import { WishlistsModule } from './wishlists/wishlists.module';

@Module({
  imports: [
    UsersModule,
    WishesModule,
    OffersModule,
    WishlistsModule,
    HashModule,
    AuthModule,
    ConfigModule.forRoot({ load: [config], isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useClass: DatabaseConfigFactory,
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
