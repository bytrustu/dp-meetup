export type Team = {
  id: string;
  name: string;
  image_url: string;
  description: string;
  characteristic: string;
  is_active: boolean;
  batch: number;
  created_at: string;
};

export type TeamCreate = Omit<Team, 'id' | 'created_at'>; 