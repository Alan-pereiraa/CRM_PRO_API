import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getOverView(accountId: string) {
    const existingAccount = await this.prisma.account.findUnique({
      where: {
        id: accountId,
      },
    });

    if (!existingAccount) {
      throw new NotFoundException('A conta não foi encontrada');
    }

    const projects = await this.prisma.project.findMany({
      where: {
        accountId,
      },
      include: {
        tasks: true,
        contacts: true,
      },
    });

    const totalProjects = projects.length;
    const totalContacts = projects.reduce(
      (acc, project) => acc + project.contacts.length,
      0,
    );
    const completedTasks = projects.reduce(
      (acc, project) =>
        acc +
        project.tasks.filter((task) => task.status === 'COMPLETED').length,
      0,
    );
    const pendingTasks = projects.reduce(
      (acc, project) =>
        acc + project.tasks.filter((task) => task.status === 'PENDING').length,
      0,
    );

    return {
      totalProjects,
      totalContacts,
      completedTasks,
      pendingTasks,
    };
  }
}
