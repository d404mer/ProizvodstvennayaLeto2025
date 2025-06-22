export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  subTasks: SubTask[];
}

export type TaskHistoryRecord = {
  id: string; // уникальный id записи
  action: 'created' | 'edited' | 'deleted';
  date: string; // ISO-строка
  taskId: string;
  before?: Task; // состояние до (для edit/delete)
  after?: Task;  // состояние после (для create/edit)
};

/**
 * Рассчитывает необходимую длину провода для соединителя
 * @param contactsCount Количество контактов в соединителе
 * @param lengthPerContact Длина провода на один контакт (мм)
 * @param reservePercent Процент запаса (например, 10 для 10%)
 * @returns Общая длина провода (мм)
 */
export function calculateWireLengthForConnector(
  contactsCount: number,
  lengthPerContact: number,
  reservePercent: number = 10
): number {
  const base = contactsCount * lengthPerContact;
  return Math.ceil(base * (1 + reservePercent / 100));
}

/**
 * Рассчитывает средний процент выполнения всех задач (по подзадачам)
 * @param tasks Массив задач
 * @returns Средний процент выполнения (0-100)
 */
export function calculateAverageProgress(tasks: Task[]): number {
  if (tasks.length === 0) return 0;
  let total = 0;
  tasks.forEach(task => {
    const totalSubs = task.subTasks.length;
    if (totalSubs === 0) return;
    const completed = task.subTasks.filter(s => s.completed).length;
    total += completed / totalSubs;
  });
  return Math.round((total / tasks.length) * 100);
} 