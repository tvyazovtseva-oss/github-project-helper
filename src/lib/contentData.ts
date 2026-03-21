// ─── Content Data Architecture ─────────────────────────────────────────
// Prepared for future migration to Supabase tables

export type ContentType = 'video' | 'audio' | 'pdf' | 'guide' | 'checklist';
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface ContentTag {
  id: string;
  type: 'age' | 'topic' | 'subtopic';
  label: string;
  parentId?: string; // for subtopic → topic relation
}

export interface ContentItem {
  id: string;
  title: string;
  description: string;
  type: ContentType;
  duration?: string; // "12 мин", "1.5 ч"
  fileSize?: string;
  thumbnailUrl?: string;
  difficulty: Difficulty;
  tags: string[]; // tag IDs
  clubOnly: boolean; // only available in Club
  createdAt: string;
}

export interface WeeklyPlanItem {
  contentId: string;
  day: number; // 1-7
  order: number;
}

export interface QuestionnaireResult {
  topics: string[];
  subtopics: string[];
  childAge?: number; // months
  materialsCount: number;
  difficulty: Difficulty;
  generatedAt: string;
}

export interface ContentGapAlert {
  id: string;
  userId: string;
  requestedTopics: string[];
  requestedSubtopics: string[];
  availableCount: number;
  requestedCount: number;
  createdAt: string;
}

// ─── Tags ───────────────────────────────────────────────────────────────

export const TOPICS: ContentTag[] = [
  { id: 'topic_pediatrics', type: 'topic', label: 'Педиатрия' },
  { id: 'topic_psychology', type: 'topic', label: 'Психология' },
  { id: 'topic_nutrition', type: 'topic', label: 'Питание' },
  { id: 'topic_sleep', type: 'topic', label: 'Сон' },
  { id: 'topic_development', type: 'topic', label: 'Развитие' },
  { id: 'topic_safety', type: 'topic', label: 'Безопасность' },
  { id: 'topic_health', type: 'topic', label: 'Здоровье мамы' },
];

export const SUBTOPICS: ContentTag[] = [
  // Педиатрия
  { id: 'sub_vaccines', type: 'subtopic', label: 'Вакцинация', parentId: 'topic_pediatrics' },
  { id: 'sub_teeth', type: 'subtopic', label: 'Зубы', parentId: 'topic_pediatrics' },
  { id: 'sub_illness', type: 'subtopic', label: 'ОРВИ и болезни', parentId: 'topic_pediatrics' },
  { id: 'sub_checkups', type: 'subtopic', label: 'Плановые осмотры', parentId: 'topic_pediatrics' },
  // Психология
  { id: 'sub_tantrums', type: 'subtopic', label: 'Истерики', parentId: 'topic_psychology' },
  { id: 'sub_attachment', type: 'subtopic', label: 'Привязанность', parentId: 'topic_psychology' },
  { id: 'sub_anxiety', type: 'subtopic', label: 'Тревожность мамы', parentId: 'topic_psychology' },
  // Питание
  { id: 'sub_first_food', type: 'subtopic', label: 'Первый прикорм', parentId: 'topic_nutrition' },
  { id: 'sub_allergy', type: 'subtopic', label: 'Аллергия', parentId: 'topic_nutrition' },
  { id: 'sub_menu', type: 'subtopic', label: 'Меню по возрасту', parentId: 'topic_nutrition' },
  // Сон
  { id: 'sub_routine', type: 'subtopic', label: 'Режим и ритуалы', parentId: 'topic_sleep' },
  { id: 'sub_night_waking', type: 'subtopic', label: 'Ночные пробуждения', parentId: 'topic_sleep' },
  { id: 'sub_naps', type: 'subtopic', label: 'Дневной сон', parentId: 'topic_sleep' },
  // Развитие
  { id: 'sub_motor', type: 'subtopic', label: 'Моторика', parentId: 'topic_development' },
  { id: 'sub_speech', type: 'subtopic', label: 'Речь', parentId: 'topic_development' },
  { id: 'sub_games', type: 'subtopic', label: 'Игры по возрасту', parentId: 'topic_development' },
  // Безопасность
  { id: 'sub_first_aid', type: 'subtopic', label: 'Первая помощь', parentId: 'topic_safety' },
  { id: 'sub_home_safety', type: 'subtopic', label: 'Безопасный дом', parentId: 'topic_safety' },
  // Здоровье мамы
  { id: 'sub_recovery', type: 'subtopic', label: 'Восстановление', parentId: 'topic_health' },
  { id: 'sub_selfcare', type: 'subtopic', label: 'Самозабота', parentId: 'topic_health' },
];

