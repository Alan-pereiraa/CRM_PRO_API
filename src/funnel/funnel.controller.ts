import { Controller, Get, UseGuards, Req, Param, Post, Body, Patch, Put, Delete } from '@nestjs/common';
import { FunnelService } from './funnel.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { CreateFunnelDto } from './dto/create-funnel.dto';
import { UpdateFunnelDto } from './dto/update.funnel.dto';

@Controller('funnel')
export class FunnelController {
  constructor(
    private readonly funnelService: FunnelService
  ) {}

  @Get('funnels')
  @UseGuards(JwtAuthGuard)
  getFunnels(
    @Req() req,
  ) {
    return this.funnelService.getFunnels(req.account.id);
  }

  @Get('funnels/:id')
  @UseGuards(JwtAuthGuard)
  getFunnelById(
    @Param('id') id: string,
  ) {
    return this.funnelService.getFunnelById(id);
  }

  @Post('funnels')
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

  @Put('funnels/:id')
  @UseGuards(JwtAuthGuard)
  updateFunnel(
    @Param('id') id: string,
    @Body() funnelData: UpdateFunnelDto
  ) {
    return this.funnelService.updateFunnel(id, funnelData);
  }

  @Patch('funnels/:id/position')
  @UseGuards(JwtAuthGuard)
  updateFunnelPosition(
    @Param('id') id: string,
    @Body('position') position: number
  ) {
    return this.funnelService.updateFunnelPosition(id, position);
  }

  @Delete('funnels/:id')
  @UseGuards(JwtAuthGuard)
  deleteFunnel(
    @Param('id') id: string,
  ) {
    return this.funnelService.deleteFunnel(id);
  }

}
