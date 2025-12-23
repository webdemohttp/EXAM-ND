
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  CalendarDays, 
  Timer, 
  BookOpen, 
  Plus, 
  Trash2, 
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight
} from 'lucide-react';
import { Page, Exam, Task, DailySchedule } from './types';
import { generateStudyPlan, getQuickTip } from './geminiService';

const COLORS = [
  'bg-blue-500', 'bg-purple-500', 'bg-emerald-500', 
  'bg-amber-500', 'bg-rose-500', 'bg-indigo-500'
];

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>(Page.DASHBOARD);
  const [exams, setExams] = useState<Exam[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [aiPlan, setAiPlan] = useState<DailySchedule[] | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [tip, setTip] = useState<string>('Yükleniyor...');

  useEffect(() => {
    const savedExams = localStorage.getItem('exams');
    const savedTasks = localStorage.getItem('tasks');
    if (savedExams) setExams(JSON.parse(savedExams));
    if (savedTasks) setTasks(JSON.parse(savedTasks));
    
    getQuickTip().then(setTip);
  }, []);

  useEffect(() => {
    localStorage.setItem('exams', JSON.stringify(exams));
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [exams, tasks]);

  const addExam = (exam: Omit<Exam, 'id' | 'color'>) => {
    const newExam: Exam = {
      ...exam,
      id: crypto.randomUUID(),
      color: COLORS[exams.length % COLORS.length]
    };
    setExams([...exams, newExam]);
  };

  const deleteExam = (id: string) => {
    setExams(exams.filter(e => e.id !== id));
    setTasks(tasks.filter(t => t.examId !== id));
  };

  const handleGeneratePlan = async () => {
    if (exams.length === 0) return alert('Lütfen önce sınav ekleyin!');
    setIsGenerating(true);
    const plan = await generateStudyPlan(exams);
    if (plan) setAiPlan(plan);
    setIsGenerating(false);
    setActivePage(Page.PLANNER);
  };

  const toggleTask = (taskId: string) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t));
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col fixed h-full z-10">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Sparkles className="text-white w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800">ExaMind</h1>
          </div>
          <p className="text-xs text-slate-500 font-medium">Akıllı Çalışma Planlayıcı</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <NavItem 
            icon={<LayoutDashboard size={20} />} 
            label="Genel Bakış" 
            active={activePage === Page.DASHBOARD} 
            onClick={() => setActivePage(Page.DASHBOARD)} 
          />
          <NavItem 
            icon={<CalendarDays size={20} />} 
            label="Sınav Takvimi" 
            active={activePage === Page.EXAMS} 
            onClick={() => setActivePage(Page.EXAMS)} 
          />
          <NavItem 
            icon={<BookOpen size={20} />} 
            label="Yapay Zeka Planı" 
            active={activePage === Page.PLANNER} 
            onClick={() => setActivePage(Page.PLANNER)} 
          />
          <NavItem 
            icon={<Timer size={20} />} 
            label="Odak Modu" 
            active={activePage === Page.TIMER} 
            onClick={() => setActivePage(Page.TIMER)} 
          />
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
            <div className="flex items-center gap-2 mb-2 text-indigo-700">
              <Sparkles size={16} />
              <span className="text-xs font-bold uppercase tracking-wider">Günün İpucu</span>
            </div>
            <p className="text-xs text-indigo-900 leading-relaxed italic">
              "{tip}"
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-slate-800">
              {activePage === Page.DASHBOARD && 'Merhaba, Çalışmaya Hazır mısın?'}
              {activePage === Page.EXAMS && 'Sınavlarını Yönet'}
              {activePage === Page.PLANNER && 'AI Destekli Programın'}
              {activePage === Page.TIMER && 'Pomodoro & Odaklanma'}
            </h2>
            <p className="text-slate-500 mt-1">
              {activePage === Page.DASHBOARD && 'İşte bugünün özeti ve yaklaşan sınavların.'}
              {activePage === Page.EXAMS && 'Sınav tarihlerini ve zorluk seviyelerini buradan belirle.'}
              {activePage === Page.PLANNER && 'Gemini tarafından oluşturulan kişiselleştirilmiş programın.'}
              {activePage === Page.TIMER && '25 dakika çalış, 5 dakika dinlen. Verimliliğini artır.'}
            </p>
          </div>
          {exams.length > 0 && activePage !== Page.PLANNER && (
            <button 
              onClick={handleGeneratePlan}
              disabled={isGenerating}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-lg shadow-indigo-100 active:scale-95 disabled:opacity-50"
            >
              {isGenerating ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white" /> : <Sparkles size={18} />}
              AI Planı Oluştur
            </button>
          )}
        </header>

        <div className="animate-in fade-in duration-500">
          {activePage === Page.DASHBOARD && <DashboardView exams={exams} tasks={tasks} toggleTask={toggleTask} onNavigate={setActivePage} />}
          {activePage === Page.EXAMS && <ExamsView exams={exams} onAdd={addExam} onDelete={deleteExam} />}
          {activePage === Page.PLANNER && <PlannerView plan={aiPlan} isGenerating={isGenerating} onGenerate={handleGeneratePlan} />}
          {activePage === Page.TIMER && <TimerView />}
        </div>
      </main>
    </div>
  );
};

