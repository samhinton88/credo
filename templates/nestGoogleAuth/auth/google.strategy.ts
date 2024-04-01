import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from './auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly authService: AuthService,) {
    const callbackRoot = process.env.NODE_ENV === 'production' ? process.env.CALLBACK_ROOT : 'http://localhost:3000';
    const callbackURL = callbackRoot + '/auth/google/callback';

    super({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL,
        scope: ['email', 'profile'],
        accessType: 'offline', // Important for getting a refresh token
        prompt: 'consent', // Force the consent screen to get a refresh token
        approvalPrompt: 'force' 
      });
  }
  authorizationParams(): { [key: string]: string; } {
    return ({
      access_type: 'offline'
    });
  };

  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    const user = {
        email: profile.emails[0].value,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        picture: profile.photos[0].value,
        refreshToken, // Include the refresh token
      };
  
      return this.authService.googleLogin(user);
  }
}