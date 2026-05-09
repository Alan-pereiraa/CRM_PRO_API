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
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { TaskService } from './task.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';

@ApiTags('tasks')
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get('/')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Listar tarefas',
    description: 'Retorna todas as tarefas do usuário autenticado.',
  })
  @ApiOkResponse({ description: 'Lista de tarefas retornada com sucesso.' })
  async getTasks(@Req() req, @Query('status') status?: string) {
    return await this.taskService.getTasks(req.account.id, status);
  }

  @Get('today')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Tarefas de hoje',
    description: 'Retorna as tarefas com vencimento ou contexto do dia.',
  })
  @ApiOkResponse({ description: 'Tarefas de hoje retornadas com sucesso.' })
  async getTodayTasks(@Req() req) {
    return await this.taskService.getTodayTasks(req.account.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Buscar tarefa',
    description: 'Retorna uma tarefa pelo identificador.',
  })
  @ApiOkResponse({ description: 'Tarefa retornada com sucesso.' })
  async getTask(@Req() req, @Param('id') id: string) {
    return await this.taskService.getTask(id, req.account.id);
  }

  @Post('/')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Criar tarefa',
    description: 'Cria uma nova tarefa para o usuário autenticado.',
  })
  @ApiOkResponse({ description: 'Tarefa criada com sucesso.' })
  async createTask(@Req() req, @Body() taskData: CreateTaskDto) {
    return await this.taskService.createTask(taskData, req.account.id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Atualizar tarefa',
    description: 'Atualiza os dados principais de uma tarefa.',
  })
  @ApiOkResponse({ description: 'Tarefa atualizada com sucesso.' })
  async updateTask(
    @Req() req,
    @Param('id') id: string,
    @Body() taskData: UpdateTaskDto,
  ) {
    return await this.taskService.updateTask(id, taskData, req.account.id);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Atualizar status da tarefa',
    description: 'Atualiza apenas o status da tarefa.',
  })
  @ApiOkResponse({ description: 'Status da tarefa atualizado com sucesso.' })
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
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Excluir tarefa',
    description: 'Remove uma tarefa do usuário autenticado.',
  })
  @ApiOkResponse({ description: 'Tarefa excluída com sucesso.' })
  async deleteTask(@Req() req, @Param('id') id: string) {
    return await this.taskService.deleteTask(id, req.account.id);
  }
}
