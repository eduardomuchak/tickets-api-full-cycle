import { SpotStatusEnum, TicketKindEnum } from '@/db/schema';

export type ReserveSpotDTO = {
  spots: string[];
  ticket_kind: TicketKindEnum;
  email: string;
  status?: SpotStatusEnum;
};
