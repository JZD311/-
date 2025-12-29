
import React, { useState } from 'react';
import { WorkOrder, WorkOrderType, Performer, TaskStatus, TaskType, Task } from '../types';
import WorkOrderCard from './WorkOrderCard';
import WorkOrderDetails from './WorkOrderDetails';
// Added ClipboardList to the import list
import { Plus, Filter, SortAsc, MapPin, Search, ClipboardList } from 'lucide-react';
import LogisticAssistant from './LogisticAssistant';

interface ScheduleViewProps {
  workOrders: WorkOrder[];
  orderTypes: WorkOrderType[];
  performers: Performer[];
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  onAddOrder: (typeId: string, date: string) => void;
  onUpdateStatus: (orderId: string, taskId: string, newStatus: TaskStatus) => void;
  onAddTask: (orderId: string, task: Omit<Task, 'id' | 'status'>) => void;
  onAssignPerformer: (orderId: string, performerId: string) => void;
}

const ScheduleView: React.FC<ScheduleViewProps> = ({ 
  workOrders, orderTypes, performers, selectedDate, setSelectedDate, 
  onAddOrder, onUpdateStatus, onAddTask, onAssignPerformer 
}) => {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'number' | 'completion'>('number');
  const [showLogisticAssistant, setShowLogisticAssistant] = useState(false);

  const filteredOrders = workOrders
    .filter(wo => wo.date === selectedDate)
    .filter(wo => filterType === 'all' || wo.typeId === filterType)
    .sort((a, b) => {
      if (sortBy === 'number') return a.number.localeCompare(b.number);
      // Simple completion sort logic
      return 0; 
    });

  const selectedOrder = workOrders.find(wo => wo.id === selectedOrderId);

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Наряды на работы</h2>
          <p className="text-slate-500">Управление и распределение задач на день</p>
        </div>

        <div className="flex items-center gap-3">
          <input 
            type="date" 
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Добавить наряд</span>
          </button>
        </div>
      </div>

      {/* Tool Bar */}
      <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-2 text-slate-500 border-r pr-4 border-slate-100">
          <Filter className="w-4 h-4" />
          <span className="text-sm font-medium">Фильтр:</span>
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="text-sm bg-transparent font-semibold text-slate-700 focus:outline-none"
          >
            <option value="all">Все типы</option>
            {orderTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>

        <div className="flex items-center gap-2 text-slate-500 border-r pr-4 border-slate-100">
          <SortAsc className="w-4 h-4" />
          <span className="text-sm font-medium">Сортировка:</span>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-sm bg-transparent font-semibold text-slate-700 focus:outline-none"
          >
            <option value="number">По номеру</option>
            <option value="completion">По выполнению</option>
          </select>
        </div>

        <button 
          onClick={() => setShowLogisticAssistant(!showLogisticAssistant)}
          className="flex items-center gap-2 text-blue-600 text-sm font-semibold hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
        >
          <MapPin className="w-4 h-4" />
          <span>Логистика (ИИ)</span>
        </button>
      </div>

      {showLogisticAssistant && (
        <LogisticAssistant workOrders={filteredOrders} />
      )}

      {/* Grid of Work Orders */}
      <div className="grid grid-cols-1 gap-4">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
            {/* ClipboardList is now correctly imported and resolved here */}
            <ClipboardList className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-700">Нарядов нет</h3>
            <p className="text-slate-500">Создайте первый наряд на выбранную дату</p>
          </div>
        ) : (
          filteredOrders.map(order => (
            <WorkOrderCard 
              key={order.id} 
              order={order} 
              type={orderTypes.find(t => t.id === order.typeId)!}
              performer={performers.find(p => p.id === order.performerId)}
              onClick={() => setSelectedOrderId(order.id)}
            />
          ))
        )}
      </div>

      {/* Details Modal */}
      {selectedOrder && (
        <WorkOrderDetails 
          order={selectedOrder}
          type={orderTypes.find(t => t.id === selectedOrder.typeId)!}
          performers={performers}
          onClose={() => setSelectedOrderId(null)}
          onUpdateStatus={onUpdateStatus}
          onAddTask={onAddTask}
          onAssignPerformer={onAssignPerformer}
        />
      )}

      {/* Add Order Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-800">Новый наряд</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">×</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Тип наряда</label>
                <div className="grid grid-cols-1 gap-2">
                  {orderTypes.map(t => (
                    <button
                      key={t.id}
                      onClick={() => {
                        onAddOrder(t.id, selectedDate);
                        setShowAddModal(false);
                      }}
                      className="w-full text-left p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all group"
                    >
                      <span className="block font-semibold text-slate-800 group-hover:text-blue-700">{t.name}</span>
                      <span className="block text-xs text-slate-500">Квота: {t.quotas[TaskType.CONNECTION]} Подк. + {t.quotas[TaskType.TECH_SUPPORT]} ТП</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleView;
