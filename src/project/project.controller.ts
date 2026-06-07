import {
  Controller,
  Get,
  Req,
  UseGuards,
  Param,
  Post,
  Body,
  Patch,
  Delete,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ProjectService } from './project.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { StatusProject } from '@prisma/client';

@ApiTags('projects')
@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get('/')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Listar projetos',
    description: 'Retorna todos os projetos do usuário autenticado.',
  })
  @ApiOkResponse({ description: 'Lista de projetos retornada com sucesso.' })
  async getProjects(@Req() req) {
    const accountId = req.account.id;
    return await this.projectService.getProjects(accountId);
  }

  @Get(':id/details')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Detalhar projeto',
    description: 'Retorna os detalhes completos de um projeto.',
  })
  @ApiOkResponse({ description: 'Detalhes do projeto retornados com sucesso.' })
  async getProjectDetails(@Req() req, @Param('id') id: string) {
    const accountId = req.account.id;
    return await this.projectService.getProjectDetails(id, accountId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Buscar projeto',
    description: 'Retorna um projeto pelo identificador.',
  })
  @ApiOkResponse({ description: 'Projeto retornado com sucesso.' })
  async getProjectById(@Req() req, @Param('id') id: string) {
    const accountId = req.account.id;
    return await this.projectService.getProjectById(id, accountId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Criar projeto',
    description: 'Cria um novo projeto para o usuário autenticado.',
  })
  @ApiOkResponse({ description: 'Projeto criado com sucesso.' })
  async createProject(@Req() req, @Body() projectData: CreateProjectDto) {
    const accountId = req.account.id;
    return await this.projectService.createProject({
      ...projectData,
      accountId,
    });
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Atualizar projeto',
    description: 'Atualiza os dados principais de um projeto.',
  })
  @ApiOkResponse({ description: 'Projeto atualizado com sucesso.' })
  async updateProject(
    @Req() req,
    @Param('id') id: string,
    @Body() projectData: UpdateProjectDto,
  ) {
    return await this.projectService.updateProject(id, {
      ...projectData,
      accountId: req.account.id,
    });
  }

  @Patch(':id/position')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Atualizar posição do projeto',
    description: 'Atualiza a posição do projeto na lista.',
  })
  @ApiOkResponse({ description: 'Posição atualizada com sucesso.' })
  async updateProjectPosition(
    @Req() req,
    @Param('id') id: string,
    @Body('position') position: number,
  ) {
    return await this.projectService.updateProjectPosition(
      id,
      position,
      req.account.id,
    );
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Atualizar status do projeto',
    description: 'Atualiza o status de um projeto.',
  })
  @ApiOkResponse({ description: 'Status atualizado com sucesso.' })
  async updateProjectStatus(
    @Req() req,
    @Param('id') id: string,
    @Body('status') status: StatusProject,
  ) {
    return await this.projectService.updateProjectStatus(
      id,
      status,
      req.account.id,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Excluir projeto',
    description: 'Remove um projeto do usuário autenticado.',
  })
  @ApiOkResponse({ description: 'Projeto excluído com sucesso.' })
  async deleteProject(@Req() req, @Param('id') id: string) {
    return await this.projectService.deleteProject(id, req.account.id);
  }
}
