import {
  pgTable,
  text,
  uuid,
  varchar,
  timestamp,
  decimal,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const events = pgTable('events', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description').notNull(),
  date: timestamp('date').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export enum SpotStatusEnum {
  available = 'available',
  reserved = 'reserved',
}
export const SpotStatus = pgEnum('SpotStatus', [
  SpotStatusEnum.available,
  SpotStatusEnum.reserved,
]);

export const spots = pgTable('spots', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  status: SpotStatus('status').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  eventId: uuid('event_id')
    .notNull()
    .references(() => events.id),
});

export enum TicketKindEnum {
  full = 'full',
  half = 'reserhalfved',
}

export const TicketKind = pgEnum('TicketKind', [
  TicketKindEnum.full,
  TicketKindEnum.half,
]);

export const tickets = pgTable('tickets', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull(),
  ticketKind: TicketKind('ticket_kind').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  spotId: uuid('spot_id')
    .notNull()
    .unique()
    .references(() => spots.id),
});

export enum TicketStatusEnum {
  reserved = 'reserved',
  canceled = 'canceled',
}

export const TicketStatus = pgEnum('TicketStatus', [
  TicketStatusEnum.reserved,
  TicketStatusEnum.canceled,
]);

export const reservationHistories = pgTable('reservation_histories', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull(),
  ticketKind: TicketKind('ticket_kind').notNull(),
  status: TicketStatus('status').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  spotId: uuid('spot_id')
    .notNull()
    .references(() => spots.id),
});

// Relations
export const eventsRelations = relations(events, ({ many }) => ({
  spots: many(spots),
}));

export const spotsRelations = relations(spots, ({ one, many }) => ({
  event: one(events),
  ticket: many(tickets),
  reservationHistories: many(reservationHistories),
}));

export const ticketsRelations = relations(tickets, ({ one }) => ({
  spot: one(spots),
}));

export const reservationHistoriesRelations = relations(
  reservationHistories,
  ({ one }) => ({
    spot: one(spots),
  }),
);
