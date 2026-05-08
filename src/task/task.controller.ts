import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  UseGuards,
  Body,
  Param,
  Req,
  Query,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get('/')
  @UseGuards(JwtAuthGuard)
  async getTasks(@Req() req, @Query('status') status?: string) {
    return await this.taskService.getTasks(req.account.id, status);
  }

  @Get('today')
  @UseGuards(JwtAuthGuard)
  async getTodayTasks(@Req() req) {
    return await this.taskService.getTodayTasks(req.account.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getTask(@Req() req, @Param('id') id: string) {
    return await this.taskService.getTask(id, req.account.id);
  }

  @Post('/')
  @UseGuards(JwtAuthGuard)
  async createTask(@Req() req, @Body() taskData: CreateTaskDto) {
    return await this.taskService.createTask(taskData, req.account.id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updateTask(
    @Req() req,
    @Param('id') id: string,
    @Body() taskData: UpdateTaskDto,
  ) {
    return await this.taskService.updateTask(id, taskData, req.account.id);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  async updateTaskStatus(
    @Req() req,
    @Param('id') id: string,
    @Body() body: UpdateTaskStatusDto,
  ) {
    return await this.taskService.updateTaskStatus(
      id,
      body.status,
      req.account.id,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteTask(@Req() req, @Param('id') id: string) {
    return await this.taskService.deleteTask(id, req.account.id);
  }
}
