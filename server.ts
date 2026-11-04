import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Initialize Gemini client if API key is available
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// Helper function to automatically try Gemini 3.5 models with auto-fallback
async function callGeminiAuto(prompt: string) {
  if (!ai) {
    throw new Error('GEMINI_API_KEY tidak ditemukan. Mohon konfigurasikan API Key.');
  }

  // Daftar prioritas model Gemini terbaru (Gemini 3.5 series dan fallback)
  const models = ['gemini-3.5-flash-lite', 'gemini-3.5-flash', 'gemini-2.5-flash', 'gemini-1.5-flash'];
  let lastError: any = null;

  for (const modelName of models) {
    try {
      console.log(`Mencoba akses model AI: ${modelName}`);
      const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
      });
      if (response && response.text) {
        return { text: response.text, modelUsed: modelName };
      }
    } catch (err: any) {
      console.warn(`Model ${modelName} gagal:`, err.message || err);
      lastError = err;
    }
  }

  throw lastError || new Error('Semua model Gemini gagal merespons.');
}

// API Endpoint to generate Micro-Drama Project & Concept using Gemini 3.5 Auto
app.post('/api/generate-microdrama', async (req, res) => {
  try {
    const { title, genre, premise, targetEpisodes } = req.body;

    if (!ai) {
      return res.json({
        success: true,
        source: 'mock',
        data: {
          title: title || 'CEO Rahasia di Balik Masker',
          genre: genre || 'CEO Revenge / Romance',
          logline: premise || 'Seorang pewaris tahta konglomerat menyamar menjadi pegawai rendahan untuk menguji kesetiaan istrinya, namun dikhianati dan bangkit menghancurkan musuh.',
          hook: 'Adegan pertama dibuka dengan tamparan keras di pesta ulang tahun keluarga.',
          episodesCount: targetEpisodes || 5,
          targetAudience: 'Wanita 18-35 tahun, penikmat drama vertikal durasi cepat (ReelShort/ShortTV style).'
        }
      });
    }

    const prompt = `Bertindaklah sebagai Executive Producer dan Showrunner kelas dunia untuk platform Micro-Drama vertikal berating tinggi (seperti ReelShort, ShortTV, Dramabox). 
Tugas Anda adalah merancang konsep cerita micro-drama yang **sangat adiktif, penuh plot twist mengejutkan, ketegangan emosional tinggi, dan memicu viralitas instan**.

Detail permintaan:
- Judul Pilihan: ${title || 'Bebas (buat yang dramatis & catchy)'}
- Genre: ${genre || 'CEO Revenge / Hidden Identity / Billionaire Romance'}
- Premis Awal: ${premise || 'Kisah balas dendam yang memuaskan terhadap pengkhianat'}
- Jumlah Episode: ${targetEpisodes || 5}

Kriteria Jalan Cerita yang Diharapkan:
1. **High Stakes & Emotional Hook**: Tokoh utama diinjak-injak/dihina di awal, namun menyimpan identitas rahasia atau kekuatan luar biasa yang akan segera meledak.
2. **Instant Gratification & Cliffhanger**: Setiap akhir episode harus meninggalkan rasa penasaran ekstrem (cliffhanger).
3. **Bahasa**: Gunakan bahasa Indonesia sinematik yang profesional dan mencengkeram.

Berikan output dalam format JSON murni (TANPA markdown tambahan seperti \`\`\`json) dengan struktur persis:
{
  "title": "Judul drama yang catchy dan menjual",
  "genre": "Genre spesifik micro-drama",
  "logline": "Logline 2-3 kalimat yang merangkum konflik utama dan pembalasan dendam",
  "hook": "Adegan pembuka 3 detik pertama yang sangat mengejutkan dan memancing emosi",
  "episodesCount": ${targetEpisodes || 5},
  "targetAudience": "Target penonton spesifik",
  "synopsis": "Sinopsis mendalam yang memperlihatkan alur dari awal hingga klimaks pembalasan"
}`;

    const result = await callGeminiAuto(prompt);
    const text = result.text || '';
    let jsonResult;
    try {
      const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
      jsonResult = JSON.parse(cleanJson);
    } catch {
      jsonResult = {
        title: title || 'Drama Vertikal',
        genre: genre || 'Drama',
        logline: premise || text,
        hook: 'Hook yang memikat di detik pertama.',
        episodesCount: targetEpisodes || 5,
        targetAudience: 'Penonton umum'
      };
    }

    res.json({ success: true, source: result.modelUsed, data: jsonResult });
  } catch (error: any) {
    console.error('Gemini error:', error);
    res.status(500).json({ success: false, error: error.message || 'Gagal menghasilkan AI data' });
  }
});

