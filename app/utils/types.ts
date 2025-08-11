export interface WeightRecord {
  id: string;
  date: string;
  weight: number;
  fat?: number;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WeightFormData {
  date: string;
  weight: number;
  fat?: number;
  note?: string;
}