export const AGE_TAGS: ContentTag[] = [
  { id: 'age_0_3', type: 'age', label: '0–3 мес' },
  { id: 'age_3_6', type: 'age', label: '3–6 мес' },
  { id: 'age_6_12', type: 'age', label: '6–12 мес' },
  { id: 'age_1_2', type: 'age', label: '1–2 года' },
  { id: 'age_2_3', type: 'age', label: '2–3 года' },
  { id: 'age_3_5', type: 'age', label: '3–5 лет' },
  { id: 'age_5_plus', type: 'age', label: '5+ лет' },
];

// ─── Mock Content Library ────────────────────────────────────────────

export const CONTENT_LIBRARY: ContentItem[] = [
  { id: 'c1', title: 'Когда начинать прикорм', description: 'Всё о первом прикорме: сроки, продукты, порядок введения', type: 'video', duration: '18 мин', difficulty: 'beginner', tags: ['topic_nutrition', 'sub_first_food', 'age_6_12'], clubOnly: true, createdAt: '2025-03-01' },
  { id: 'c2', title: 'Аллергия на прикорм: что делать', description: 'Как распознать и действовать при пищевой аллергии', type: 'pdf', fileSize: '1.2 МБ', difficulty: 'beginner', tags: ['topic_nutrition', 'sub_allergy', 'age_6_12'], clubOnly: true, createdAt: '2025-03-05' },
  { id: 'c3', title: 'Ночные пробуждения: гайд', description: 'Пошаговый план для снижения ночных пробуждений', type: 'guide', difficulty: 'intermediate', tags: ['topic_sleep', 'sub_night_waking', 'age_6_12', 'age_1_2'], clubOnly: true, createdAt: '2025-02-20' },
  { id: 'c4', title: 'Ритуал перед сном', description: 'Создаём спокойный ритуал засыпания', type: 'video', duration: '10 мин', difficulty: 'beginner', tags: ['topic_sleep', 'sub_routine', 'age_3_6', 'age_6_12'], clubOnly: true, createdAt: '2025-02-15' },
  { id: 'c5', title: 'Чек-лист: Безопасный дом', description: 'Проверьте дом на безопасность для малыша', type: 'checklist', difficulty: 'beginner', tags: ['topic_safety', 'sub_home_safety', 'age_6_12', 'age_1_2'], clubOnly: true, createdAt: '2025-01-10' },
  { id: 'c6', title: 'Истерики в 2 года: как реагировать', description: 'Научный подход к детским истерикам', type: 'video', duration: '22 мин', difficulty: 'intermediate', tags: ['topic_psychology', 'sub_tantrums', 'age_1_2', 'age_2_3'], clubOnly: true, createdAt: '2025-03-10' },
  { id: 'c7', title: 'Вакцинация: календарь и FAQ', description: 'Полный календарь прививок с ответами на частые вопросы', type: 'pdf', fileSize: '3.4 МБ', difficulty: 'beginner', tags: ['topic_pediatrics', 'sub_vaccines', 'age_0_3', 'age_3_6', 'age_6_12'], clubOnly: true, createdAt: '2025-01-20' },
  { id: 'c8', title: 'Развитие речи 1-2 года', description: 'Норма, задержки и стимуляция речи', type: 'video', duration: '25 мин', difficulty: 'intermediate', tags: ['topic_development', 'sub_speech', 'age_1_2'], clubOnly: true, createdAt: '2025-03-12' },
  { id: 'c9', title: 'Моторика: игры 0-6 мес', description: 'Простые упражнения для физического развития', type: 'guide', difficulty: 'beginner', tags: ['topic_development', 'sub_motor', 'age_0_3', 'age_3_6'], clubOnly: true, createdAt: '2025-02-01' },
  { id: 'c10', title: 'Восстановление после родов', description: 'Физическое и эмоциональное восстановление', type: 'audio', duration: '35 мин', difficulty: 'beginner', tags: ['topic_health', 'sub_recovery'], clubOnly: true, createdAt: '2025-01-15' },
  { id: 'c11', title: 'Меню ребёнка в 1 год', description: 'Примерное меню на неделю с рецептами', type: 'checklist', difficulty: 'beginner', tags: ['topic_nutrition', 'sub_menu', 'age_1_2'], clubOnly: true, createdAt: '2025-03-08' },
  { id: 'c12', title: 'Первая помощь при ожогах', description: 'Алгоритм действий при разных видах ожогов', type: 'video', duration: '14 мин', difficulty: 'intermediate', tags: ['topic_safety', 'sub_first_aid', 'age_6_12', 'age_1_2', 'age_2_3'], clubOnly: true, createdAt: '2025-02-25' },
  { id: 'c13', title: 'Тревожность у мамы: аудиогайд', description: 'Дыхательные практики и техники саморегуляции', type: 'audio', duration: '20 мин', difficulty: 'beginner', tags: ['topic_psychology', 'sub_anxiety', 'topic_health', 'sub_selfcare'], clubOnly: true, createdAt: '2025-03-15' },
  { id: 'c14', title: 'Дневной сон: нормы и переходы', description: 'Когда убирать дневной сон и как перестроить режим', type: 'guide', difficulty: 'intermediate', tags: ['topic_sleep', 'sub_naps', 'age_1_2', 'age_2_3', 'age_3_5'], clubOnly: true, createdAt: '2025-03-18' },
  { id: 'c15', title: 'Привязанность и сепарация', description: 'Теория привязанности: как отпускать в сад', type: 'video', duration: '28 мин', difficulty: 'advanced', tags: ['topic_psychology', 'sub_attachment', 'age_2_3', 'age_3_5'], clubOnly: true, createdAt: '2025-03-20' },
];

