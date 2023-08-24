import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IsOwned } from '../..//common/decorators/owner.decorator';
import { WishesService } from '../wishes.service';

@Injectable()
export class WishOwnerGuard implements CanActivate {
  constructor(
    private readonly wishesService: WishesService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isOwned = this.reflector.get(IsOwned, context.getHandler());
    const request = context.switchToHttp().getRequest();
    const wishId = request.params.id;
    const userId = request.user.id;

    const wish = await this.wishesService.findById(wishId);
    if (isOwned && wish.owner.id !== userId) {
      throw new UnauthorizedException('You are not the owner of this wish');
    }
    if (!isOwned && wish.owner.id === userId) {
      throw new BadRequestException('You are trying to copy your own wish');
    }
    return true;
  }
}
