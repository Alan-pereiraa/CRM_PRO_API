import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private prismaService: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('Token de acesso ausente');
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Token de acesso inválido');
    }

    let payload: { jti: string; sub: string };

    try {
      payload = this.jwtService.verify(token, {
        secret: process.env.SECRET_KEY,
      });
    } catch {
      throw new UnauthorizedException('Token de acesso inválido');
    }

    const session = await this.prismaService.session.findUnique({
      where: { id: payload.jti },
    });

    if (!session) {
      throw new UnauthorizedException('Token de acesso inválido');
    }

    const account = await this.prismaService.account.findUnique({
      where: { id: payload.sub },
    });

    if (!account) {
      throw new UnauthorizedException('Token de acesso inválido');
    }

    request.account = account;

    return true;
  }
}
