import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth(@Req() req) {
    // Initiates the Google OAuth flow
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res: Response) {
    // Handles the Google OAuth callback
    const { token } = await this.authService.googleLogin(req.user.dbUser);

  
    const redirectURL = process.env.CLIENT_ORIGIN;
    const redirectURLWithToken = `${redirectURL}/login/success?token=${token}`
  
    // Redirect back to the Next.js frontend
    res.redirect(redirectURLWithToken);
  }
}
