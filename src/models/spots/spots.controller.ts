import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';

import { CreateSpotDto } from './dto/create-spot.dto';
import { SpotsService } from './spots.service';
import { UpdateSpotDto } from './dto/update-spot.dto';

@Controller('events/:eventId/spots')
export class SpotsController {
  constructor(private readonly spotsService: SpotsService) {}

  @Post()
  create(
    @Body() createSpotRequest: CreateSpotDto,
    @Param('eventId') eventId: string,
  ) {
    return this.spotsService.create({
      ...createSpotRequest,
      eventId,
    });
  }

  @Get()
  findAll(@Param('eventId') eventId: string) {
    return this.spotsService.findAll(eventId);
  }

  @Get(':spotId')
  findOne(@Param('eventId') eventId: string, @Param('spotId') spotId: string) {
    return this.spotsService.findOne(eventId, spotId);
  }

  @Patch(':spotId')
  update(
    @Param('eventId') eventId: string,
    @Param('spotId') spotId: string,
    @Body() updateSpotRequest: UpdateSpotDto,
  ) {
    return this.spotsService.update(eventId, spotId, updateSpotRequest);
  }

  @Delete(':spotId')
  remove(@Param('eventId') eventId: string, @Param('spotId') spotId: string) {
    return this.spotsService.remove(eventId, spotId);
  }
}
