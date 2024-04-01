import { Injectable } from '@nestjs/common';
import { AuthProvider, User } from '@prisma/client';
import { UsersService } from 'src/users/users.service';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}
  async googleLogin(
    user:
      | { email: string; refreshToken: string }
      | (User & { authProviders: AuthProvider[] }),
  ) {
    const isDBUser = 'authProviders' in user;


    const refreshToken = isDBUser
      ? user.authProviders[0].refreshToken
      : user.refreshToken;
    let dbUser = await this.usersService.findByEmail(user.email);

    if (dbUser) {
      // Update existing user with the new refresh token
      dbUser = await this.usersService.updateRefreshToken(
        dbUser.id,
        refreshToken,
        'google',
      );
    } else {
      // Create new user and store the refresh token
      dbUser = await this.usersService.create({
        ...user,
        authProvider: {
          providerType: 'google',
          refreshToken: this.usersService.encryptRefreshToken(refreshToken),
        },
        
      });
    }

    const token = this.generateJwtToken(dbUser);

    return { dbUser, token };
  }

  private generateJwtToken(user: User): string {
    const payload = {
      email: user.email,
      sub: user.id, // 'sub' is a standard JWT claim for the subject (user) of the token
    };

    return jwt.sign(
      payload,
      process.env.JWT_SECRET, // The secret key from your environment variables
      { expiresIn: '30d' },
    );
  }
}
