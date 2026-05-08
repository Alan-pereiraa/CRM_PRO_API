import { Controller, Get, UseGuards, Req, Param, Post, Body, Patch, Put, Delete } from '@nestjs/common';
import { FunnelService } from './funnel.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { CreateFunnelDto } from './dto/create-funnel.dto';
import { UpdateFunnelDto } from './dto/update.funnel.dto';

@Controller('funnels')
export class FunnelController {
  constructor(
    private readonly funnelService: FunnelService
  ) {}

  @Get('/')
  @UseGuards(JwtAuthGuard)
  getFunnels(
    @Req() req,
  ) {
    return this.funnelService.getFunnels(req.account.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  getFunnelById(
    @Param('id') id: string,
  ) {
    return this.funnelService.getFunnelById(id);
  }

  @Get(':id/projects')
  @UseGuards(JwtAuthGuard)
  getFunnelProjects(
    @Param('id') id: string,
  ) {
    return this.funnelService.getFunnelProjects(id);
  }

  @Post('/')
  @UseGuards(JwtAuthGuard)
  createFunnel(
    @Req() req,
    @Body() funnelData: CreateFunnelDto
  ) {
    const payload = {
      ...funnelData,
      accountId: req.account.id
    }

    return this.funnelService.createFunnel(payload);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  updateFunnel(
    @Param('id') id: string,
    @Body() funnelData: UpdateFunnelDto
  ) {
    return this.funnelService.updateFunnel(id, funnelData);
  }

  @Patch(':id/position')
  @UseGuards(JwtAuthGuard)
  updateFunnelPosition(
    @Param('id') id: string,
    @Body('position') position: number
  ) {
    return this.funnelService.updateFunnelPosition(id, position);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  deleteFunnel(
    @Param('id') id: string,
  ) {
    return this.funnelService.deleteFunnel(id);
  }

}
