import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { WishesService } from '../wishes.service';

@Injectable()
export class WishOwnerGuard implements CanActivate {
  constructor(private readonly wishesService: WishesService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const wishId = request.params.id;
    const userId = request.user.id;

    const wish = await this.wishesService.findById(wishId);
    if (wish.owner.id !== userId) {
      throw new UnauthorizedException('You are not the owner of this wish');
    }
    return true;
  }
}
