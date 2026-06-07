import {
  Injectable,
  NotFoundException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { FunnelService } from '../funnel/funnel.service';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'node:crypto';

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

    const existingUser = await this.prisma.account.findUnique({
      where: { email: payload.email },
    });

    if (existingUser) {
      throw new ConflictException('Email já está em uso');
    }

    const newUser = await this.prisma.account.create({
      data: {
        name: payload.name,
        email: payload.email,
        password_hash,
      },
    });

    if (!newUser) {
      throw new NotFoundException('Erro ao criar usuário');
    }

    await this.funnelService.createDefaultsForAccount(newUser.id);

    const sessionId = randomUUID();

    const { accessToken, refreshToken } = await this.generateToken(
      newUser.id,
      sessionId,
    );

    const tokenHash = await bcrypt.hash(refreshToken, 10);

    const session = await this.prisma.session.create({
      data: {
        id: sessionId,
        accountId: newUser.id,
        token_hash: tokenHash,
      },
    });

    if (!session) {
      throw new NotFoundException('Erro ao criar sessão');
    }

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

    const sessionId = randomUUID();

    const { accessToken, refreshToken } = await this.generateToken(
      user.id,
      sessionId,
    );

    const tokenHash = await bcrypt.hash(refreshToken, 10);

    const session = await this.prisma.session.create({
      data: {
        id: sessionId,
        accountId: user.id,
        token_hash: tokenHash,
      },
    });

    if (!session) {
      throw new NotFoundException('Erro ao criar sessão');
    }

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

    const newTokenHash = await bcrypt.hash(newRefreshToken, 10);

    const updatedSession = await this.prisma.session.update({
      where: { id: session.id },
      data: {
        token_hash: newTokenHash,
      },
    });

    if (!updatedSession) {
      throw new NotFoundException('Erro ao atualizar sessão');
    }

    return { accessToken, refreshToken: newRefreshToken };
  }
}
