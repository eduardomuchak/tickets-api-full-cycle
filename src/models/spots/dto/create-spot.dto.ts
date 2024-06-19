import { spots } from '@/db/schema';
import { InferInsertModel } from 'drizzle-orm';

export type CreateSpotDto = InferInsertModel<typeof spots>;
