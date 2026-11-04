/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Clapperboard, Users, Film, DollarSign, FolderKanban, Sparkles, 
  Play, Plus, Trash2, Edit3, Save, Share2, Download, LogOut, 
  CheckCircle2, AlertCircle, Smartphone, Code, Eye, RefreshCw, Layers
} from 'lucide-react';

interface UserProfile {
  email: string;
  name: string;
  avatar: string;
}

interface Character {
  name: string;
  age: number;
  role: string;
  personality: string;
  backstory: string;
  signatureOutfit: string;
  voiceTone: string;
  imagePrompt: string;
}

interface FrameScene {
  frameIndex: number;
  timecode: string;
  title: string;
  visual: string;
  camera: string;
  dialogue: string;
  sfx: string;
  aiPrompt: string;
}

interface Project {
  id: string;
  title: string;
  genre: string;
  logline: string;
  hook: string;
  episodesCount: number;
  targetAudience: string;
  synopsis?: string;
  characters: Character[];
  frames: FrameScene[];
  updatedAt: string;
}

const ADMOB_IDS = {
  appId: "ca-app-pub-7664902162919139~4728060875",
  rewardedId: "ca-app-pub-7664902162919139/9741548556",
  bannerId: "ca-app-pub-7664902162919139/1930719178"
};

