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
import { ProjectService } from './project.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { StatusProject } from '../../generated/prisma/enums';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get('/')
  @UseGuards(JwtAuthGuard)
  async getProjects(@Req() req) {
    return await this.projectService.getProjects(req.account.id);
  }

  @Get(':id/details')
  @UseGuards(JwtAuthGuard)
  async getProjectDetails(@Req() req, @Param('id') id: string) {
    return await this.projectService.getProjectDetails(id, req.account.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getProjectById(@Req() req, @Param('id') id: string) {
    return await this.projectService.getProjectById(id, req.account.id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createProject(@Req() req, @Body() projectData: CreateProjectDto) {
    return await this.projectService.createProject({
      ...projectData,
      accountId: req.account.id,
    });
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
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
  async deleteProject(@Req() req, @Param('id') id: string) {
    return await this.projectService.deleteProject(id, req.account.id);
  }
}
