import { Module } from '@nestjs/common';
import { CartController } from './cart/cart.controller';
import { CartService } from './cart/cart.service';
import { UserProfileController } from './user-profile/user-profile.controller';
import { UserProfileService } from './user-profile/user-profile.service';

@Module({
  controllers: [CartController, UserProfileController],
  providers: [CartService, UserProfileService],
})
export class AppModule {}
