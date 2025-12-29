
import { WorkOrderType, TaskType, Performer, WorkOrder, TaskStatus } from './types';

export const INITIAL_ORDER_TYPES: WorkOrderType[] = [
  {
    id: 'type-1',
    name: 'Сервисные инженеры',
    quotas: {
      [TaskType.CONNECTION]: 5,
      [TaskType.TECH_SUPPORT]: 5,
    },
    allowedTaskTypes: [TaskType.CONNECTION, TaskType.TECH_SUPPORT],
    creatorRoles: ['Бригадир', 'Руководитель'],
  },
  {
    id: 'type-2',
    name: 'Монтажники',
    quotas: {
      [TaskType.CONNECTION]: 8,
      [TaskType.TECH_SUPPORT]: 2,
    },
    allowedTaskTypes: [TaskType.CONNECTION],
    creatorRoles: ['Бригадир'],
  }
];

export const MOCK_PERFORMERS: Performer[] = [
  { id: 'p-1', name: 'Иван Иванов', role: 'Сервисный инженер', avatar: 'https://i.pravatar.cc/150?u=ivan' },
  { id: 'p-2', name: 'Петр Петров', role: 'Сервисный инженер', avatar: 'https://i.pravatar.cc/150?u=petr' },
  { id: 'p-3', name: 'Алексей Смирнов', role: 'Монтажник', avatar: 'https://i.pravatar.cc/150?u=alex' },
  { id: 'p-4', name: 'Дмитрий Кузнецов', role: 'Бригадир', avatar: 'https://i.pravatar.cc/150?u=dima' },
];

export const INITIAL_WORK_ORDERS: WorkOrder[] = [
  {
    id: 'wo-1',
    number: 'N-0001',
    date: new Date().toISOString().split('T')[0],
    typeId: 'type-1',
    performerId: 'p-1',
    tasks: [
      { id: 't-1', type: TaskType.CONNECTION, status: TaskStatus.DONE, address: 'ул. Ленина, 10', clientName: 'Иванов А.', description: 'Подключение оптики' },
      { id: 't-2', type: TaskType.CONNECTION, status: TaskStatus.NEW, address: 'ул. Мира, 5', clientName: 'Сергеев В.', description: 'Роутер' },
      { id: 't-3', type: TaskType.TECH_SUPPORT, status: TaskStatus.CANCELLED, address: 'ул. Гагарина, 2', clientName: 'Антонов К.', description: 'Нет линка' },
      { id: 't-4', type: TaskType.TECH_SUPPORT, status: TaskStatus.REPLACED, address: 'ул. Садовая, 15', clientName: 'Петрова М.', description: 'Медленный интернет' },
    ]
  },
  {
    id: 'wo-2',
    number: 'N-0002',
    date: new Date().toISOString().split('T')[0],
    typeId: 'type-1',
    performerId: 'p-2',
    tasks: [
      { id: 't-5', type: TaskType.CONNECTION, status: TaskStatus.NEW, address: 'ул. Красная, 100', clientName: 'Кузнецов Д.', description: 'Подключение' },
    ]
  }
];
