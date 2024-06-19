import { TicketKindEnum } from '@/db/schema';

export type ReserveSpotDTO = {
  spots: string[];
  ticket_kind: TicketKindEnum;
  email: string;
};
