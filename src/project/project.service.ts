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
    return await this.prisma.project.create({
      data: {
        ...data,
        funnel: {
          connect: { id: funnelId },
        },
        account: {
          connect: { id: accountId },
        },
      },
    });
  }

  async updateProject(
    id: string,
    payload: Partial<CreateProjectDto> & { accountId: string },
  ) {
    const { funnelId, accountId, ...data } = payload;
    return await this.prisma.project.update({
      where: { id, accountId },
      data: {
        ...data,
        ...(funnelId && { funnel: { connect: { id: funnelId } } }),
      },
    });
  }

  async updateProjectPosition(id: string, position: number, accountId: string) {
    return await this.prisma.project.update({
      where: { id, accountId },
      data: { position },
    });
  }

  async updateProjectStatus(
    id: string,
    status: StatusProject,
    accountId: string,
  ) {
    return await this.prisma.project.update({
      where: { id, accountId },
      data: { status },
    });
  }

  async deleteProject(id: string, accountId: string) {
    return await this.prisma.project.delete({
      where: { id, accountId },
    });
  }
}
