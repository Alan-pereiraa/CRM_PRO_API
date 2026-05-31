import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Request,
  UseGuards,
  Res,
  Req
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';

const refreshTokenCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private setRefreshTokenCookie(res: any, refreshToken: string) {
    res.cookie('refreshToken', refreshToken, refreshTokenCookieOptions);
  }

  private clearRefreshTokenCookie(res: any) {
    res.clearCookie('refreshToken', { path: refreshTokenCookieOptions.path });
  }

  @Post('sign-up')
  @HttpCode(201)
  @ApiOperation({
    summary: 'Criar conta',
    description: 'Cria uma nova conta e retorna o usuário com access token.',
  })
  @ApiOkResponse({ description: 'Conta criada com sucesso.' })
  async signUp(@Body() payload: SignUpDto, @Res({ passthrough: true }) res) {
    
    const { account, accessToken, refreshToken } =
      await this.authService.signUp(payload);

    this.setRefreshTokenCookie(res, refreshToken);

    return { account, accessToken };
  }

  @Post('sign-in')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Entrar',
    description: 'Autentica um usuário e retorna o usuário com access token.',
  })
  @ApiOkResponse({ description: 'Usuário autenticado com sucesso.' })
  async signIn(
    @Body() credentials: SignInDto,
    @Res({ passthrough: true }) res,
  ) {
    const { account, accessToken, refreshToken } =
      await this.authService.signIn(credentials);

    this.setRefreshTokenCookie(res, refreshToken);

    return { account, accessToken };
  }

  @Post('sign-out')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Sair',
    description: 'Finaliza a sessão atual removendo o refresh token.',
  })
  @ApiOkResponse({ description: 'Usuário deslogado com sucesso.' })
  async signOut(@Req() req, @Res({ passthrough: true }) res) {
    const refreshToken = req.cookies?.refreshToken;

    const result = await this.authService.signOut(refreshToken);

    this.clearRefreshTokenCookie(res);

    return result;
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Perfil',
    description: 'Retorna os dados do usuário autenticado.',
  })
  @ApiOkResponse({ description: 'Perfil retornado com sucesso.' })
  async getProfile(@Request() req) {
    const accountId = req.account.id;
    return this.authService.getProfile(accountId);
  }

  @Post('refresh')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Renovar token',
    description: 'Gera um novo access token usando o refresh token da sessão.',
  })
  @ApiOkResponse({ description: 'Access token renovado com sucesso.' })
  async refreshToken(@Req() req, @Res({ passthrough: true }) res) {
    const refreshToken = req.cookies.refreshToken;
    
    const { accessToken, refreshToken: newRefreshToken } =
      await this.authService.refreshToken(refreshToken);

    this.setRefreshTokenCookie(res, newRefreshToken);

    return { accessToken };
  }
}
