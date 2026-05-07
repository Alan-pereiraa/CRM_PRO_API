import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { StatusTask } from '@prisma/client';

@Injectable()
export class TaskService {
  constructor(private readonly prisma: PrismaService) {}

  getTasks(accountId: string, status?: string) {
    return this.prisma.task.findMany({
      where: {
        project: {
          accountId: accountId,
        },
        ...(status ? { status: status as StatusTask } : {}),
      },
    });
  }

  getTask(id: string) {
    return this.prisma.task.findUnique({
      where: { id },
    });
  }

  getTodayTasks(accountId: string) {
    const today = new Date();
    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    return this.prisma.task.findMany({
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

  createTask(taskData: CreateTaskDto) {
    return this.prisma.task.create({
      data: taskData,
    });
  }

  updateTask(id: string, taskData: UpdateTaskDto) {
    return this.prisma.task.update({
      where: { id },
      data: taskData,
    });
  }

  updateTaskStatus(id: string, status: StatusTask) {
    return this.prisma.task.update({
      where: { id },
      data: { status },
    });
  }

  deleteTask(id: string) {
    return this.prisma.task.delete({
      where: { id },
    });
  }
}
