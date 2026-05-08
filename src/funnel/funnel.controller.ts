import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FunnelService } from './funnel.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { CreateFunnelDto } from './dto/create-funnel.dto';
import { UpdateFunnelDto } from './dto/update.funnel.dto';

@Controller('funnels')
export class FunnelController {
  constructor(private readonly funnelService: FunnelService) {}

  @Get('/')
  @UseGuards(JwtAuthGuard)
  getFunnels(@Req() req) {
    return this.funnelService.getFunnels(req.account.id);
  }

  @Get(':id/projects')
  @UseGuards(JwtAuthGuard)
  getFunnelProjects(@Param('id') id: string, @Req() req) {
    return this.funnelService.getFunnelProjects(id, req.account.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  getFunnelById(@Param('id') id: string, @Req() req) {
    return this.funnelService.getFunnelById(id, req.account.id);
  }

  @Post('/')
  @UseGuards(JwtAuthGuard)
  createFunnel(@Req() req, @Body() funnelData: CreateFunnelDto) {
    const payload = {
      ...funnelData,
      accountId: req.account.id,
    };

    return this.funnelService.createFunnel(payload);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  updateFunnel(
    @Param('id') id: string,
    @Req() req,
    @Body() funnelData: UpdateFunnelDto,
  ) {
    return this.funnelService.updateFunnel(id, req.account.id, funnelData);
  }

  @Patch(':id/position')
  @UseGuards(JwtAuthGuard)
  updateFunnelPosition(
    @Param('id') id: string,
    @Req() req,
    @Body('position') position: number,
  ) {
    return this.funnelService.updateFunnelPosition(
      id,
      req.account.id,
      position,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  deleteFunnel(@Param('id') id: string, @Req() req) {
    return this.funnelService.deleteFunnel(id, req.account.id);
  }
}
