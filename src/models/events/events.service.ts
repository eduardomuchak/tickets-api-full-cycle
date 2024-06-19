import { Inject, Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { DB_PROVIDER, DB } from '@/db/database.providers';
import { events } from '@/db/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class EventsService {
  constructor(@Inject(DB_PROVIDER) private readonly db: DB) {}

  async create(createEventDto: CreateEventDto) {
    if (!(createEventDto.date instanceof Date)) {
      createEventDto.date = new Date(createEventDto.date);
    }

    const result = await this.db
      .insert(events)
      .values(createEventDto)
      .returning();
    return result[0];
  }

  findAll() {
    return this.db.select().from(events).execute();
  }

  async findOne(id: string) {
    const result = await this.db
      .select()
      .from(events)
      .where(eq(events.id, id))
      .execute();
    return result[0];
  }

  async update(id: string, updateEventDto: UpdateEventDto) {
    if (updateEventDto?.date && !(updateEventDto.date instanceof Date)) {
      updateEventDto.date = new Date(updateEventDto.date);
    }

    const result = await this.db
      .update(events)
      .set(updateEventDto)
      .where(eq(events.id, id))
      .returning();
    return result[0];
  }

  async remove(id: string) {
    await this.db.delete(events).where(eq(events.id, id)).execute();
    return `The event with the id: ${id} has been deleted.`;
  }
}
