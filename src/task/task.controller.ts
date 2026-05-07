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
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get('/')
  @UseGuards(JwtAuthGuard)
  getTasks(@Req() req, @Query('status') status?: string) {
    return this.taskService.getTasks(req.account.id, status);
  }

  @Get('today')
  @UseGuards(JwtAuthGuard)
  getTodayTasks(@Req() req) {
    return this.taskService.getTodayTasks(req.account.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  getTask(@Param('id') id: string) {
    return this.taskService.getTask(id);
  }

  @Post('/')
  @UseGuards(JwtAuthGuard)
  createTask(@Body() taskData: CreateTaskDto) {
    return this.taskService.createTask(taskData);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  updateTask(@Param('id') id: string, @Body() taskData: CreateTaskDto) {
    return this.taskService.updateTask(id, taskData);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  updateTaskStatus(@Param('id') id: string, @Body() body: UpdateTaskStatusDto) {
    return this.taskService.updateTaskStatus(id, body.status);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  deleteTask(@Param('id') id: string) {
    return this.taskService.deleteTask(id);
  }
}
