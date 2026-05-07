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
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { StatusProject } from '../../generated/prisma/enums';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get('projects')
  @UseGuards(JwtAuthGuard)
  getProjects(@Req() req) {
    return this.projectService.getProjects(req.account.id);
  }

  @Get('projects/:id')
  @UseGuards(JwtAuthGuard)
  getProjectById(@Param('id') id: string) {
    return this.projectService.getProjectById(id);
  }

  @Get('funnels/:id/projects')
  @UseGuards(JwtAuthGuard)
  getProjectFunnels(@Param('id') id: string) {
    return this.projectService.getProjectFunnels(id);
  }

  @Get('projects/:id/details')
  @UseGuards(JwtAuthGuard)
  getProjectDetails(@Param('id') id: string) {
    return this.projectService.getProjectDetails(id);
  }

  @Post('projects')
  @UseGuards(JwtAuthGuard)
  createProject(@Req() req, @Body() projectData: CreateProjectDto) {
    return this.projectService.createProject({
      ...projectData,
      accountId: req.account.id,
    });
  }

  @Patch('projects/:id')
  @UseGuards(JwtAuthGuard)
  updateProject(
    @Req() req,
    @Param('id') id: string,
    @Body() projectData: UpdateProjectDto,
  ) {
    return this.projectService.updateProject(id, {
      ...projectData,
      accountId: req.account.id,
    });
  }

  @Patch('projects/:id/position')
  @UseGuards(JwtAuthGuard)
  updateProjectPosition(
    @Param('id') id: string,
    @Body('position') position: number,
  ) {
    return this.projectService.updateProjectPosition(id, position);
  }

  @Patch('projects/:id/status')
  @UseGuards(JwtAuthGuard)
  updateProjectStatus(
    @Param('id') id: string,
    @Body('status') status: StatusProject,
  ) {
    return this.projectService.updateProjectStatus(id, status);
  }

  @Delete('projects/:id')
  @UseGuards(JwtAuthGuard)
  deleteProject(@Param('id') id: string) {
    return this.projectService.deleteProject(id);
  }
}