export default function App() {
  // Auth state
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('microdrama_user');
    return saved ? JSON.parse(saved) : {
      email: 'bertokaselo@gmail.com',
      name: 'Berto Kaselo',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    };
  });

  const [activeTab, setActiveTab] = useState<'studio' | 'characters' | 'frames' | 'projects'>('studio');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Active Project State
  const [project, setProject] = useState<Project>({
    id: 'proj-1',
    title: 'CEO Rahasia di Balik Masker',
    genre: 'CEO Revenge & Romance',
    logline: 'Pewaris konglomerat menyamar sebagai pegawai rendahan untuk menguji kesetiaan, lalu bangkit menghancurkan para pengkhianat.',
    hook: 'Tamparan keras di pesta keluarga dan lemparan Black Card di lantai marmer.',
    episodesCount: 5,
    targetAudience: 'Wanita 18-35 tahun (Vertical Drama Format)',
    characters: [
      {
        name: "Alvaro Pranata",
        age: 28,
        role: "Protagonis Utama (CEO Menyamar)",
        personality: "Dingin, tegas, sangat strategis",
        backstory: "Pewaris Grup Pranata menyamar menjadi supir demi mencari cinta sejati.",
        signatureOutfit: "Jaket hoodie hitam & jas Giorgio Armani",
        voiceTone: "Bariton berat, tenang, intimidatif",
        imagePrompt: "Cinematic 9:16 portrait of a handsome Asian CEO in a sharp black suit, dramatic studio lighting"
      },
      {
        name: "Maya Sasmita",
        age: 26,
        role: "Istri / Korban Intrik",
        personality: "Setia, pekerja keras, lembut",
        backstory: "Menikah tanpa tahu status asli suami, sering diinjak-injak keluarga mertua.",
        signatureOutfit: "Gaun kerja pastel sederhana",
        voiceTone: "Emosional, tegas saat terpojok",
        imagePrompt: "Cinematic 9:16 portrait of a resilient Asian woman in elegant office attire, emotional eyes"
      }
    ],
    frames: [
      {
        frameIndex: 1,
        timecode: "00:00 - 00:10",
        title: "The Killer Hook",
        visual: "Kamera close-up ekstrem pada telapak tangan, lalu PLAK! Tamparan keras mendarat di pipi Maya di hadapan para tamu pesta.",
        camera: "9:16 Vertical, Extreme Close Up, Slow motion 60fps",
        dialogue: "Ibu Mertua: 'Wanita tidak tahu diri! Berani-beraninya kamu datang ke pesta keluarga konglomerat ini!'",
        sfx: "SFX: Suara tamparan tajam (Echo), BGM: Ketegangan instan (Sudden drop)",
        aiPrompt: "Cinematic 9:16 vertical shot, dramatic close up of a sharp slap on a woman's face at a luxury banquet, 8k"
      },
      {
        frameIndex: 2,
        timecode: "00:10 - 00:20",
        title: "Reaksi & Cemoohan",
        visual: "Maya menahan tangis, memegang pipinya. Tamu-tamu tertawa sinis dan merekam dengan ponsel pintar.",
        camera: "9:16 Medium Shot, tracking shot mengitari Maya dengan efek blur latar belakang.",
        dialogue: "Maya: 'Aku hanya ingin mengantarkan berkas penting untuk suamiku...'",
        sfx: "SFX: Bisikan cemooh kerumunan, BGM: Melodi piano sedih bernada tinggi",
        aiPrompt: "Cinematic 9:16 vertical shot, crying woman surrounded by mocking wealthy crowd in luxury ballroom"
      },
      {
        frameIndex: 3,
        timecode: "00:20 - 00:30",
        title: "Hero Entrance",
        visual: "Dari sudut gelap ruangan, Alvaro (suami yang menyamar) melangkah maju perlahan menembus kerumunan.",
        camera: "9:16 Low angle shot, slow motion, epic hero entrance lighting.",
        dialogue: "Alvaro: 'Cukup hentikan semua sandiwara murahan ini.'",
        sfx: "SFX: Langkah kaki berat bergaung di marmer, BGM: Bass drop cinematic misterius",
        aiPrompt: "Cinematic 9:16 vertical shot, mysterious handsome man in humble black jacket stepping out of shadows"
      },
      {
        frameIndex: 4,
        timecode: "00:30 - 00:40",
        title: "Ejekan Musuh",
        visual: "Kevin tertawa terbahak-bahak menatap Alvaro yang memakai jaket lusuh.",
        camera: "9:16 Over-the-shoulder shot, medium close up Kevin tersenyum meremehkan.",
        dialogue: "Kevin: 'Wah, si supir rendahan mau pahlawan kesiangan? Mau dipecat hari ini juga, hah?!'",
        sfx: "SFX: Suara tawa sombong, BGM: Ritme ketegangan naik",
        aiPrompt: "Cinematic 9:16 vertical shot, arrogant wealthy man laughing mockingly at camera"
      },
      {
        frameIndex: 5,
        timecode: "00:40 - 00:50",
        title: "Ponsel Berdering",
        visual: "Ponsel Kevin berdering kencang. Ekspresinya seketika pucat pasi saat mendengar suara di seberang telepon.",
        camera: "9:16 Split screen or fast zoom into Kevin's terrified eyes.",
        dialogue: "Kevin di telepon: 'Apa?! Direktur utama baru memecat saya detik ini juga?!'",
        sfx: "SFX: Ringtone ponsel tajam, disusul suara angin bergemuruh",
        aiPrompt: "Cinematic 9:16 vertical shot, terrified businessman staring wide-eyed at glowing smartphone screen"
      },
      {
        frameIndex: 6,
        timecode: "00:50 - 01:00",
        title: "The Cliffhanger",
        visual: "Alvaro mengeluarkan kartu hitam berlogo emas, melemparnya tepat di depan kaki Kevin. Layar menggelap.",
        camera: "9:16 Extreme close up on Black Card hitting the marble floor, slow zoom out.",
        dialogue: "Alvaro: 'Karena kamulah orang yang baru saja kupecat dari perusahaan keluargaku sendiri.'",
        sfx: "SFX: Suara kartu logam berdenting di lantai marmer, BGM: Musik drop klimaks cliffhanger",
        aiPrompt: "Cinematic 9:16 vertical shot, luxury black credit card with golden crest falling on marble floor, climax"
      }
    ],
    updatedAt: new Date().toISOString()
  });

  // Saved Projects
  const [savedProjects, setSavedProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('microdrama_projects');
    return saved ? JSON.parse(saved) : [project];
  });

  // Rewarded Ad Modal State
  const [showRewardedModal, setShowRewardedModal] = useState(false);
  const [adWatched, setAdWatched] = useState(false);
  const [adTimer, setAdTimer] = useState(5);

  useEffect(() => {
    localStorage.setItem('microdrama_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('microdrama_projects', JSON.stringify(savedProjects));
  }, [savedProjects]);

  // AI Generation Handlers
  const handleGenerateConcept = async () => {
    // Validasi field kosong di tab Studio
    if (!project.title || !project.title.trim()) {
      setError('Judul Micro-Drama tidak boleh kosong.');
      return;
    }
    if (!project.genre || !project.genre.trim()) {
      setError('Genre Utama tidak boleh kosong.');
      return;
    }
    if (!project.logline || !project.logline.trim()) {
      setError('Logline / Premis Utama Cerita tidak boleh kosong.');
      return;
    }
    if (!project.hook || !project.hook.trim()) {
      setError('Hook 3 Detik Pertama tidak boleh kosong.');
      return;
    }
    if (!project.episodesCount || project.episodesCount < 1) {
      setError('Target Episode harus bernilai minimal 1.');
      return;
    }
    if (!project.targetAudience || !project.targetAudience.trim()) {
      setError('Target Audiens tidak boleh kosong.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/generate-microdrama', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: project.title,
          genre: project.genre,
          premise: project.logline,
          targetEpisodes: project.episodesCount
        })
      });
      const data = await res.json();
      if (data.success) {
        setProject(prev => ({
          ...prev,
          title: data.data.title || prev.title,
          genre: data.data.genre || prev.genre,
          logline: data.data.logline || prev.logline,
          hook: data.data.hook || prev.hook,
          episodesCount: data.data.episodesCount || prev.episodesCount,
          targetAudience: data.data.targetAudience || prev.targetAudience
        }));
        setSuccessMsg('Konsep Micro-Drama berhasil dibuat dengan Gemini 3.5 AI!');
        setTimeout(() => setSuccessMsg(null), 4000);
      } else {
        setError(data.error || 'Gagal menghasilkan konsep');
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan koneksi');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCharacters = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/generate-characters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: project.title,
          genre: project.genre,
          premise: project.logline
        })
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setProject(prev => ({ ...prev, characters: data.data }));
        setSuccessMsg('Character Sheets berhasil di-generate secara detail!');
        setTimeout(() => setSuccessMsg(null), 4000);
      } else {
        setError('Gagal menghasilkan karakter');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateFrames = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/generate-frames', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          episodeNumber: 1,
          episodeTitle: project.title,
          context: project.logline
        })
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setProject(prev => ({ ...prev, frames: data.data }));
        setSuccessMsg('Adegan Frame-to-Frame 10 detik berhasil dibuat!');
        setTimeout(() => setSuccessMsg(null), 4000);
      } else {
        setError('Gagal menghasilkan adegan');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Trigger Rewarded Ad simulation
  const startRewardedAd = () => {
    setShowRewardedModal(true);
    setAdTimer(5);
    const interval = setInterval(() => {
      setAdTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleClaimReward = () => {
    setAdWatched(true);
    setShowRewardedModal(false);
    setSuccessMsg('Iklan Selesai! Reward Aktif: Ekspor Full Script & AI Batch Generation Terbuka.');
    setTimeout(() => setSuccessMsg(null), 5000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-rose-500 selection:text-white">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 px-4 lg:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center shadow-lg shadow-rose-600/30">
            <Clapperboard className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg bg-gradient-to-r from-white via-slate-200 to-rose-400 bg-clip-text text-transparent">
              MicroDrama AI Studio Pro
            </h1>
            <p className="text-xs text-slate-400">Vertical Drama Creator & AdMob Monetization</p>
          </div>
        </div>

        {/* User Info */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3 bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-700">
            <img src={user?.avatar} alt="User" className="w-7 h-7 rounded-full object-cover border border-rose-500" />
            <div className="text-left hidden sm:block">
              <p className="text-xs font-semibold text-slate-200">{user?.name}</p>
              <p className="text-[10px] text-slate-400">{user?.email}</p>
            </div>
            <button 
              onClick={() => setUser(null)}
              title="Logout"
              className="text-slate-400 hover:text-rose-400 transition ml-2 p-1"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-[1600px] w-full mx-auto p-4 lg:p-6 gap-6">
        
        {/* Sidebar Navigation */}
        <aside className="w-full lg:w-64 flex flex-row lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0 shrink-0">
          <button
            onClick={() => setActiveTab('studio')}
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
              activeTab === 'studio' 
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/25' 
                : 'bg-slate-900/60 hover:bg-slate-800 text-slate-300'
            }`}
          >
            <Sparkles className="w-4 h-4 text-rose-300" />
            <span>1. Konsep & Premise</span>
          </button>

          <button
            onClick={() => setActiveTab('characters')}
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
              activeTab === 'characters' 
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/25' 
                : 'bg-slate-900/60 hover:bg-slate-800 text-slate-300'
            }`}
          >
            <Users className="w-4 h-4 text-rose-300" />
            <span>2. Character Sheets</span>
          </button>

          <button
            onClick={() => setActiveTab('frames')}
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
              activeTab === 'frames' 
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/25' 
                : 'bg-slate-900/60 hover:bg-slate-800 text-slate-300'
            }`}
          >
            <Film className="w-4 h-4 text-rose-300" />
            <span>3. Frame-to-Frame (10s)</span>
          </button>

          <button
            onClick={() => setActiveTab('projects')}
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
              activeTab === 'projects' 
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/25' 
                : 'bg-slate-900/60 hover:bg-slate-800 text-slate-300'
            }`}
          >
            <FolderKanban className="w-4 h-4 text-rose-300" />
            <span>Proyek Tersimpan</span>
          </button>

          {/* Quick Rewarded Ad trigger for export */}
          <div className="mt-auto hidden lg:block bg-gradient-to-br from-slate-900 to-slate-900 border border-slate-800 p-4 rounded-2xl">
            <div className="flex items-center space-x-2 text-amber-400 mb-2">
              <DollarSign className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">AdMob Rewarded</span>
            </div>
            <p className="text-xs text-slate-400 mb-3">Tonton iklan reward untuk unlock fitur ekspor skrip & AI unlimited.</p>
            <button
              onClick={startRewardedAd}
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2 px-3 rounded-xl text-xs transition shadow-lg shadow-amber-500/20"
            >
              {adWatched ? '✓ Pro Unlocked' : 'Tonton Iklan (0:05)'}
            </button>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 flex flex-col gap-6">
          {error && (
            <div className="bg-rose-950/80 border border-rose-800 text-rose-200 px-4 py-3 rounded-xl flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                <span>{error}</span>
              </div>
              <button onClick={() => setError(null)} className="text-xs underline hover:text-white">Tutup</button>
            </div>
          )}

          {successMsg && (
            <div className="bg-emerald-950/80 border border-emerald-800 text-emerald-200 px-4 py-3 rounded-xl flex items-center space-x-2 text-sm animate-fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* TAB 1: STUDIO / CONCEPT */}
          {activeTab === 'studio' && (
            <div className="space-y-6">
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                      <Sparkles className="w-5 h-5 text-rose-500" />
                      <span>Langkah 1: Konsep & Premise Micro-Drama (Gemini 3.5 AI)</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">Buat premis, logline, dan hook penarik perhatian penonton dalam 3 detik pertama.</p>
                  </div>
                  <button
                    onClick={handleGenerateConcept}
                    disabled={loading}
                    className="bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-semibold py-2.5 px-5 rounded-xl text-sm transition shadow-lg shadow-rose-600/30 flex items-center space-x-2 disabled:opacity-50"
                  >
                    {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    <span>{loading ? 'Gemini AI Beraksi...' : 'Generate Konsep dengan AI 3.5'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Judul Micro-Drama <span className="text-rose-500">*</span></label>
                    <input
                      type="text"
                      value={project.title}
                      onChange={(e) => setProject({ ...project, title: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-rose-500 transition"
                      placeholder="Contoh: CEO Rahasia di Balik Masker"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Genre Utama <span className="text-rose-500">*</span></label>
                    <select
                      value={project.genre}
                      onChange={(e) => setProject({ ...project, genre: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-rose-500 transition"
                    >
                      <option>CEO Revenge & Romance</option>
                      <option>Billionaire Secret Identity</option>
                      <option>Tragedy & Redemption</option>
                      <option>Time Travel & Revenge</option>
                      <option>Urban Fantasy & Mystery</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Logline / Premis Utama Cerita <span className="text-rose-500">*</span></label>
                    <textarea
                      rows={3}
                      value={project.logline}
                      onChange={(e) => setProject({ ...project, logline: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-rose-500 transition"
                      placeholder="Jelaskan plot twist utama dan motivasi karakter..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Hook 3 Detik Pertama (Wajib Viral) <span className="text-rose-500">*</span></label>
                    <input
                      type="text"
                      value={project.hook}
                      onChange={(e) => setProject({ ...project, hook: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-rose-500 transition"
                      placeholder="Contoh: Tamparan keras di pesta keluarga..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Target Episode & Audiens <span className="text-rose-500">*</span></label>
                    <div className="flex space-x-3">
                      <input
                        type="number"
                        min="1"
                        value={project.episodesCount}
                        onChange={(e) => setProject({ ...project, episodesCount: parseInt(e.target.value) || 5 })}
                        className="w-24 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-rose-500 transition"
                        required
                      />
                      <input
                        type="text"
                        value={project.targetAudience}
                        onChange={(e) => setProject({ ...project, targetAudience: e.target.value })}
                        className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-rose-500 transition"
                        placeholder="Target penonton..."
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-end space-x-4">
                  <button
                    onClick={() => setActiveTab('characters')}
                    className="bg-slate-800 hover:bg-slate-700 text-white font-semibold py-2.5 px-6 rounded-xl text-sm transition flex items-center space-x-2"
                  >
                    <span>Lanjut ke Character Sheets</span>
                    <Layers className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CHARACTER SHEETS */}
          {activeTab === 'characters' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                    <Users className="w-5 h-5 text-rose-500" />
                    <span>Langkah 2: Character Sheets & Profil Pemeran</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">Detail latar belakang, kostum khas, nada suara, dan AI image prompt untuk konsistensi visual.</p>
                </div>
                <button
                  onClick={handleGenerateCharacters}
                  disabled={loading}
                  className="bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-semibold py-2.5 px-5 rounded-xl text-sm transition shadow-lg shadow-rose-600/30 flex items-center space-x-2 disabled:opacity-50"
                >
                  {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  <span>{loading ? 'Generating...' : 'Generate Karakter AI'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {project.characters.map((char, idx) => (
                  <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-rose-600/10 rounded-full blur-2xl pointer-events-none"></div>
                    <div>
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-bold text-lg text-white">{char.name}</h3>
                          <span className="text-xs bg-rose-950 text-rose-300 px-2.5 py-1 rounded-full border border-rose-800/60 font-medium">
                            {char.role} • {char.age} thn
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2.5 text-xs text-slate-300 mt-4">
                        <div>
                          <span className="text-slate-500 font-semibold block mb-0.5">KEPRIBADIAN:</span>
                          <p>{char.personality}</p>
                        </div>
                        <div>
                          <span className="text-slate-500 font-semibold block mb-0.5">LATAR BELAKANG:</span>
                          <p>{char.backstory}</p>
                        </div>
                        <div>
                          <span className="text-slate-500 font-semibold block mb-0.5">KOSTUM KHAS:</span>
                          <p>{char.signatureOutfit}</p>
                        </div>
                        <div>
                          <span className="text-slate-500 font-semibold block mb-0.5">NADA SUARA:</span>
                          <p>{char.voiceTone}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-800/80">
                      <span className="text-[10px] text-slate-500 font-mono block mb-1">AI PROMPT (9:16 VERTICAL):</span>
                      <p className="text-[11px] text-slate-400 bg-slate-950 p-2.5 rounded-xl border border-slate-800 font-mono italic line-clamp-2">
                        {char.imagePrompt}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: FRAME-TO-FRAME 10s TIMELINE */}
          {activeTab === 'frames' && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                    <Film className="w-5 h-5 text-rose-500" />
                    <span>Langkah 3: Breakdown Adegan Frame-to-Frame (Durasi 10 Detik/Frame)</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">Struktur adegan vertikal micro-drama 60 detik (6 frame x 10 detik) dengan angle kamera, dialog, dan SFX.</p>
                </div>
                <button
                  onClick={handleGenerateFrames}
                  disabled={loading}
                  className="bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-semibold py-2.5 px-5 rounded-xl text-sm transition shadow-lg shadow-rose-600/30 flex items-center space-x-2 disabled:opacity-50"
                >
                  {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  <span>{loading ? 'AI Menulis...' : 'Generate Adegan AI (10s)'}</span>
                </button>
              </div>

              {/* Frames List */}
              <div className="space-y-4">
                {project.frames.map((frame, idx) => (
                  <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col lg:flex-row gap-6 items-start">
                    {/* Timestamp & Index badge */}
                    <div className="w-full lg:w-48 shrink-0 flex lg:flex-col items-center lg:items-start justify-between bg-slate-950 p-4 rounded-xl border border-slate-800">
                      <div className="flex items-center space-x-2">
                        <span className="w-7 h-7 rounded-lg bg-rose-600/20 text-rose-400 font-bold flex items-center justify-center text-xs border border-rose-500/30">
                          #{frame.frameIndex}
                        </span>
                        <span className="font-mono text-xs text-amber-400 font-semibold">{frame.timecode}</span>
                      </div>
                      <span className="text-[11px] text-slate-400 mt-2 block">Durasi: 10 Detik</span>
                      <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded mt-2">{frame.title}</span>
                    </div>

                    {/* Content Details */}
                    <div className="flex-1 space-y-3 w-full">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                          <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block mb-1">Visual & Action (9:16)</span>
                          <p className="text-xs text-slate-200 leading-relaxed">{frame.visual}</p>
                        </div>
                        <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-1">Camera & Angle</span>
                          <p className="text-xs text-slate-200 leading-relaxed">{frame.camera}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">Dialogue & Subtitle</span>
                          <p className="text-xs text-slate-200 font-medium leading-relaxed">{frame.dialogue}</p>
                        </div>
                        <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                          <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block mb-1">Sound Effects (SFX) & BGM</span>
                          <p className="text-xs text-slate-200 leading-relaxed">{frame.sfx}</p>
                        </div>
                      </div>

                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                        <span className="text-[10px] font-mono text-slate-500 block mb-0.5">AI GENERATOR PROMPT:</span>
                        <p className="text-xs font-mono text-slate-300 italic">{frame.aiPrompt}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SAVED PROJECTS */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                    <FolderKanban className="w-5 h-5 text-rose-500" />
                    <span>Daftar Proyek Micro-Drama Tersimpan</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">Kelola dan muat proyek drama vertikal Anda.</p>
                </div>
                <button
                  onClick={() => {
                    const newProj: Project = {
                      id: 'proj-' + Date.now(),
                      title: 'Drama Baru ' + (savedProjects.length + 1),
                      genre: 'CEO Romance',
                      logline: 'Premis baru drama vertikal...',
                      hook: 'Hook di detik pertama...',
                      episodesCount: 5,
                      targetAudience: 'Penonton Gen Z',
                      characters: [],
                      frames: [],
                      updatedAt: new Date().toISOString()
                    };
                    setSavedProjects([...savedProjects, newProj]);
                    setProject(newProj);
                    setSuccessMsg('Proyek baru berhasil dibuat!');
                    setTimeout(() => setSuccessMsg(null), 3000);
                  }}
                  className="bg-rose-600 hover:bg-rose-500 text-white font-semibold py-2 px-4 rounded-xl text-xs transition flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Buat Proyek Baru</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {savedProjects.map((p) => (
                  <div key={p.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-white text-base">{p.title}</h3>
                      <p className="text-xs text-rose-400 font-medium">{p.genre}</p>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-1">{p.logline}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setProject(p);
                          setActiveTab('studio');
                          setSuccessMsg(`Proyek "${p.title}" dimuat.`);
                          setTimeout(() => setSuccessMsg(null), 3000);
                        }}
                        className="bg-slate-800 hover:bg-slate-700 text-white p-2.5 rounded-xl text-xs transition"
                        title="Muat Proyek"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          const updated = savedProjects.filter(item => item.id !== p.id);
                          setSavedProjects(updated);
                        }}
                        className="bg-rose-950/60 hover:bg-rose-900 text-rose-300 p-2.5 rounded-xl text-xs transition"
                        title="Hapus Proyek"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Live AdMob Banner Component Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-3 px-4 text-center mt-auto">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[11px]">AdMob Banner Active (<code className="text-slate-300">ca-app-pub-7664902162919139/1930719178</code>)</span>
          </div>
          <p>© 2026 MicroDrama AI Studio Pro • Powered by Gemini 3.5 AI & AdMob SDK</p>
        </div>
      </footer>

      {/* Rewarded Ad Simulated Modal */}
      {showRewardedModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mx-auto">
              <DollarSign className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Google AdMob Rewarded Video</h3>
            <p className="text-xs text-slate-400">
              Menampilkan Iklan (<code className="text-amber-300">ca-app-pub-7664902162919139/9741548556</code>)...
            </p>

            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 my-4">
              {adTimer > 0 ? (
                <div className="space-y-2">
                  <div className="text-3xl font-mono font-bold text-amber-400 animate-pulse">0:0{adTimer}</div>
                  <p className="text-[11px] text-slate-500">Iklan sedang diputar untuk mendukung kreator...</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                  <p className="text-sm font-semibold text-emerald-300">Iklan Selesai Ditonton!</p>
                </div>
              )}
            </div>

            <button
              onClick={handleClaimReward}
              disabled={adTimer > 0}
              className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl text-sm transition shadow-lg shadow-emerald-600/25"
            >
              {adTimer > 0 ? `Tunggu ${adTimer}s...` : 'Klaim Reward & Buka Fitur Pro'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
