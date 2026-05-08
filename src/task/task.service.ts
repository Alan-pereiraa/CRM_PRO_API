import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { StatusTask } from '@prisma/client';

@Injectable()
export class TaskService {
  constructor(private readonly prisma: PrismaService) {}

  async getTasks(accountId: string, status?: string) {
    return await this.prisma.task.findMany({
      where: {
        project: {
          accountId: accountId,
        },
        ...(status ? { status: status as StatusTask } : {}),
      },
    });
  }

  async getTask(id: string, accountId: string) {
    const task = await this.prisma.task.findFirst({
      where: {
        id,
        project: {
          accountId,
        },
      },
    });
    if (!task) {
      throw new NotFoundException('Tarefa não encontrada');
    }
    return task;
  }

  async getTodayTasks(accountId: string) {
    const today = new Date();
    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    return await this.prisma.task.findMany({
      where: {
        project: {
          accountId: accountId,
        },
        dueDate: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });
  }

  async createTask(taskData: CreateTaskDto, accountId: string) {
    const project = await this.prisma.project.findFirst({
      where: {
        id: taskData.projectId,
        accountId,
      },
    });
    if (!project) {
      throw new NotFoundException('Projeto não encontrado');
    }
    return await this.prisma.task.create({
      data: taskData,
    });
  }

  async updateTask(id: string, taskData: UpdateTaskDto, accountId: string) {
    const task = await this.prisma.task.findFirst({
      where: {
        id,
        project: {
          accountId,
        },
      },
    });
    if (!task) {
      throw new NotFoundException('Tarefa não encontrada');
    }
    return await this.prisma.task.update({
      where: { id },
      data: taskData,
    });
  }

  async updateTaskStatus(id: string, status: StatusTask, accountId: string) {
    const task = await this.prisma.task.findFirst({
      where: {
        id,
        project: {
          accountId,
        },
      },
    });
    if (!task) {
      throw new NotFoundException('Tarefa não encontrada');
    }
    return await this.prisma.task.update({
      where: { id },
      data: { status },
    });
  }

  async deleteTask(id: string, accountId: string) {
    const task = await this.prisma.task.findFirst({
      where: {
        id,
        project: {
          accountId,
        },
      },
    });
    if (!task) {
      throw new NotFoundException('Tarefa não encontrada');
    }
    return await this.prisma.task.delete({
      where: { id },
    });
  }
}
