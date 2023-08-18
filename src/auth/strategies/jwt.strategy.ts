import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // secretOrKey: configService.get<string>('jwt.secret'),
      secretOrKey: 'vdsfsfdsf',
    });
  }

  async validate(jwtPayload: { sub: number }) {
    const user = this.usersService.findOneById(jwtPayload.sub);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
