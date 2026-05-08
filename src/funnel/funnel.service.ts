import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
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

    getFunnelById(id: string) {
        return this.prisma.funnel.findUnique({
            where: { id },
        });
    }

    getFunnelProjects(id: string) {
        return this.prisma.project.findMany({
            where: { funnelId: id },
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

    updateFunnel(id: string, payload: UpdateFunnelDto) {
        const funnel = this.prisma.funnel.findUnique({
            where: { id },
        });

        if (!funnel) {
            throw new NotFoundException('Funil não encontrado');
        }

        return this.prisma.funnel.update({
            where: { id },
            data: payload,
        });
    }

    async updateFunnelPosition(id: string, position: number) {
        const funnel = await this.prisma.funnel.findUnique({
            where: { id },
        });

        if (!funnel) {
            throw new NotFoundException('Funil não encontrado');
        }

        return this.prisma.funnel.update({
            where: { id },
            data: { position },
        });
    }

    deleteFunnel(id: string) {
        const funnel = this.prisma.funnel.findUnique({
            where: { id },
        });

        if(!funnel) {
            throw new NotFoundException('Funil não encontrado');
        }

        return this.prisma.funnel.delete({
            where: { id },
        });
    }
}
