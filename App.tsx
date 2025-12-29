
import React, { useState, useMemo } from 'react';
import { AppTab, WorkOrder, WorkOrderType, Performer, TaskType, TaskStatus, Task } from './types';
import { INITIAL_ORDER_TYPES, INITIAL_WORK_ORDERS, MOCK_PERFORMERS } from './mockData';
import ScheduleView from './components/ScheduleView';
import AdminView from './components/AdminView';
import StatsView from './components/StatsView';
import { 
  CalendarDays, 
  Settings, 
  BarChart3, 
  Plus, 
  UserCircle2, 
  ClipboardList 
} from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>('schedule');
  const [orderTypes, setOrderTypes] = useState<WorkOrderType[]>(INITIAL_ORDER_TYPES);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(INITIAL_WORK_ORDERS);
  const [performers] = useState<Performer[]>(MOCK_PERFORMERS);

  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Handlers
  const addWorkOrder = (typeId: string, date: string) => {
    const type = orderTypes.find(t => t.id === typeId);
    if (!type) return;

    const newOrder: WorkOrder = {
      id: `wo-${Date.now()}`,
      number: `N-${(workOrders.length + 1).toString().padStart(4, '0')}`,
      date,
      typeId,
      tasks: [] // Starts empty as per requirement 3.1
    };
    setWorkOrders(prev => [...prev, newOrder]);
  };

  const updateTaskStatus = (orderId: string, taskId: string, newStatus: TaskStatus) => {
    setWorkOrders(prev => prev.map(order => {
      if (order.id !== orderId) return order;
      return {
        ...order,
        tasks: order.tasks.map(task => {
          if (task.id !== taskId) return task;
          return { ...task, status: newStatus };
        })
      };
    }));
  };

  const addTaskToOrder = (orderId: string, task: Omit<Task, 'id' | 'status'>) => {
    const newTask: Task = {
      ...task,
      id: `t-${Date.now()}`,
      status: TaskStatus.NEW
    };
    setWorkOrders(prev => prev.map(order => {
      if (order.id !== orderId) return order;
      return { ...order, tasks: [...order.tasks, newTask] };
    }));
  };

  const assignPerformer = (orderId: string, performerId: string) => {
    setWorkOrders(prev => prev.map(order => {
      if (order.id !== orderId) return order;
      return { ...order, performerId };
    }));
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <ClipboardList className="w-6 h-6 text-white" />
          </div>
          <h1 className="font-bold text-slate-800 text-xl tracking-tight">Felix OMS</h1>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <button
            onClick={() => setActiveTab('schedule')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === 'schedule' 
              ? 'bg-blue-50 text-blue-700 font-semibold' 
              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
            }`}
          >
            <CalendarDays className="w-5 h-5" />
            <span>Наряды</span>
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === 'admin' 
              ? 'bg-blue-50 text-blue-700 font-semibold' 
              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span>Настройки</span>
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === 'stats' 
              ? 'bg-blue-50 text-blue-700 font-semibold' 
              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            <span>Отчеты</span>
          </button>
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
            <UserCircle2 className="w-10 h-10 text-slate-400" />
            <div className="flex flex-col">
              <span className="text-sm font-medium text-slate-700 truncate">Бригадир О.</span>
              <span className="text-xs text-slate-500">Администратор</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative">
        <div className="max-w-6xl mx-auto p-8">
          {activeTab === 'schedule' && (
            <ScheduleView 
              workOrders={workOrders} 
              orderTypes={orderTypes}
              performers={performers}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              onAddOrder={addWorkOrder}
              onUpdateStatus={updateTaskStatus}
              onAddTask={addTaskToOrder}
              onAssignPerformer={assignPerformer}
            />
          )}
          {activeTab === 'admin' && (
            <AdminView 
              orderTypes={orderTypes}
              setOrderTypes={setOrderTypes}
            />
          )}
          {activeTab === 'stats' && (
            <StatsView 
              workOrders={workOrders}
              orderTypes={orderTypes}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
