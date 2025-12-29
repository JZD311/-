
import React, { useState } from 'react';
import { WorkOrderType, TaskType } from '../types';
import { Settings2, Plus, Save, Trash2 } from 'lucide-react';

interface AdminViewProps {
  orderTypes: WorkOrderType[];
  setOrderTypes: React.Dispatch<React.SetStateAction<WorkOrderType[]>>;
}

const AdminView: React.FC<AdminViewProps> = ({ orderTypes, setOrderTypes }) => {
  const [editingId, setEditingId] = useState<string | null>(null);

  const addNewType = () => {
    const newType: WorkOrderType = {
      id: `type-${Date.now()}`,
      name: 'Новый шаблон',
      quotas: {
        [TaskType.CONNECTION]: 5,
        [TaskType.TECH_SUPPORT]: 5,
      },
      allowedTaskTypes: [TaskType.CONNECTION, TaskType.TECH_SUPPORT],
      creatorRoles: ['Бригадир'],
    };
    setOrderTypes([...orderTypes, newType]);
    setEditingId(newType.id);
  };

  const deleteType = (id: string) => {
    if (window.confirm('Вы уверены, что хотите удалить этот шаблон?')) {
      setOrderTypes(orderTypes.filter(t => t.id !== id));
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Управление типами нарядов</h2>
          <p className="text-slate-500">Настройка шаблонов квот и ограничений</p>
        </div>
        <button 
          onClick={addNewType}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-2 font-semibold"
        >
          <Plus className="w-5 h-5" />
          Создать шаблон
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {orderTypes.map(type => (
          <div 
            key={type.id} 
            className={`bg-white p-6 rounded-3xl border transition-all ${editingId === type.id ? 'border-blue-500 shadow-xl' : 'border-slate-100 shadow-sm hover:shadow-md'}`}
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-xl">
                  <Settings2 className="w-6 h-6 text-blue-600" />
                </div>
                <input 
                  type="text" 
                  value={type.name}
                  onChange={(e) => {
                    const val = e.target.value;
                    setOrderTypes(prev => prev.map(t => t.id === type.id ? { ...t, name: val } : t));
                  }}
                  className="bg-transparent border-none focus:ring-0 font-bold text-lg text-slate-800 outline-none"
                />
              </div>
              <button 
                onClick={() => deleteType(type.id)}
                className="text-rose-400 hover:text-rose-600 p-2 hover:bg-rose-50 rounded-full transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Квота: Подключения</label>
                <input 
                  type="number" 
                  value={type.quotas[TaskType.CONNECTION]}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    setOrderTypes(prev => prev.map(t => t.id === type.id ? { ...t, quotas: { ...t.quotas, [TaskType.CONNECTION]: val } } : t));
                  }}
                  className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-slate-700 focus:bg-white focus:border-blue-400 outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Квота: Тех. Поддержка</label>
                <input 
                  type="number" 
                  value={type.quotas[TaskType.TECH_SUPPORT]}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    setOrderTypes(prev => prev.map(t => t.id === type.id ? { ...t, quotas: { ...t.quotas, [TaskType.TECH_SUPPORT]: val } } : t));
                  }}
                  className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-slate-700 focus:bg-white focus:border-blue-400 outline-none"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {type.creatorRoles.map(role => (
                  <span key={role} className="bg-slate-100 text-slate-600 text-xs font-semibold px-3 py-1 rounded-full">
                    {role}
                  </span>
                ))}
                <button className="text-blue-500 text-xs font-bold hover:underline">+ Роль</button>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-50 flex justify-end">
               <button 
                 onClick={() => setEditingId(editingId === type.id ? null : type.id)}
                 className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-800"
               >
                 <Save className="w-4 h-4" />
                 Сохранить изменения
               </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminView;