// --- Subcomponents ---

const NavItem: React.FC<{ icon: React.ReactNode, label: string, active: boolean, onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
      active 
        ? 'bg-indigo-50 text-indigo-600' 
        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

const DashboardView: React.FC<{ exams: Exam[], tasks: Task[], toggleTask: (id: string) => void, onNavigate: (p: Page) => void }> = ({ exams, tasks, toggleTask, onNavigate }) => {
  const sortedExams = [...exams].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(0, 3);
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <section>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-slate-800">Yaklaşan Sınavlar</h3>
            <button onClick={() => onNavigate(Page.EXAMS)} className="text-indigo-600 text-sm font-semibold hover:underline">Tümünü Gör</button>
          </div>
          {exams.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center">
              <p className="text-slate-400 mb-4">Henüz sınav eklemedin.</p>
              <button onClick={() => onNavigate(Page.EXAMS)} className="text-indigo-600 font-bold border border-indigo-200 px-4 py-2 rounded-lg hover:bg-indigo-50">Sınav Ekle</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sortedExams.map(exam => (
                <div key={exam.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
                  <div className={`${exam.color} w-2 h-10 rounded-full absolute -ml-5`}></div>
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-bold text-slate-800 text-lg">{exam.subject}</h4>
                    <span className={`text-[10px] uppercase font-black px-2 py-0.5 rounded-full ${
                      exam.difficulty === 'Zor' ? 'bg-rose-100 text-rose-600' :
                      exam.difficulty === 'Orta' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'
                    }`}>
                      {exam.difficulty}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <CalendarDays size={14} />
                      {new Date(exam.date).toLocaleDateString('tr-TR')}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock size={14} />
                      {exam.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <h3 className="text-lg font-bold text-slate-800 mb-4">Görevler</h3>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-2">
            {tasks.length === 0 ? (
              <p className="p-8 text-center text-slate-400">Yapılacak görev yok.</p>
            ) : (
              tasks.map(task => (
                <div key={task.id} className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer group" onClick={() => toggleTask(task.id)}>
                  <div className={`p-1 rounded-full border-2 transition-colors ${task.completed ? 'bg-indigo-500 border-indigo-500' : 'border-slate-200'}`}>
                    <CheckCircle2 size={16} className={task.completed ? 'text-white' : 'text-transparent'} />
                  </div>
                  <span className={`flex-1 font-medium transition-all ${task.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                    {task.title}
                  </span>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      <div className="space-y-8">
        <section className="bg-indigo-600 rounded-3xl p-6 text-white relative overflow-hidden shadow-xl shadow-indigo-100">
          <Sparkles className="absolute -right-4 -top-4 w-24 h-24 text-white/10 rotate-12" />
          <h3 className="text-xl font-bold mb-4 relative z-10">AI Koçun Diyor ki:</h3>
          <p className="text-indigo-100 leading-relaxed relative z-10 mb-6 italic">
            "Sınav haftası bir maratondur, sürat koşusu değil. Düzenli molalar vererek zihnini taze tut."
          </p>
          <button 
            onClick={() => onNavigate(Page.PLANNER)}
            className="w-full bg-white text-indigo-600 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-50 transition-colors"
          >
            Programımı Görüntüle <ArrowRight size={18} />
          </button>
        </section>

        <section className="bg-white rounded-2xl border border-slate-100 p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Verimlilik İstatistiği</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-bold mb-1 text-slate-500 uppercase tracking-widest">
                <span>Tamamlanan Görevler</span>
                <span>{tasks.length > 0 ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) : 0}%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-500 rounded-full transition-all duration-1000" 
                  style={{ width: `${tasks.length > 0 ? (tasks.filter(t => t.completed).length / tasks.length) * 100 : 0}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-bold mb-1 text-slate-500 uppercase tracking-widest">
                <span>Kalan Günler</span>
                <span>7 Gün</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full w-[30%]" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

const ExamsView: React.FC<{ exams: Exam[], onAdd: (e: Omit<Exam, 'id' | 'color'>) => void, onDelete: (id: string) => void }> = ({ exams, onAdd, onDelete }) => {
  const [formData, setFormData] = useState({ subject: '', date: '', time: '', difficulty: 'Orta' as 'Kolay' | 'Orta' | 'Zor' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subject || !formData.date) return;
    onAdd(formData);
    setFormData({ subject: '', date: '', time: '', difficulty: 'Orta' });
  };

  return (
    <div className="max-w-4xl space-y-8">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div className="md:col-span-1">
          <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Ders Adı</label>
          <input 
            type="text" 
            required 
            placeholder="Matematik, Fizik..."
            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            value={formData.subject}
            onChange={e => setFormData({ ...formData, subject: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Tarih</label>
          <input 
            type="date" 
            required
            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            value={formData.date}
            onChange={e => setFormData({ ...formData, date: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Zorluk</label>
          <select 
            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none bg-white"
            value={formData.difficulty}
            onChange={e => setFormData({ ...formData, difficulty: e.target.value as any })}
          >
            <option value="Kolay">Kolay</option>
            <option value="Orta">Orta</option>
            <option value="Zor">Zor</option>
          </select>
        </div>
        <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-xl transition-all flex items-center justify-center gap-2">
          <Plus size={18} /> Ekle
        </button>
      </form>

      <div className="grid grid-cols-1 gap-4">
        {exams.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
            <CalendarDays className="mx-auto text-slate-200 mb-4" size={48} />
            <p className="text-slate-400">Henüz bir sınav takvimi oluşturmadın.</p>
          </div>
        ) : (
          exams.map(exam => (
            <div key={exam.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className={`${exam.color} w-10 h-10 rounded-xl flex items-center justify-center text-white`}>
                  <BookOpen size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">{exam.subject}</h4>
                  <div className="flex gap-3 text-xs text-slate-500 mt-1">
                    <span>{new Date(exam.date).toLocaleDateString('tr-TR')}</span>
                    <span className="font-bold text-slate-300">•</span>
                    <span className={
                      exam.difficulty === 'Zor' ? 'text-rose-500 font-bold' :
                      exam.difficulty === 'Orta' ? 'text-amber-500 font-bold' : 'text-emerald-500 font-bold'
                    }>{exam.difficulty}</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => onDelete(exam.id)}
                className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const PlannerView: React.FC<{ plan: DailySchedule[] | null, isGenerating: boolean, onGenerate: () => void }> = ({ plan, isGenerating, onGenerate }) => {
  if (isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-6">
        <div className="relative">
          <div className="w-24 h-24 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
          <Sparkles className="absolute inset-0 m-auto text-indigo-400" />
        </div>
        <div className="text-center">
          <h3 className="text-xl font-bold text-slate-800">Gemini Senin İçin Düşünüyor...</h3>
          <p className="text-slate-500 mt-2">Mükemmel çalışma planın hazırlanıyor, lütfen bekle.</p>
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="text-center py-20">
        <div className="bg-indigo-50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <Sparkles className="text-indigo-600" size={32} />
        </div>
        <h3 className="text-2xl font-bold text-slate-800">Kişiselleştirilmiş Programın</h3>
        <p className="text-slate-500 mt-2 mb-8 max-w-md mx-auto">
          Yapay zeka, sınavlarını analiz ederek senin için en uygun çalışma saatlerini ve konuları belirlesin.
        </p>
        <button 
          onClick={onGenerate}
          className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:scale-105 transition-transform"
        >
          Planı Hemen Oluştur
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plan.map((day, idx) => (
          <div key={idx} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-100">
              <h4 className="font-bold text-slate-800 flex items-center gap-2">
                <CalendarDays size={18} className="text-indigo-500" />
                {day.day}
              </h4>
            </div>
            <div className="p-4 space-y-4 flex-1">
              {day.sessions.map((session, sIdx) => (
                <div key={sIdx} className="p-3 bg-indigo-50/50 rounded-2xl border border-indigo-100/50">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-black uppercase text-indigo-600 tracking-wider flex items-center gap-1">
                      <Clock size={10} /> {session.time}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">{session.duration}</span>
                  </div>
                  <h5 className="font-bold text-slate-800 text-sm leading-tight mb-1">{session.subject}</h5>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{session.topic}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const TimerView: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'work' | 'break'>('work');

  useEffect(() => {
    let interval: any;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0) {
      const nextMode = mode === 'work' ? 'break' : 'work';
      setMode(nextMode);
      setTimeLeft(nextMode === 'work' ? 25 * 60 : 5 * 60);
      setIsActive(false);
      alert(nextMode === 'break' ? 'Çalışma bitti! Mola zamanı.' : 'Mola bitti! Odaklanma zamanı.');
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode]);

  const toggle = () => setIsActive(!isActive);
  const reset = () => {
    setIsActive(false);
    setTimeLeft(mode === 'work' ? 25 * 60 : 5 * 60);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="bg-white p-12 rounded-[3rem] shadow-xl border border-slate-100 text-center w-full max-w-md relative overflow-hidden">
        <div className={`absolute top-0 left-0 w-full h-2 transition-colors ${mode === 'work' ? 'bg-indigo-500' : 'bg-emerald-500'}`} />
        
        <h3 className="text-xl font-bold text-slate-800 mb-8 uppercase tracking-[0.2em] opacity-50">
          {mode === 'work' ? 'Çalışma Zamanı' : 'Mola Zamanı'}
        </h3>

        <div className="text-8xl font-black text-slate-800 mb-12 tabular-nums tracking-tighter">
          {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
        </div>

        <div className="flex gap-4">
          <button 
            onClick={toggle}
            className={`flex-1 py-4 rounded-2xl font-bold text-lg transition-all shadow-lg active:scale-95 ${
              isActive ? 'bg-slate-100 text-slate-800 hover:bg-slate-200' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100'
            }`}
          >
            {isActive ? 'Durdur' : 'Başlat'}
          </button>
          <button 
            onClick={reset}
            className="px-6 py-4 bg-slate-50 text-slate-400 rounded-2xl hover:text-slate-600 hover:bg-slate-100 transition-all border border-slate-100"
          >
            Sıfırla
          </button>
        </div>

        <div className="mt-12 flex justify-center gap-2">
          <div className={`w-2 h-2 rounded-full transition-colors ${mode === 'work' ? 'bg-indigo-500' : 'bg-slate-200'}`} />
          <div className={`w-2 h-2 rounded-full transition-colors ${mode === 'break' ? 'bg-emerald-500' : 'bg-slate-200'}`} />
        </div>
      </div>
      
      <div className="mt-12 max-w-md text-center">
        <h4 className="font-bold text-slate-800 mb-2">Neden Pomodoro?</h4>
        <p className="text-slate-500 text-sm leading-relaxed">
          Zihnimiz yoğun odaklanma sonrası dinlenmeye ihtiyaç duyar. 25 dakikalık seanslar dikkatin dağılmasını engeller, 5 dakikalık molalar ise bilgilerin kalıcı olmasını sağlar.
        </p>
      </div>
    </div>
  );
};

export default App;
