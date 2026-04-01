import { useState } from 'react';
import { Users, LayoutGrid, Shuffle, ArrowRight, Download } from 'lucide-react';
import { Member } from '../types';
import { motion } from 'motion/react';
import Papa from 'papaparse';

interface AutoGroupProps {
  members: Member[];
}

export default function AutoGroup({ members }: AutoGroupProps) {
  const [groupSize, setGroupSize] = useState(4);
  const [groups, setGroups] = useState<Member[][]>([]);

  const handleGroup = () => {
    if (members.length === 0) return;
    
    const shuffled = [...members].sort(() => Math.random() - 0.5);
    const result: Member[][] = [];
    
    for (let i = 0; i < shuffled.length; i += groupSize) {
      result.push(shuffled.slice(i, i + groupSize));
    }
    
    setGroups(result);
  };

  const downloadCSV = () => {
    if (groups.length === 0) return;

    const csvData = groups.flatMap((group, idx) => 
      group.map(member => ({
        '組別': `第 ${idx + 1} 組`,
        '姓名': member.name
      }))
    );

    const csv = Papa.unparse(csvData);
    const blob = new Blob(["\ufeff" + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `分組結果_${new Date().toLocaleDateString()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (members.length === 0) {
    return (
      <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-gray-200">
        <Users size={48} className="mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500">請先在名單管理中加入成員</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">每組人數</label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="2"
                max="20"
                value={groupSize}
                onChange={(e) => setGroupSize(parseInt(e.target.value))}
                className="w-32 h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <span className="text-2xl font-black text-gray-900 w-8">{groupSize}</span>
            </div>
          </div>
          
          <div className="h-10 w-px bg-gray-100 hidden md:block" />
          
          <div className="space-y-1">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">預計組數</p>
            <p className="text-xl font-bold text-gray-800">
              {Math.ceil(members.length / groupSize)} <span className="text-sm font-normal text-gray-400">組</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {groups.length > 0 && (
            <button
              onClick={downloadCSV}
              className="px-6 py-3 bg-white border border-gray-200 hover:border-blue-500 hover:text-blue-600 text-gray-600 rounded-2xl font-bold transition-all flex items-center gap-2 active:scale-95"
            >
              <Download size={20} />
              下載結果
            </button>
          )}
          <button
            onClick={handleGroup}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-blue-100 flex items-center gap-2 active:scale-95"
          >
            <Shuffle size={20} />
            立即隨機分組
          </button>
        </div>
      </div>

      {groups.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {groups.map((group, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              key={idx}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-xl hover:shadow-gray-100 transition-all"
            >
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Group {idx + 1}</span>
                <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{group.length} 人</span>
              </div>
              <div className="p-4 space-y-2">
                {group.map((m, mIdx) => (
                  <div key={m.id} className="flex items-center gap-3 text-gray-700">
                    <span className="text-[10px] font-mono text-gray-300">{String(mIdx + 1).padStart(2, '0')}</span>
                    <span className="font-medium">{m.name}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {groups.length === 0 && (
        <div className="py-32 text-center text-gray-300 italic">
          <LayoutGrid size={48} className="mx-auto mb-4 opacity-20" />
          <p>設定人數後點擊按鈕開始分組</p>
        </div>
      )}
    </div>
  );
}
