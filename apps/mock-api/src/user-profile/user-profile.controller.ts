import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { UserProfileService, type UserProfileDto } from './user-profile.service';

@Controller('api/user-profiles')
export class UserProfileController {
  constructor(private readonly profileService: UserProfileService) {}

  @Get(':userId')
  getProfile(@Param('userId') userId: string): UserProfileDto {
    return this.profileService.getProfile(userId);
  }

  @Put(':userId')
  saveProfile(@Param('userId') userId: string, @Body() payload: UserProfileDto): UserProfileDto {
    return this.profileService.saveProfile(userId, payload);
  }
}
