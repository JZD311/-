
import React, { useState } from 'react';
import { WorkOrder, WorkOrderType, Performer, TaskStatus, TaskType, Task } from '../types';
import { 
  X, 
  UserPlus, 
  MapPin, 
  CheckCircle2, 
  RefreshCcw, 
  AlertCircle, 
  PlusCircle,
  Tag
} from 'lucide-react';

interface WorkOrderDetailsProps {
  order: WorkOrder;
  type: WorkOrderType;
  performers: Performer[];
  onClose: () => void;
  onUpdateStatus: (orderId: string, taskId: string, newStatus: TaskStatus) => void;
  onAddTask: (orderId: string, task: Omit<Task, 'id' | 'status'>) => void;
  onAssignPerformer: (orderId: string, performerId: string) => void;
}

const WorkOrderDetails: React.FC<WorkOrderDetailsProps> = ({ 
  order, type, performers, onClose, onUpdateStatus, onAddTask, onAssignPerformer 
}) => {
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskData, setNewTaskData] = useState({
    type: TaskType.CONNECTION,
    address: '',
    clientName: '',
    description: ''
  });

  const handleAddTask = () => {
    if (!newTaskData.address || !newTaskData.clientName) return;
    onAddTask(order.id, newTaskData);
    setShowAddTask(false);
    setNewTaskData({ type: TaskType.CONNECTION, address: '', clientName: '', description: '' });
  };

  const tasksByType = {
    [TaskType.CONNECTION]: order.tasks.filter(t => t.type === TaskType.CONNECTION),
    [TaskType.TECH_SUPPORT]: order.tasks.filter(t => t.type === TaskType.TECH_SUPPORT),
  };

  const getStatusConfig = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.DONE: return { color: 'text-emerald-600', bg: 'bg-emerald-50', icon: CheckCircle2, label: 'Выполнено' };
      case TaskStatus.REPLACED: return { color: 'text-amber-600', bg: 'bg-amber-50', icon: RefreshCcw, label: 'Заменена' };
      case TaskStatus.CANCELLED: return { color: 'text-rose-600', bg: 'bg-rose-50', icon: AlertCircle, label: 'Отменено' };
      case TaskStatus.NEW: return { color: 'text-slate-600', bg: 'bg-slate-50', icon: PlusCircle, label: 'Новая' };
    }
  };

  const totalQuota = type.quotas[TaskType.CONNECTION] + type.quotas[TaskType.TECH_SUPPORT];
  const doneTasksCount = order.tasks.filter(t => t.status === TaskStatus.DONE).length;
  const completionPercent = Math.round((doneTasksCount / totalQuota) * 100);

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Modal Header */}
        <div className="p-8 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded uppercase">{order.number}</span>
              <h2 className="text-2xl font-bold text-slate-800">{type.name}</h2>
            </div>
            <div className="flex items-center gap-6 text-slate-500 text-sm">
              <div className="flex items-center gap-1.5">
                <Tag className="w-4 h-4" />
                <span>Дата: <b>{order.date}</b></span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-slate-400">Выполнение:</span>
                <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                   <div className="h-full bg-blue-600" style={{ width: `${Math.min(100, completionPercent)}%` }} />
                </div>
                <span className="font-bold text-slate-700">{completionPercent}%</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors text-slate-400">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-8 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Left Column: Tasks */}
            <div className="md:col-span-2 space-y-8">
              {[TaskType.CONNECTION, TaskType.TECH_SUPPORT].map(taskType => (
                <div key={taskType} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      {taskType === TaskType.CONNECTION ? 'Подключения' : 'Тех. Поддержка'}
                      <span className="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded-full">
                        {tasksByType[taskType].length} / {type.quotas[taskType]}
                      </span>
                    </h3>
                  </div>
                  
                  <div className="grid gap-3">
                    {tasksByType[taskType].length === 0 && (
                      <p className="text-slate-400 text-sm italic py-4 text-center border-2 border-dashed border-slate-100 rounded-xl">Задач пока нет</p>
                    )}
                    {tasksByType[taskType].map(task => {
                      const config = getStatusConfig(task.status);
                      return (
                        <div key={task.id} className="p-4 rounded-2xl border border-slate-100 hover:border-blue-100 transition-all flex items-center justify-between group">
                          <div className="flex-1">
                            <h4 className="font-bold text-slate-800">{task.clientName}</h4>
                            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                              <MapPin className="w-3 h-3" />
                              <span>{task.address}</span>
                            </div>
                            {task.description && <p className="text-xs text-slate-400 mt-1">{task.description}</p>}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {/* Status Pills */}
                            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold ${config.bg} ${config.color}`}>
                              <config.icon className="w-4 h-4" />
                              <span>{config.label}</span>
                            </div>
                            
                            {/* Actions Dropdown simulation */}
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => onUpdateStatus(order.id, task.id, TaskStatus.DONE)} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded" title="Выполнено"><CheckCircle2 className="w-4 h-4" /></button>
                              <button onClick={() => onUpdateStatus(order.id, task.id, TaskStatus.REPLACED)} className="p-1.5 text-amber-600 hover:bg-amber-50 rounded" title="Замена"><RefreshCcw className="w-4 h-4" /></button>
                              <button onClick={() => onUpdateStatus(order.id, task.id, TaskStatus.CANCELLED)} className="p-1.5 text-rose-600 hover:bg-rose-50 rounded" title="Отмена"><AlertCircle className="w-4 h-4" /></button>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {/* Filling the quota with empty slots for call center */}
                    {Array.from({ length: Math.max(0, type.quotas[taskType] - tasksByType[taskType].length) }).map((_, idx) => (
                      <div 
                        key={`empty-${taskType}-${idx}`} 
                        className="p-4 rounded-2xl border-2 border-dashed border-slate-50 flex items-center justify-center text-slate-300 text-xs font-medium"
                      >
                        Пустой слот квоты
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <button 
                onClick={() => setShowAddTask(true)}
                className="w-full py-4 border-2 border-dashed border-blue-200 rounded-2xl text-blue-500 font-bold hover:bg-blue-50 hover:border-blue-400 transition-all flex items-center justify-center gap-2"
              >
                <PlusCircle className="w-5 h-5" />
                <span>Добавить задачу сверх квоты</span>
              </button>
            </div>

            {/* Right Column: Performer & Actions */}
            <div className="space-y-6">
              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                <h4 className="text-sm font-bold text-slate-500 uppercase mb-4 flex items-center gap-2">
                  <UserPlus className="w-4 h-4" />
                  Исполнитель
                </h4>
                {order.performerId ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <img src={performers.find(p => p.id === order.performerId)?.avatar} className="w-12 h-12 rounded-full ring-2 ring-white shadow-sm" />
                      <div>
                        <p className="font-bold text-slate-800">{performers.find(p => p.id === order.performerId)?.name}</p>
                        <p className="text-xs text-slate-500">{performers.find(p => p.id === order.performerId)?.role}</p>
                      </div>
                    </div>
                    <select 
                      value={order.performerId}
                      onChange={(e) => onAssignPerformer(order.id, e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      {performers.map(p => (
                        <option key={p.id} value={p.id}>{p.name} ({p.role})</option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-xs text-slate-400 italic">Сотрудник не назначен на данный наряд</p>
                    <select 
                      onChange={(e) => onAssignPerformer(order.id, e.target.value)}
                      defaultValue=""
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="" disabled>Выбрать сотрудника...</option>
                      {performers.map(p => (
                        <option key={p.id} value={p.id}>{p.name} ({p.role})</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Quick Summary Card */}
              <div className="p-6 bg-blue-600 rounded-3xl text-white shadow-lg shadow-blue-200">
                 <h4 className="text-[10px] font-bold uppercase tracking-widest text-blue-200 mb-2">Статистика наряда</h4>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-2xl font-bold">{order.tasks.length}</p>
                      <p className="text-[10px] uppercase font-bold text-blue-200">Всего задач</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{doneTasksCount}</p>
                      <p className="text-[10px] uppercase font-bold text-blue-200">Выполнено</p>
                    </div>
                 </div>
                 <div className="mt-6 pt-6 border-t border-blue-500">
                    <p className="text-xs text-blue-100 italic">"Наряд считается полностью укомплектованным при заполнении всех квот."</p>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add Task Modal overlay */}
        {showAddTask && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full space-y-4 shadow-2xl">
              <h3 className="text-xl font-bold text-slate-800">Добавить задачу</h3>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <button 
                    onClick={() => setNewTaskData(prev => ({ ...prev, type: TaskType.CONNECTION }))}
                    className={`flex-1 py-2 rounded-lg text-sm font-bold border ${newTaskData.type === TaskType.CONNECTION ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-500 border-slate-200'}`}
                  >
                    Подключение
                  </button>
                  <button 
                    onClick={() => setNewTaskData(prev => ({ ...prev, type: TaskType.TECH_SUPPORT }))}
                    className={`flex-1 py-2 rounded-lg text-sm font-bold border ${newTaskData.type === TaskType.TECH_SUPPORT ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-500 border-slate-200'}`}
                  >
                    ТП
                  </button>
                </div>
                <input 
                  placeholder="ФИО Клиента" 
                  value={newTaskData.clientName}
                  onChange={e => setNewTaskData(prev => ({ ...prev, clientName: e.target.value }))}
                  className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input 
                  placeholder="Адрес (ул., дом, кв.)" 
                  value={newTaskData.address}
                  onChange={e => setNewTaskData(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                />
                <textarea 
                  placeholder="Описание задачи" 
                  value={newTaskData.description}
                  onChange={e => setNewTaskData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 h-24"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowAddTask(false)} className="flex-1 py-3 text-slate-500 font-bold hover:bg-slate-50 rounded-xl">Отмена</button>
                <button onClick={handleAddTask} className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-100 hover:bg-blue-700">Добавить</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkOrderDetails;
