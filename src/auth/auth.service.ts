import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { FunnelService } from '../funnel/funnel.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private funnelService: FunnelService,
  ) {}

  async generateToken(accountId: string, sessionId: string) {
    const payload = { sub: accountId, jti: sessionId };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }

  private verifyRefreshToken(refreshToken: string) {
    try {
      return this.jwtService.verify(refreshToken);
    } catch {
      throw new UnauthorizedException('Token de atualização inválido');
    }
  }

  async signUp(payload: SignUpDto) {
    const password_hash = await bcrypt.hash(payload.password, 10);

    const newUser = await this.prisma.account.create({
      data: {
        name: payload.name,
        email: payload.email,
        password_hash,
      },
    });

    await this.funnelService.createDefaultsForAccount(newUser.id);

    const session = await this.prisma.session.create({
      data: {
        accountId: newUser.id,
      },
    });

    const { accessToken, refreshToken } = await this.generateToken(
      newUser.id,
      session.id,
    );

    const tokenHash = await bcrypt.hash(refreshToken, 10);

    await this.prisma.session.update({
      where: { id: session.id },
      data: { token_hash: tokenHash },
    });

    return {
      account: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
      },
      accessToken,
      refreshToken,
    };
  }

  async signIn(credentials: SignInDto) {
    const user = await this.prisma.account.findUnique({
      where: {
        email: credentials.email,
      },
    });

    const isPasswordValid = await bcrypt.compare(
      credentials.password,
      user?.password_hash || '',
    );

    if (!user || !isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const session = await this.prisma.session.create({
      data: {
        accountId: user.id,
      },
    });

    const { accessToken, refreshToken } = await this.generateToken(
      user.id,
      session.id,
    );

    const tokenHash = await bcrypt.hash(refreshToken, 10);

    await this.prisma.session.update({
      where: { id: session.id },
      data: { token_hash: tokenHash },
    });

    return {
      account: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      accessToken,
      refreshToken,
    };
  }

  async signOut(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Token de atualização inválido');
    }

    const payload = this.verifyRefreshToken(refreshToken);

    const sessionId = payload.jti;

    if (sessionId) {
      const session = await this.prisma.session.findUnique({
        where: { id: sessionId },
      });

      if (!session) throw new UnauthorizedException('Sessão não encontrada');

      if (!session.token_hash)
        throw new UnauthorizedException('Token inválido');

      const isMatch = await bcrypt.compare(refreshToken, session.token_hash);

      if (!isMatch) throw new UnauthorizedException('Token inválido');

      await this.prisma.session.delete({ where: { id: sessionId } });

      return { message: 'Desconectado com sucesso' };
    }

    const accountId = payload.sub;

    const sessions = await this.prisma.session.findMany({
      where: { accountId },
    });

    for (const session of sessions) {
      if (!session.token_hash) continue;

      const isMatch = await bcrypt.compare(refreshToken, session.token_hash);

      if (isMatch) {
        await this.prisma.session.delete({ where: { id: session.id } });
        break;
      }
    }

    return { message: 'Desconectado com sucesso' };
  }

  async getProfile(accountId: string) {
    const account = await this.prisma.account.findUnique({
      where: { id: accountId },
    });

    if (!account) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return {
      id: account.id,
      email: account.email,
      name: account.name,
    };
  }

  async refreshToken(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Token de atualização inválido');
    }

    const payload = this.verifyRefreshToken(refreshToken);

    const session = await this.prisma.session.findUnique({
      where: { id: payload.jti },
    });

    if (!session) {
      throw new UnauthorizedException('Token de atualização inválido');
    }

    if (!session.token_hash) {
      throw new UnauthorizedException('Token de atualização inválido');
    }

    const isTokenValid = await bcrypt.compare(refreshToken, session.token_hash);

    if (!isTokenValid) {
      throw new UnauthorizedException('Token de atualização inválido');
    }

    const accountId = payload.sub;

    const { accessToken, refreshToken: newRefreshToken } =
      await this.generateToken(accountId, session.id);

    await this.prisma.session.update({
      where: { id: session.id },
      data: {
        token_hash: await bcrypt.hash(newRefreshToken, 10),
      },
    });

    return { accessToken, refreshToken: newRefreshToken };
  }
}
