
import React, { useMemo } from 'react';
import { WorkOrder, WorkOrderType, TaskStatus, TaskType } from '../types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from 'recharts';

interface StatsViewProps {
  workOrders: WorkOrder[];
  orderTypes: WorkOrderType[];
}

const StatsView: React.FC<StatsViewProps> = ({ workOrders, orderTypes }) => {
  const stats = useMemo(() => {
    // Group orders by date and calculate average completion
    const dateGroups: Record<string, { total: number, count: number }> = {};
    
    workOrders.forEach(wo => {
      const type = orderTypes.find(t => t.id === wo.typeId);
      if (!type) return;
      
      const totalQuota = type.quotas[TaskType.CONNECTION] + type.quotas[TaskType.TECH_SUPPORT];
      const doneCount = wo.tasks.filter(t => t.status === TaskStatus.DONE).length;
      const completion = (doneCount / totalQuota) * 100;

      if (!dateGroups[wo.date]) {
        dateGroups[wo.date] = { total: completion, count: 1 };
      } else {
        dateGroups[wo.date].total += completion;
        dateGroups[wo.date].count += 1;
      }
    });

    return Object.entries(dateGroups).map(([date, data]) => ({
      date,
      avgCompletion: Math.round(data.total / data.count)
    })).sort((a, b) => a.date.localeCompare(b.date));
  }, [workOrders, orderTypes]);

  const taskStatusDistribution = useMemo(() => {
    const counts = {
      [TaskStatus.DONE]: 0,
      [TaskStatus.NEW]: 0,
      [TaskStatus.CANCELLED]: 0,
      [TaskStatus.REPLACED]: 0,
    };
    workOrders.forEach(wo => {
      wo.tasks.forEach(task => {
        counts[task.status]++;
      });
    });
    return [
      { name: 'Выполнено', value: counts[TaskStatus.DONE], color: '#10b981' },
      { name: 'В работе', value: counts[TaskStatus.NEW], color: '#94a3b8' },
      { name: 'Отменено', value: counts[TaskStatus.CANCELLED], color: '#f43f5e' },
      { name: 'Замена', value: counts[TaskStatus.REPLACED], color: '#fbbf24' },
    ];
  }, [workOrders]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Аналитика и отчеты</h2>
        <p className="text-slate-500">Средние показатели эффективности за период</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Completion over time */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Средний % выполнения по датам</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="avgCompletion" radius={[6, 6, 0, 0]}>
                  {stats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.avgCompletion >= 90 ? '#10b981' : '#3b82f6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Распределение статусов задач</h3>
          <div className="h-72 w-full flex items-center gap-8">
            <div className="flex-1 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={taskStatusDistribution}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {taskStatusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-4">
              {taskStatusDistribution.map(item => (
                <div key={item.name} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm font-medium text-slate-600">{item.name}</span>
                  <span className="text-sm font-bold text-slate-800">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-600 p-8 rounded-3xl text-white shadow-xl shadow-blue-100 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
           <h4 className="text-2xl font-bold">Итоговая эффективность</h4>
           <p className="text-blue-100">За все время средний показатель составляет 84.5% выполнения</p>
        </div>
        <button className="bg-white text-blue-600 px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors">
          Выгрузить полный отчет (.XLS)
        </button>
      </div>
    </div>
  );
};

export default StatsView;
