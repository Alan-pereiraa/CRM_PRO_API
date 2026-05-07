import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Request,
  UseGuards,
  Res,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  @HttpCode(201)
  async signUp(@Body() payload: SignUpDto, @Res({ passthrough: true }) res) {
    const { account, accessToken, refreshToken } =
      await this.authService.signUp(payload);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { account, accessToken };
  }

  @Post('sign-in')
  @HttpCode(200)
  async signIn(
    @Body() credentials: SignInDto,
    @Res({ passthrough: true }) res,
  ) {
    const { account, accessToken, refreshToken } =
      await this.authService.signIn(credentials);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { account, accessToken };
  }

  @Post('sign-out')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async signOut(@Req() req, @Res({ passthrough: true }) res) {
    const refreshToken = req.cookies?.refreshToken;

    const result = await this.authService.signOut(refreshToken);

    res.clearCookie('refreshToken', { path: '/' });

    return result;
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async getProfile(@Request() req) {
    return this.authService.getProfile(req.account.id);
  }

  @Post('refresh')
  @HttpCode(200)
  async refreshToken(@Req() req, @Res({ passthrough: true }) res) {
    const refreshToken = req.cookies.refreshToken;
    const { accessToken, refreshToken: newRefreshToken } =
      await this.authService.refreshToken(refreshToken);

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { accessToken };
  }
}
