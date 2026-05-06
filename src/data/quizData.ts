export interface Quiz {
  question: string;
  options: string[];
  answer: number;
  hint: string;
  explanation?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export const categories: Category[] = [
  { id: 'economy', name: '경제·재테크', icon: '💰', color: '#F39C12' },
  { id: 'mz', name: 'MZ 트렌드', icon: '🔥', color: '#FF6B6B' },
  { id: 'mudo', name: '무도퀴즈', icon: '📺', color: '#5B86E5' },
  { id: 'general', name: '일반 상식', icon: '🧠', color: '#4A90D9' },
  { id: 'science', name: '과학', icon: '🔬', color: '#27AE60' },
  { id: 'history', name: '역사', icon: '📜', color: '#E67E22' },
  { id: 'entertainment', name: '연예', icon: '🎬', color: '#E74C3C' },
  { id: 'sports', name: '스포츠', icon: '⚽', color: '#8E44AD' },
  { id: 'geography', name: '지리', icon: '🌍', color: '#1ABC9C' },
];

import { generalQuizzes } from './categories/general';
import { scienceQuizzes } from './categories/science';
import { historyQuizzes } from './categories/history';
import { entertainmentQuizzes } from './categories/entertainment';
import { sportsQuizzes } from './categories/sports';
import { geographyQuizzes } from './categories/geography';
import { economyQuizzes } from './categories/economy';
import { mzQuizzes } from './categories/mz';
import { mudoQuizzes } from './categories/mudo';

export const quizzes: Record<string, Quiz[]> = {
  economy: economyQuizzes,
  mz: mzQuizzes,
  mudo: mudoQuizzes,
  general: generalQuizzes,
  science: scienceQuizzes,
  history: historyQuizzes,
  entertainment: entertainmentQuizzes,
  sports: sportsQuizzes,
  geography: geographyQuizzes,
};
