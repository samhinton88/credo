import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    // This will automatically be called for every request with a JWT


    const user = await this.userService.findById(payload.sub, {
      include: {
        notifications: { where: { status: 'UNREAD'}},
        consumerProfile: { include: { chatRoomParticipations: true }},
        designerProfile: {
          include: {
            designerProfileTags: { include: { tag: true }},
            designerProfileDesignItemFabrics: { include: { designItemFabric: true }},
            designerProfileImages: { include: { image: true }},
            chatRoomParticipations: true,
          },
        },
        consents: true,
        addresses: true,

      },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user; // This will be attached to the request object as req.user
  }
}
