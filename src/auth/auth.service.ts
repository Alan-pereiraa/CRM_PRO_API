import { Injectable } from '@nestjs/common';
import { SignInDto } from './dto/sign-in.sto';
import { SignUpDto } from './dto/sign-up.dto';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async generateToken(accountId: string) {
    const payload = { sub: accountId };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }

  async signUp(payload: SignUpDto) {
    const newUser = await this.prisma.account.create({
      data: {
        name: payload.name,
        email: payload.email,
        password_hash: payload.password,
      },
    });

    const { accessToken, refreshToken } = await this.generateToken(newUser.id);

    const tokenHash = await bcrypt.hash(refreshToken, 10);

    await this.prisma.session.create({
      data: {
        token_hash: tokenHash,
        accountId: newUser.id,
      }
    });

    return {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
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

    if(!user) {
      throw new Error('Credenciais inválidas');
    }

    const { accessToken, refreshToken } = await this.generateToken(user.id);

    await this.prisma.session.create({
      data: {
        token_hash: await bcrypt.hash(refreshToken, 10),
        accountId: user.id,
      }
    });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      accessToken,
      refreshToken,
    };
  }

  async signOut(refreshToken: string) {
    const payload = this.jwtService.verify(refreshToken);

    const accountId = payload.sub;

    const sessions = await this.prisma.session.findMany({
      where: { accountId },
    });

    for (const session of sessions) {
      const isMatch = await bcrypt.compare(refreshToken, session.token_hash);

      if(isMatch) {
        await this.prisma.session.delete({
          where: { id: session.id },
        });
        break;
      }
    }

    return { message: 'Desconectado com sucesso' };
  }

  async getProfile(token: string) {
    try {
      const accessToken = token.replace('Bearer ', '');

      const payload = this.jwtService.verify(accessToken);

      const accountId = payload.sub;

      const user = await this.prisma.account.findUnique({
        where: { id: accountId },
      });

      if(!user) {
        throw new Error('Usuário não encontrado');
      }

      return {
        id: user.id,
        email: user.email,
        name: user.name,
      };
    } catch (error) {
      throw new Error('Token de acesso inválido');
    }
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);

      const accountId = payload.sub;

      const sessions = await this.prisma.session.findMany({
        where: { accountId },
      });

      let validSession: { token_hash: string; accountId: string } | null = null;

      for (const session of sessions) {
        const isMatch = await bcrypt.compare(refreshToken, session.token_hash);

        if(isMatch) {
          validSession = session;
          break;
        }

        if(!validSession) {
          throw new Error('Token de atualização inválido');
        }
      }

      const { refreshToken: newRefreshToken } = await this.generateToken(accountId);

      return { accessToken: newRefreshToken }
    } catch (error) {
      throw new Error('Token de atualização inválido');
    }
  }
}
