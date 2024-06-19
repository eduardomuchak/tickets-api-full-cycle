import { Inject, Injectable } from '@nestjs/common';
import { CreateSpotDto } from './dto/create-spot.dto';
import { UpdateSpotDto } from './dto/update-spot.dto';
import { DB_PROVIDER, DB } from '@/db/database.providers';
import { spots, events, SpotStatusEnum } from '@/db/schema';
import { and, eq } from 'drizzle-orm';

@Injectable()
export class SpotsService {
  constructor(@Inject(DB_PROVIDER) private readonly db: DB) {}

  async create(createSpotDto: CreateSpotDto & { eventId: string }) {
    const event = await this.db
      .select()
      .from(events)
      .where(eq(events.id, createSpotDto.eventId))
      .execute();

    if (!event.length) {
      throw new Error('Event not found');
    }

    const result = await this.db
      .insert(spots)
      .values({ ...createSpotDto, status: SpotStatusEnum.available })
      .returning();
    return result[0];
  }

  findAll(eventId: string) {
    return this.db
      .select()
      .from(spots)
      .where(eq(spots.eventId, eventId))
      .execute();
  }

  async findOne(eventId: string, spotId: string) {
    const result = await this.db
      .select()
      .from(spots)
      .where(and(eq(spots.eventId, eventId), eq(spots.id, spotId)))
      .execute();

    return result[0];
  }

  async update(eventId: string, spotId: string, updateSpotDto: UpdateSpotDto) {
    const result = await this.db
      .update(spots)
      .set(updateSpotDto)
      .where(and(eq(spots.eventId, eventId), eq(spots.id, spotId)))
      .returning();

    return result[0];
  }

  async remove(eventId: string, spotId: string) {
    await this.db
      .delete(spots)
      .where(and(eq(spots.eventId, eventId), eq(spots.id, spotId)))
      .execute();

    return `The spot with the id: ${spotId} has been deleted.`;
  }
}