// ─── Helpers ─────────────────────────────────────────────────────────

export function getSubtopicsForTopics(topicIds: string[]): ContentTag[] {
  return SUBTOPICS.filter(s => topicIds.includes(s.parentId || ''));
}

export function getAgeTagForMonths(months: number): string | null {
  if (months < 3) return 'age_0_3';
  if (months < 6) return 'age_3_6';
  if (months < 12) return 'age_6_12';
  if (months < 24) return 'age_1_2';
  if (months < 36) return 'age_2_3';
  if (months < 60) return 'age_3_5';
  return 'age_5_plus';
}

export function filterContent(
  items: ContentItem[],
  opts: {
    topics?: string[];
    subtopics?: string[];
    ageTag?: string | null;
    difficulty?: Difficulty;
    limit?: number;
  }
): ContentItem[] {
  let filtered = [...items];

  if (opts.topics?.length) {
    filtered = filtered.filter(i => i.tags.some(t => opts.topics!.includes(t)));
  }
  if (opts.subtopics?.length) {
    filtered = filtered.filter(i => i.tags.some(t => opts.subtopics!.includes(t)));
  }
  if (opts.ageTag) {
    filtered = filtered.filter(i => i.tags.includes(opts.ageTag!));
  }
  if (opts.difficulty) {
    filtered = filtered.filter(i => i.difficulty === opts.difficulty);
  }

  // Sort by newest
  filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  if (opts.limit) {
    filtered = filtered.slice(0, opts.limit);
  }

  return filtered;
}

export const CONTENT_TYPE_LABELS: Record<ContentType, string> = {
  video: 'Видео',
  audio: 'Аудио',
  pdf: 'PDF',
  guide: 'Гайд',
  checklist: 'Чек-лист',
};

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  beginner: 'Начальный',
  intermediate: 'Средний',
  advanced: 'Продвинутый',
};
