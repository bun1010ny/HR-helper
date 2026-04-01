import React, { useState, useRef } from 'react';
import Papa from 'papaparse';
import { Upload, Type, Trash2, UserPlus, Sparkles, CopyCheck } from 'lucide-react';
import { Member } from '../types';
import { cn } from '../lib/utils';

interface ListInputProps {
  members: Member[];
  onUpdate: (members: Member[]) => void;
}

export default function ListInput({ members, onUpdate }: ListInputProps) {
  const [textInput, setTextInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddFromText = () => {
    const names = textInput
      .split(/[\n,]+/)
      .map(n => n.trim())
      .filter(n => n.length > 0);
    
    const newMembers = names.map(name => ({
      id: crypto.randomUUID(),
      name
    }));
    
    onUpdate([...members, ...newMembers]);
    setTextInput('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      complete: (results) => {
        const names = results.data
          .flat()
          .map((n: any) => String(n).trim())
          .filter(n => n.length > 0);
        
        const newMembers = names.map(name => ({
          id: crypto.randomUUID(),
          name
        }));
        onUpdate([...members, ...newMembers]);
        if (fileInputRef.current) fileInputRef.current.value = '';
      },
      header: false,
    });
  };

  const loadMockData = () => {
    const mockNames = [
      '陳大文', '林小明', '張美玲', '李志強', '王曉華', 
      '趙敏', '周杰倫', '蔡依林', '林俊傑', '鄧紫棋',
      '陳小春', '應采兒', '古天樂', '劉德華', '張學友'
    ];
    const newMembers = mockNames.map(name => ({
      id: crypto.randomUUID(),
      name
    }));
    onUpdate([...members, ...newMembers]);
  };

  const removeDuplicates = () => {
    const seen = new Set();
    const uniqueMembers = members.filter(member => {
      if (seen.has(member.name)) {
        return false;
      }
      seen.add(member.name);
      return true;
    });
    onUpdate(uniqueMembers);
  };

  const nameCounts = members.reduce((acc, m) => {
    acc[m.name] = (acc[m.name] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const hasDuplicates = Object.values(nameCounts).some(count => count > 1);

  const removeMember = (id: string) => {
    onUpdate(members.filter(m => m.id !== id));
  };

  const clearAll = () => {
    if (confirm('確定要清空所有名單嗎？')) {
      onUpdate([]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 space-y-4">
          <div className="flex items-center gap-2 text-gray-800 font-semibold">
            <Type size={20} className="text-blue-500" />
            <h3>貼上姓名</h3>
          </div>
          <textarea
            className="w-full h-32 p-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            placeholder="請輸入姓名，多個姓名請用換行或逗號分隔..."
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
          />
          <button
            onClick={handleAddFromText}
            disabled={!textInput.trim()}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
          >
            <UserPlus size={18} />
            加入名單
          </button>
        </div>

        <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 space-y-4">
          <div className="flex items-center gap-2 text-gray-800 font-semibold">
            <Upload size={20} className="text-green-500" />
            <h3>上傳 CSV</h3>
          </div>
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-32 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-green-500 hover:bg-green-50 transition-all group"
          >
            <Upload size={32} className="text-gray-400 group-hover:text-green-500 transition-colors" />
            <span className="text-sm text-gray-500">點擊或拖放 CSV 檔案</span>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".csv"
              className="hidden"
            />
          </div>
          <p className="text-xs text-gray-400 text-center">
            支援單欄或多欄 CSV，將自動擷取所有文字內容
          </p>
        </div>

        <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 space-y-4 flex flex-col">
          <div className="flex items-center gap-2 text-gray-800 font-semibold">
            <Sparkles size={20} className="text-purple-500" />
            <h3>快速開始</h3>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
            <p className="text-sm text-gray-500">
              還沒有名單嗎？點擊下方按鈕載入一組模擬名單來體驗功能。
            </p>
            <button
              onClick={loadMockData}
              className="px-6 py-3 bg-purple-50 hover:bg-purple-100 text-purple-600 border border-purple-200 rounded-xl font-bold transition-all flex items-center gap-2 active:scale-95"
            >
              <Sparkles size={18} />
              載入模擬名單
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-bottom border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="flex items-center gap-4">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              目前名單 <span className="text-sm font-normal text-gray-500">({members.length} 人)</span>
            </h3>
            {hasDuplicates && (
              <button
                onClick={removeDuplicates}
                className="px-3 py-1 bg-orange-50 text-orange-600 border border-orange-200 rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-orange-100 transition-colors"
              >
                <CopyCheck size={14} />
                移除重複項
              </button>
            )}
          </div>
          {members.length > 0 && (
            <button
              onClick={clearAll}
              className="text-xs text-red-500 hover:text-red-600 font-medium flex items-center gap-1"
            >
              <Trash2 size={14} />
              清空全部
            </button>
          )}
        </div>
        <div className="max-h-[400px] overflow-y-auto p-4">
          {members.length === 0 ? (
            <div className="py-12 text-center text-gray-400 italic">
              尚未加入任何成員
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {members.map((member) => {
                const isDuplicate = nameCounts[member.name] > 1;
                return (
                  <div
                    key={member.id}
                    className={cn(
                      "group relative px-3 py-2 rounded-lg border flex items-center justify-between transition-all",
                      isDuplicate 
                        ? "bg-orange-50 border-orange-200 hover:bg-orange-100" 
                        : "bg-gray-50 border-gray-100 hover:bg-white hover:shadow-md"
                    )}
                  >
                    <div className="flex flex-col truncate">
                      <span className="text-sm text-gray-700 truncate">{member.name}</span>
                      {isDuplicate && <span className="text-[9px] text-orange-500 font-bold uppercase">重複</span>}
                    </div>
                    <button
                      onClick={() => removeMember(member.id)}
                      className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