// API Endpoint to generate Character Sheets using Gemini 3.5 Auto
app.post('/api/generate-characters', async (req, res) => {
  try {
    const { title, genre, premise } = req.body;

    if (!ai) {
      return res.json({
        success: true,
        source: 'mock',
        data: [
          {
            name: "Alvaro Pranata",
            age: 28,
            role: "Protagonis Utama (CEO / Suami Menyamar)",
            personality: "Dingin di luar, penyayang pada yang tulus, sangat cerdas dan tegas.",
            backstory: "Pewaris tunggal Grup Pranata yang menyamar sebagai supir demi menguji ketulusan istrinya.",
            signatureOutfit: "Jaket hoodie hitam lusuh saat menyamar, jas Giorgio Armani hitam saat jadi CEO.",
            voiceTone: "Bariton berat, tenang, intimidatif saat marah.",
            imagePrompt: "Cinematic 9:16 portrait of a handsome 28-year-old Asian male CEO in a sharp black suit, sharp jawline, cinematic lighting, 8k resolution, photorealistic"
          },
          {
            name: "Maya Sasmita",
            age: 26,
            role: "Istri / Korban Intrik Keluarga",
            personality: "Setia, pekerja keras, lembut namun berani membela kebenaran.",
            backstory: "Menikahi Alvaro tanpa tahu identitas aslinya, sering diremehkan oleh keluarga mertua.",
            signatureOutfit: "Gaun kerja sederhana warna pastel, celemek dapur.",
            voiceTone: "Lembut, emosional, tegas saat terpojok.",
            imagePrompt: "Cinematic 9:16 portrait of a beautiful 26-year-old Asian woman in elegant modest office attire, gentle emotional expression, cinematic lighting, 8k"
          },
          {
            name: "Kevin Santoso",
            age: 30,
            role: "Antagonis Utama (Pesaing / Mantan)",
            personality: "Arrogant, manipulatif, serakah.",
            backstory: "Sepupu jauh yang ambisius merebut posisi CEO dengan cara licik.",
            signatureOutfit: "Jas putih mewah, jam tangan emas.",
            voiceTone: "Sinis, meremehkan, nada tinggi saat emosi.",
            imagePrompt: "Cinematic 9:16 portrait of an arrogant wealthy antagonist man in white designer suit, smug expression, cinematic lighting"
          }
        ]
      });
    }

    const prompt = `Bertindaklah sebagai casting director dan lead writer professional. Buatkan 3 karakter utama yang kuat, ikonik, dan memiliki konflik mendalam untuk micro-drama vertikal berjudul "${title}" (${genre}) dengan premis: "${premise}".

Pastikan karakter memiliki dinamika konflik yang tajam (Protagonis yang tertindas namun berkarisma, Antagonis yang menyebalkan dan arogan, serta deuteragonis pendukung).

Format output harus berupa JSON Array murni (TANPA markdown tambahan seperti \`\`\`json) dengan struktur persis:
[{
  "name": "Nama lengkap karakter",
  "age": number,
  "role": "Peran (misal: Protagonis Utama / Antagonis Utama)",
  "personality": "Sifat dan psikologi karakter",
  "backstory": "Latar belakang traumatis atau rahasia besar yang memotivasi tindakan mereka",
  "signatureOutfit": "Deskripsi pakaian khas yang ikonik",
  "voiceTone": "Nada bicara dan ciri khas vokal",
  "imagePrompt": "Detailed English prompt for AI image generator in 9:16 vertical ratio, photorealistic cinematic lighting, 8k"
}]`;

    const result = await callGeminiAuto(prompt);
    const text = result.text || '';
    let jsonResult;
    try {
      const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
      jsonResult = JSON.parse(cleanJson);
    } catch {
      jsonResult = [{
        name: "Karakter Utama",
        age: 27,
        role: "Protagonis",
        personality: "Kuat dan pantang menyerah",
        backstory: "Kisah latar belakang dramatis",
        signatureOutfit: "Setelan kasual modern",
        voiceTone: "Tegas",
        imagePrompt: "Cinematic portrait 9:16 character"
      }];
    }

    res.json({ success: true, source: result.modelUsed, data: jsonResult });
  } catch (error: any) {
    console.error('Character generation error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// API Endpoint to generate Frame-to-Frame 10s breakdown using Gemini 3.5 Auto
app.post('/api/generate-frames', async (req, res) => {
  try {
    const { episodeNumber, episodeTitle, context } = req.body;

    if (!ai) {
      return res.json({
        success: true,
        source: 'mock',
        data: [
          {
            frameIndex: 1,
            timecode: "00:00 - 00:10",
            title: "The Hook (Detik Pertama)",
            visual: "Kamera close-up ekstrem pada telapak tangan yang melayang di udara, lalu PLAK! Tamparan keras mendarat di pipi Maya.",
            camera: "9:16 Vertical, Extreme Close Up (ECU), Slow motion 60fps",
            dialogue: "Ibu Mertua: 'Wanita tidak tahu diri! Berani-beraninya kamu datang ke pesta keluarga konglomerat ini!'",
            sfx: "SFX: Suara tamparan tajam (Slap echo), BGM: Ketegangan instan (Sudden drop beat)",
            aiPrompt: "Cinematic 9:16 vertical shot, dramatic close up of a sharp slap on a woman's face at a luxury banquet, emotional tension, dramatic cinematic lighting, 8k"
          },
          {
            frameIndex: 2,
            timecode: "00:10 - 00:20",
            title: "Reaksi & Penghinaan",
            visual: "Maya menahan tangis, memegang pipinya yang merah. Di latar belakang, tamu-tamu tertawa sinis dan merekam dengan ponsel.",
            camera: "9:16 Medium Shot, tracking shot mengitari Maya dengan efek blur latar belakang.",
            dialogue: "Maya: 'Aku hanya ingin mengantarkan berkas penting untuk suamiku...'",
            sfx: "SFX: Bisikan cemooh kerumunan, BGM: Melodi piano sedih bernada tinggi",
            aiPrompt: "Cinematic 9:16 vertical shot, crying woman surrounded by mocking wealthy crowd in luxury ballroom, dramatic lighting, photorealistic"
          },
          {
            frameIndex: 3,
            timecode: "00:20 - 00:30",
            title: "Kehadiran Sang Supir",
            visual: "Dari sudut gelap ruangan, Alvaro (suami yang menyamar) melangkah maju perlahan menembus kerumunan. Sorot lampu menyoroti wajahnya yang dingin.",
            camera: "9:16 Low angle shot, slow motion, epic hero entrance lighting.",
            dialogue: "Alvaro: 'Cukup hentikan semua sandiwara murahan ini.'",
            sfx: "SFX: Langkah kaki berat bergaung di lantai marmer, BGM: Bass drop musik hip hop/cinematic misterius",
            aiPrompt: "Cinematic 9:16 vertical shot, mysterious handsome man in humble black jacket stepping out of shadows into bright luxury hall, dramatic rim lighting"
          },
          {
            frameIndex: 4,
            timecode: "00:30 - 00:40",
            title: "Ejekan Antagonis",
            visual: "Kevin tertawa terbahak-bahak menatap Alvaro yang memakai jaket lusuh.",
            camera: "9:16 Over-the-shoulder shot, medium close up Kevin tersenyum meremehkan.",
            dialogue: "Kevin: 'Wah, si supir rendahan mau pahlawan kesiangan? Mau dipecat hari ini juga, hah?!'",
            sfx: "SFX: Suara tawa sombong, BGM: Ritme ketegangan naik",
            aiPrompt: "Cinematic 9:16 vertical shot, arrogant wealthy man laughing mockingly at camera, luxury interior background"
          },
          {
            frameIndex: 5,
            timecode: "00:40 - 00:50",
            title: "Ponsel Berdering & Telepon Penting",
            visual: "Ponsel Kevin berdering kencang. Ia mengangkatnya dengan angkuh, namun ekspresinya seketika berubah pucat pasi saat mendengar suara di seberang.",
            camera: "9:16 Split screen or fast zoom into Kevin's terrified eyes.",
            dialogue: "Kevin di telepon: 'Apa?! Direktur utama baru memecat saya detik ini juga?! Siapa dia?!'",
            sfx: "SFX: Ringtone ponsel tajam, disusul suara angin bergemuruh (suspense riser)",
            aiPrompt: "Cinematic 9:16 vertical shot, terrified businessman staring wide-eyed at glowing smartphone screen in panic, neon and warm luxury lighting"
          },
          {
            frameIndex: 6,
            timecode: "00:50 - 01:00",
            title: "The Cliffhanger (Puncak Episode)",
            visual: "Alvaro mengeluarkan kartu hitam eksklusif berlogo emas dari saku jaketnya, melemparnya tepat di depan kaki Kevin. Layar menggelap dengan tulisan bersinar.",
            camera: "9:16 Extreme close up on Black Card hitting the marble floor, slow zoom out to Alvaro's piercing gaze.",
            dialogue: "Alvaro: 'Karena kamulah orang yang baru saja kupecat dari perusahaan keluargaku sendiri.'",
            sfx: "SFX: Suara kartu logam berdenting di lantai marmer, BGM: Musik drop klimaks cliffhanger",
            aiPrompt: "Cinematic 9:16 vertical shot, luxury black credit card with golden crest falling on marble floor, dramatic cinematic climax, 8k"
          }
        ]
      });
    }

    const prompt = `Bertindaklah sebagai sutradara dan storyboard artist profesional untuk micro-drama vertikal berdurasi pendek (60 detik total).
Buatkan breakdown adegan frame-to-frame berdurasi 10 detik per frame yang sangat memukau, konsisten, dan bernyawa tinggi untuk Episode ${episodeNumber || 1}: "${episodeTitle || 'Klimaks Pembalasan'}".
Konteks cerita: "${context || 'Drama vertikal CEO'}"

Aturan Penting:
1. **Karakter Konsisten**: Pastikan deskripsi visual dan AI prompt di setiap frame selalu mempertahankan konsistensi atribut fisik dan kostum karakter utama (warna rambut, pakaian khas, ekspresi).
2. **Dialog Bernama**: Berikan nama karakter yang berbicara secara spesifik pada dialog (format: NAMA KARAKTER: "isi dialog") agar tidak tertukar.
3. **Soundtrack & SFX**: Sertakan jenis musik latar belakang (BGM) dan efek suara (SFX) yang spesifik untuk membangun ketegangan adegan 10 detik tersebut.
4. **Unified Prompt**: Satukan prompt AI agar langsung mencakup konsistensi karakter, aksi, sudut kamera 9:16 vertikal, pencahayaan sinematik, dan suasana.

Format output harus berupa JSON Array murni (TANPA markdown tambahan seperti \`\`\`json) dengan struktur persis:
[{
  "frameIndex": number (1 s.d. 6),
  "timecode": "string (misal: 00:00 - 00:10)",
  "title": "Judul adegan yang dramatis",
  "visual": "Deskripsi visual sinematik 9:16 yang konsisten dengan atribut karakter",
  "camera": "Pergerakan dan sudut kamera (misal: 9:16 Vertical, Slow Push-in, Extreme Close Up)",
  "dialogue": "NAMA KARAKTER: \\"Isi dialog spesifik\\"",
  "sfx": "Soundtrack (BGM) & Efek Suara (SFX) spesifik adegan ini",
  "aiPrompt": "Unified AI video prompt in English for 9:16 vertical ratio, maintaining exact character consistency, photorealistic cinematic lighting, 8k"
}]`;

    const result = await callGeminiAuto(prompt);
    const text = result.text || '';
    let jsonResult;
    try {
      const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
      jsonResult = JSON.parse(cleanJson);
    } catch {
      jsonResult = [
        {
          frameIndex: 1,
          timecode: "00:00 - 00:10",
          title: "The Hook",
          visual: "Visual adegan pembuka yang dramatis.",
          camera: "Close-up 9:16",
          dialogue: "Karakter: 'Dialog pembuka...'",
          sfx: "SFX: Efek suara tegang",
          aiPrompt: "Cinematic 9:16 vertical shot"
        }
      ];
    }

    res.json({ success: true, source: result.modelUsed, data: jsonResult });
  } catch (error: any) {
    console.error('Frame generation error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Vite middleware for development
if (process.env.NODE_ENV !== 'production') {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  const distPath = path.join(__dirname, 'dist');
  app.use(express.static(distPath));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
