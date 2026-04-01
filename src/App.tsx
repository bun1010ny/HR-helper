import { useState } from 'react';
import { Users, Trophy, LayoutGrid, Settings, Github } from 'lucide-react';
import { Member, View } from './types';
import ListInput from './components/ListInput';
import LuckyDraw from './components/LuckyDraw';
import AutoGroup from './components/AutoGroup';
import { cn } from './lib/utils';

export default function App() {
  const [view, setView] = useState<View>('list');
  const [members, setMembers] = useState<Member[]>([]);

  const navItems = [
    { id: 'list', label: '名單管理', icon: Users, color: 'text-blue-500' },
    { id: 'draw', label: '獎品抽籤', icon: Trophy, color: 'text-yellow-500' },
    { id: 'group', label: '自動分組', icon: LayoutGrid, color: 'text-green-500' },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-gray-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center shadow-lg shadow-gray-200">
              <Settings className="text-white animate-spin-slow" size={24} />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight text-gray-900 uppercase">HR Event Toolkit</h1>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Professional Utility</p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setView(item.id as View)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2",
                  view === item.id 
                    ? "bg-white text-gray-900 shadow-sm" 
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-200"
                )}
              >
                <item.icon size={16} className={cn(view === item.id ? item.color : "text-gray-400")} />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-xs font-bold text-gray-900">Admin Panel</span>
              <span className="text-[10px] text-green-500 font-bold uppercase">System Online</span>
            </div>
            <div className="w-8 h-8 bg-gray-200 rounded-full overflow-hidden border-2 border-white shadow-sm">
              <img 
                src="https://picsum.photos/seed/hr/100/100" 
                alt="Avatar" 
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mobile Nav */}
        <div className="md:hidden flex gap-2 mb-8 overflow-x-auto pb-2 custom-scrollbar">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id as View)}
              className={cn(
                "flex-none px-6 py-3 rounded-2xl text-sm font-bold transition-all flex items-center gap-2 border",
                view === item.id 
                  ? "bg-white border-gray-200 text-gray-900 shadow-xl shadow-gray-100" 
                  : "bg-transparent border-transparent text-gray-400"
              )}
            >
              <item.icon size={18} className={cn(view === item.id ? item.color : "text-gray-300")} />
              {item.label}
            </button>
          ))}
        </div>

        {/* View Content */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          {view === 'list' && <ListInput members={members} onUpdate={setMembers} />}
          {view === 'draw' && <LuckyDraw members={members} />}
          {view === 'group' && <AutoGroup members={members} />}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto py-12 border-t border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-4">
          <div className="flex justify-center gap-6 text-gray-400">
            <span className="text-xs font-bold uppercase tracking-widest">Efficiency</span>
            <span className="text-xs font-bold uppercase tracking-widest">Transparency</span>
            <span className="text-xs font-bold uppercase tracking-widest">Fun</span>
          </div>
          <p className="text-xs text-gray-300">© 2026 HR Event Toolkit. Designed for high-performance teams.</p>
        </div>
      </footer>
    </div>
  );
}
