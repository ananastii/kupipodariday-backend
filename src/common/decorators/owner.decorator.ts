import { Reflector } from '@nestjs/core';

export const IsOwned = Reflector.createDecorator<boolean>();
