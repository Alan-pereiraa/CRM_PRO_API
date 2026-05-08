import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFunnelDto } from './dto/create-funnel.dto';
import { UpdateFunnelDto } from './dto/update.funnel.dto';

@Injectable()
export class FunnelService {
  constructor(private readonly prisma: PrismaService) {}

  getFunnels(accountId: string) {
    return this.prisma.funnel.findMany({
      where: { accountId },
      orderBy: { position: 'asc' },
    });
  }

  async getFunnelById(id: string, accountId: string) {
    const funnel = await this.prisma.funnel.findFirst({
      where: { id, accountId },
    });

    if (!funnel) {
      throw new NotFoundException('Funil não encontrado');
    }

    return funnel;
  }

  async getFunnelProjects(id: string, accountId: string) {
    const funnel = await this.prisma.funnel.findFirst({
      where: { id, accountId },
    });

    if (!funnel) {
      throw new NotFoundException('Funil não encontrado');
    }

    return this.prisma.project.findMany({
      where: { funnelId: id, accountId },
    });
  }

  createFunnel(payload: CreateFunnelDto & { accountId: string }) {
    const { accountId, ...data } = payload;
    return this.prisma.funnel.create({
      data: {
        ...data,
        account: {
          connect: { id: accountId },
        },
      },
    });
  }

  async updateFunnel(id: string, accountId: string, payload: UpdateFunnelDto) {
    const funnel = await this.prisma.funnel.findFirst({
      where: { id, accountId },
    });

    if (!funnel) {
      throw new NotFoundException('Funil não encontrado');
    }

    return this.prisma.funnel.update({
      where: { id },
      data: payload,
    });
  }

  async updateFunnelPosition(id: string, accountId: string, position: number) {
    const funnel = await this.prisma.funnel.findFirst({
      where: { id, accountId },
    });

    if (!funnel) {
      throw new NotFoundException('Funil não encontrado');
    }

    return this.prisma.funnel.update({
      where: { id },
      data: { position },
    });
  }

  async deleteFunnel(id: string, accountId: string) {
    const funnel = await this.prisma.funnel.findFirst({
      where: { id, accountId },
    });

    if (!funnel) {
      throw new NotFoundException('Funil não encontrado');
    }

    return this.prisma.funnel.delete({
      where: { id },
    });
  }
}
