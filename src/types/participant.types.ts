export type Participant = {
  id: string;
  name: string;
  team: string;
  role: string;
  batch: number;
  registered_at: string;
};

export type ParticipantCreate = {
  name: string;
  team: string;
  role: string;
  batch: number;
};
