import { Inject, Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { DB_PROVIDER, DB } from '@/db/database.providers';
import {
  events,
  reservationHistories,
  spots,
  tickets,
  SpotStatusEnum,
  TicketStatusEnum,
} from '@/db/schema';
import { and, eq, inArray } from 'drizzle-orm';
import { ReserveSpotDTO } from './dto/reserve-spot.dto';

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

  async reserveSpot(dto: ReserveSpotDTO & { eventId: string }) {
    const eventSpots = await this.db
      .select()
      .from(spots)
      .where(and(eq(spots.eventId, dto.eventId), inArray(spots.id, dto.spots)))
      .execute();

    if (eventSpots.length !== dto.spots.length) {
      const foundSpotsName = eventSpots.map((spot) => spot.name);
      const notFoundSpotsName = dto.spots.filter(
        (spotName) => !foundSpotsName.includes(spotName),
      );
      throw new Error(`Spots ${notFoundSpotsName.join(', ')} not found`);
    }

    try {
      const spotsReservations = await this.db.transaction(
        async (transaction) => {
          await transaction
            .insert(reservationHistories)
            .values(
              eventSpots.map((spot) => ({
                spotId: spot.id,
                ticketKind: dto.ticket_kind,
                email: dto.email,
                status: TicketStatusEnum.reserved,
              })),
            )
            .execute();

          await transaction
            .update(spots)
            .set({ status: SpotStatusEnum.reserved })
            .where(
              inArray(
                spots.id,
                eventSpots.map((spot) => spot.id),
              ),
            )
            .execute();

          const ticketReservation = await Promise.all(
            eventSpots.map((spot) =>
              transaction
                .insert(tickets)
                .values({
                  spotId: spot.id,
                  ticketKind: dto.ticket_kind,
                  email: dto.email,
                })
                .returning(),
            ),
          );

          return ticketReservation;
        },
      );
      return spotsReservations.flat();
    } catch (e: unknown) {
      throw this.handleError(e);
    }
  }

  private handleError(e) {
    // TODO: Handle error using exception filter of nestjs
    if (e.code === '23505') {
      throw new Error('Unique constraint violation');
    } else if (e.code === '40001') {
      throw new Error('Transaction conflict');
    } else {
      throw e;
    }
  }
}
