export interface Motif {
  id: string;
  title: string;
  category: MotifCategory;
  description: string;
  history: string;
  imageUrl: string;
  fileName?: string; // Supabase storage filename
  createdAt: string;
}

export type MotifCategory = 
  | 'çini'
  | 'halı-kilim'
  | 'motif';

export const categoryLabels: Record<MotifCategory, string> = {
  'çini': 'Çini',
  'halı-kilim': 'Halı & Kilim',
  'motif': 'Motif',
};