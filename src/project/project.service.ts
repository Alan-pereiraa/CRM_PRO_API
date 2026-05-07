import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { StatusProject } from '../../generated/prisma/enums';

@Injectable()
export class ProjectService {
  constructor(private readonly prisma: PrismaService) {}

  getProjects(accountId: string) {
    return this.prisma.project.findMany({
      where: { accountId },
      orderBy: { createdAt: 'desc' },
    });
  }

  getProjectById(id: string) {
    return this.prisma.project.findUnique({
      where: { id },
    });
  }

  getProjectFunnels(id: string) {
    return this.prisma.project.findMany({
      where: { funnelId: id },
    });
  }

  getProjectDetails(id: string) {
    return this.prisma.project.findUnique({
      where: { id },
      include: {
        funnel: true,
        tasks: true,
        contacts: true,
      },
    });
  }

  createProject(payload: CreateProjectDto & { accountId: string }) {
    console.log('Creating project with payload:', payload);
    const { funnelId, accountId, ...data } = payload;
    return this.prisma.project.create({
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

  updateProject(
    id: string,
    payload: Partial<CreateProjectDto> & { accountId: string },
  ) {
    const { funnelId, accountId, ...data } = payload;
    return this.prisma.project.update({
      where: { id },
      data: {
        ...data,
        ...(funnelId && { funnel: { connect: { id: funnelId } } }),
        ...(accountId && { account: { connect: { id: accountId } } }),
      },
    });
  }

  updateProjectPosition(id: string, position: number) {
    return this.prisma.project.update({
      where: { id },
      data: { position },
    });
  }

  updateProjectStatus(id: string, status: StatusProject) {
    return this.prisma.project.update({
      where: { id },
      data: { status },
    });
  }

  deleteProject(id: string) {
    return this.prisma.project.delete({
      where: { id },
    });
  }
}
