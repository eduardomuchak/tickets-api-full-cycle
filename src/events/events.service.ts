import { Inject, Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { DB_PROVIDER, DB } from '@/db/database.providers';
import { events } from '@/db/schema';

@Injectable()
export class EventsService {
  constructor(@Inject(DB_PROVIDER) private readonly db: DB) {}

  async create(createEventDto: CreateEventDto) {
    const result = await this.db
      .insert(events)
      .values({
        name: createEventDto.name,
        description: createEventDto.description,
        date: createEventDto.date,
        price: createEventDto.price,
      })
      .returning();
    return result[0];
  }

  findAll() {
    return `This action returns all events`;
  }

  findOne(id: number) {
    return `This action returns a #${id} event`;
  }

  update(id: number, updateEventDto: UpdateEventDto) {
    return `This action updates a #${id} event`;
  }

  remove(id: number) {
    return `This action removes a #${id} event`;
  }
}
