import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { StatusProject } from '../../generated/prisma/enums';

@Injectable()
export class ProjectService {
  constructor(private readonly prisma: PrismaService) {}

  async getProjects(accountId: string) {
    return await this.prisma.project.findMany({
      where: { accountId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getProjectById(id: string, accountId: string) {
    const project = await this.prisma.project.findFirst({
      where: { id, accountId },
    });

    if (!project) {
      throw new NotFoundException('Projeto não encontrado');
    }

    return project;
  }

  async getProjectDetails(id: string, accountId: string) {
    const project = await this.prisma.project.findFirst({
      where: { id, accountId },
      include: {
        funnel: true,
        tasks: true,
        contacts: true,
      },
    });

    if (!project) {
      throw new NotFoundException('Projeto não encontrado');
    }

    return project;
  }

  async createProject(payload: CreateProjectDto & { accountId: string }) {
    const { funnelId, accountId, ...data } = payload;

    const project = await this.prisma.project.create({
      data: {
        ...data,
        ...(deadline ? { deadline: new Date(deadline) } : {}),
        funnel: {
          connect: { id: funnelId },
        },
        account: {
          connect: { id: accountId },
        },
      },
    });

    if (!project) {
      throw new NotFoundException('Erro ao criar projeto');
    }

    return project;
  }

  async updateProject(
    id: string,
    payload: Partial<CreateProjectDto> & { accountId: string },
  ) {
    const { funnelId, accountId, ...data } = payload;
    const project = await this.prisma.project.update({
      where: { id, accountId },
      data: {
        ...data,
        ...(deadline !== undefined
          ? { deadline: deadline ? new Date(deadline) : null }
          : {}),
        ...(funnelId && { funnel: { connect: { id: funnelId } } }),
      },
    });

    if (!project) {
      throw new NotFoundException('Erro ao atualizar projeto');
    }

    return project;
  }

  async updateProjectPosition(id: string, position: number, accountId: string) {
    const project = await this.prisma.project.update({
      where: { id, accountId },
      data: { position },
    });

    if (!project) {
      throw new NotFoundException('Erro ao atualizar posição do projeto');
    }

    return project;
  }

  async updateProjectStatus(
    id: string,
    status: StatusProject,
    accountId: string,
  ) {
    const project = await this.prisma.project.update({
      where: { id, accountId },
      data: { status },
    });

    if (!project) {
      throw new NotFoundException('Erro ao atualizar status do projeto');
    }

    return project;
  }

  async deleteProject(id: string, accountId: string) {
    return await this.prisma.project.delete({
      where: { id, accountId },
    });
  }
}
