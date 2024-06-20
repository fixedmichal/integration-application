export type Integration = {
  id?: number; // optional
  name: string;
  budget: number;
  participants: number;
  picture: string | null;
  dateStart?: string;
  dateEnd?: string;
};
