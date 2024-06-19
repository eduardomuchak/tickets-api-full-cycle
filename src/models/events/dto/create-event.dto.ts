import { events } from '@/db/schema';
import { InferInsertModel } from 'drizzle-orm';

export type CreateEventDto = InferInsertModel<typeof events>;
