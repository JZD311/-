
import React from 'react';
import { WorkOrder, WorkOrderType, Performer, TaskStatus, TaskType } from '../types';
import { User, ChevronRight } from 'lucide-react';

interface WorkOrderCardProps {
  order: WorkOrder;
  type: WorkOrderType;
  performer?: Performer;
  onClick: () => void;
}

const WorkOrderCard: React.FC<WorkOrderCardProps> = ({ order, type, performer, onClick }) => {
  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.DONE: return 'bg-emerald-500';
      case TaskStatus.REPLACED: return 'bg-amber-400';
      case TaskStatus.CANCELLED: return 'bg-rose-500';
      case TaskStatus.NEW: return 'bg-slate-200';
      default: return 'bg-slate-200';
    }
  };

  // Logic: Completion = (Count(Done)) / (Total Quota)
  const totalQuota = type.quotas[TaskType.CONNECTION] + type.quotas[TaskType.TECH_SUPPORT];
  const doneTasksCount = order.tasks.filter(t => t.status === TaskStatus.DONE).length;
  const completionPercent = Math.round((doneTasksCount / totalQuota) * 100);

  return (
    <div 
      onClick={onClick}
      className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group flex items-center justify-between gap-4"
    >
      <div className="flex-1 min-w-0 flex items-center gap-6">
        {/* Number & Type */}
        <div className="w-32">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">{order.number}</span>
          <h4 className="text-slate-800 font-bold truncate">{type.name}</h4>
        </div>

        {/* Task Visualizers */}
        <div className="flex flex-wrap items-center gap-1.5 min-w-[120px]">
          {order.tasks.map((task, idx) => (
            <div 
              key={task.id} 
              className={`w-3 h-3 rounded-full ${getStatusColor(task.status)}`}
              title={`${task.type}: ${task.status}`}
            />
          ))}
          {/* Fill the rest with placeholders for the quota */}
          {Array.from({ length: Math.max(0, totalQuota - order.tasks.length) }).map((_, idx) => (
            <div key={`empty-${idx}`} className="w-3 h-3 rounded-full border-2 border-slate-100 bg-white" title="Свободно" />
          ))}
        </div>

        {/* Completion Bar */}
        <div className="hidden lg:flex flex-col gap-1 w-40">
           <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase">
             <span>Прогресс</span>
             <span>{completionPercent}%</span>
           </div>
           <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
             <div 
               className={`h-full transition-all duration-500 ${completionPercent >= 100 ? 'bg-emerald-500' : 'bg-blue-500'}`} 
               style={{ width: `${Math.min(100, completionPercent)}%` }} 
             />
           </div>
        </div>

        {/* Performer */}
        <div className="hidden md:flex items-center gap-2 px-4 border-l border-slate-100">
          {performer ? (
            <>
              <img src={performer.avatar} alt={performer.name} className="w-8 h-8 rounded-full border border-slate-200" />
              <div className="text-xs">
                <p className="font-semibold text-slate-700">{performer.name}</p>
                <p className="text-slate-400">{performer.role}</p>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2 text-slate-400 italic text-xs">
              <User className="w-4 h-4" />
              <span>Не назначен</span>
            </div>
          )}
        </div>
      </div>

      <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-400 transition-colors" />
    </div>
  );
};

export default WorkOrderCard;
