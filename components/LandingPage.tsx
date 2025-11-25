
import React, { useState, useEffect, useRef } from 'react';
import { Code, Database, Layout, Smartphone, Github, Instagram, Linkedin, Globe, Wallet, PieChart, Coins, CreditCard, ExternalLink, Mail } from 'lucide-react';

// --- Reusable Component for Scroll Reveal Animation ---
const RevealOnScroll = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    ref.current?.classList.add('active');
                    observer.unobserve(entry.target); // Trigger once
                }
            },
            { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
        );

        if (ref.current) observer.observe(ref.current);

        return () => {
            if (ref.current) observer.disconnect();
        };
    }, []);

    return <div ref={ref} className={`reveal ${className}`}>{children}</div>;
};

export const LandingPage = ({ onStart }: { onStart: () => void }) => {
  const [lang, setLang] = useState<'id' | 'en'>('id'); // Default ID
  const [offset, setOffset] = useState(0);

  // Parallax Effect Logic
  useEffect(() => {
      const handleScroll = () => setOffset(window.scrollY);
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const CONTENT = {
    id: {
      nav: { signIn: "Masuk", start: "Mulai Demo" },
      hero: {
        titlePrefix: "Kendalikan",
        titleSuffix: "Uang Anda.",
        desc: "Bukan sekadar pencatat pengeluaran. Ini adalah pusat kendali keuangan pribadi Anda. Analisis real-time, tanpa spreadsheet yang membosankan.",
        ctaMain: "Coba Gratis Sekarang",
        ctaSec: "Lihat Kode"
      },
      marquee: [
        "Real-time Analytics", "Aman & Privat", "Tanpa Iklan", "Mobile First", "Export CSV", "Smart Budgeting", "Multi-Currency", "Dark Mode"
      ],
      features: {
        title: "Fitur yang Anda Butuhkan",
        subtitle: "Lihat langsung bagaimana ghifarmkcy bekerja.",
        bento: {
            analytics: "Analisis Mendalam",
            analyticsDesc: "Grafik interaktif memvisualisasikan arus kas Anda.",
            budget: "Anggaran Pintar",
            budgetDesc: "Setel batas bulanan agar tidak boncos.",
            secure: "Privasi Terjamin",
            secureDesc: "Data Anda milik Anda. Aman.",
            speed: "Mobile First",
            speedDesc: "Akses cepat dari mana saja."
        }
      },
      about: {
        badge: "Meet The Developer",
        title: "Dibalik Kode.",
        name: "M. Gilang Alghipari",
        role: "Mahasiswa Semester 1 • STMIK Cirebon",
        bio: "Saya percaya bahwa software keuangan terbaik adalah yang transparan dan mudah digunakan. Proyek ini adalah manifestasi dari pembelajaran saya dalam Full-Stack Development.",
        status: "Open to Work / Collaboration",
        social: {
            gh: "GitHub",
            ig: "Instagram",
            li: "LinkedIn"
        }
      },
      tech: {
        title: "Teknologi Modern",
        desc: "Dibangun dengan stack terkini untuk performa maksimal.",
        items: {
            react: "Frontend Framework",
            tw: "Utility-first Styling",
            sb: "Backend & Auth",
            resp: "Desain Mobile First"
        }
      },
      footer: "Proyek Mahasiswa."
    },
    en: {
      nav: { signIn: "Sign In", start: "Start Demo" },
      hero: {
        titlePrefix: "Master Your",
        titleSuffix: "Money Flow.",
        desc: "Not just an expense tracker. It's your personal financial command center. Real-time insights, no boring spreadsheets.",
        ctaMain: "Start Free Trial",
        ctaSec: "View Code"
      },
      marquee: [
        "Real-time Analytics", "Secure & Private", "No Ads", "Mobile First", "Export CSV", "Smart Budgeting", "Multi-Currency", "Dark Mode"
      ],
      features: {
        title: "Features You Need",
        subtitle: "See exactly how ghifarmkcy works.",
        bento: {
            analytics: "Deep Analytics",
            analyticsDesc: "Interactive charts visualize your cash flow.",
            budget: "Smart Budgeting",
            budgetDesc: "Set monthly limits to stay on track.",
            secure: "Secure Privacy",
            secureDesc: "Your data is yours. Secure.",
            speed: "Mobile First",
            speedDesc: "Fast access from anywhere."
        }
      },
      about: {
        badge: "Meet The Developer",
        title: "Behind the Code.",
        name: "M. Gilang Alghipari",
        role: "1st Semester Student • STMIK Cirebon",
        bio: "I believe the best financial software is transparent and easy to use. This project is a manifestation of my learning journey in Full-Stack Development.",
        status: "Open to Work / Collaboration",
        social: {
            gh: "GitHub",
            ig: "Instagram",
            li: "LinkedIn"
        }
      },
      tech: {
        title: "Built With Modern Tech",
        desc: "A showcase of the latest web technologies implemented in this project.",
        items: {
            react: "Frontend Framework",
            tw: "Utility-first Styling",
            sb: "Backend & Auth",
            resp: "Mobile First Design"
        }
      },
      footer: "Student Project."
    }
  };

  const t = CONTENT[lang];

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-orange-500/30 overflow-x-hidden">
      
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 px-6 py-4 flex justify-between items-center bg-black/70 backdrop-blur-lg border-b border-white/5 transition-all duration-300">
        <div className="text-xl font-bold tracking-tighter flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
          ghifar<span className="text-zinc-500">mkcy</span>.
        </div>
        <div className="flex items-center gap-4">
             {/* Language Switcher */}
             <button 
                onClick={() => setLang(lang === 'id' ? 'en' : 'id')}
                className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-white px-3 py-1.5 rounded-full border border-white/10 hover:bg-white/10 transition-all"
             >
                <Globe size={12} />
                {lang.toUpperCase()}
             </button>

             <button onClick={onStart} className="text-sm font-medium text-zinc-400 hover:text-white transition-colors hidden sm:block">
                {t.nav.signIn}
             </button>
             <button onClick={onStart} className="px-5 py-2 rounded-full bg-white text-black text-sm font-bold hover:scale-105 transition-transform hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                {t.nav.start}
             </button>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-20 px-6 min-h-screen flex flex-col items-center justify-center overflow-hidden">
         
         {/* Background Aurora */}
         <div 
            className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none transition-transform duration-75 ease-out"
            style={{ transform: `translateY(${offset * 0.2}px)` }}
         ></div>
         <div 
            className="absolute top-[10%] right-[10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none transition-transform duration-75 ease-out"
            style={{ transform: `translateY(${offset * 0.1}px)` }}
         ></div>
         <div 
            className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-orange-500/10 rounded-full blur-[100px] pointer-events-none transition-transform duration-75 ease-out"
            style={{ transform: `translateY(${offset * 0.15}px)` }}
         ></div>

         <RevealOnScroll className="relative z-10 text-center max-w-4xl mx-auto space-y-8">
            <h1 className="text-6xl md:text-8xl font-serif tracking-tight text-white leading-[1.1] drop-shadow-2xl">
               {t.hero.titlePrefix} <br/> 
               <span className="italic font-light text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-200">{t.hero.titleSuffix}</span>
            </h1>
            <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto font-light leading-relaxed">
               {t.hero.desc}
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
               <button onClick={onStart} className="w-full sm:w-auto px-8 py-4 bg-orange-500 text-white rounded-full font-bold text-lg hover:bg-orange-600 transition-all animate-pulse-glow hover:scale-105 active:scale-95">
                  {t.hero.ctaMain}
               </button>
               <button onClick={onStart} className="w-full sm:w-auto px-8 py-4 border border-zinc-700 rounded-full font-medium text-zinc-300 hover:text-white hover:border-zinc-500 hover:bg-white/5 transition-all">
                  {t.hero.ctaSec}
               </button>
            </div>
         </RevealOnScroll>

         {/* Floating Elements (3D Depth) */}
         <div className="absolute inset-0 pointer-events-none overflow-hidden max-w-7xl mx-auto">
             <FloatingElement className="top-[20%] left-[5%] animate-float-slow delay-0">
                 <div className="p-4 bg-zinc-900/80 backdrop-blur border border-white/10 rounded-2xl shadow-2xl transform -rotate-12">
                     <Wallet className="w-8 h-8 text-orange-500" />
                 </div>
             </FloatingElement>
             <FloatingElement className="top-[25%] right-[8%] animate-float-medium delay-1000">
                 <div className="p-4 bg-zinc-900/80 backdrop-blur border border-white/10 rounded-2xl shadow-2xl transform rotate-6">
                     <PieChart className="w-8 h-8 text-emerald-500" />
                 </div>
             </FloatingElement>
             <FloatingElement className="bottom-[20%] left-[10%] animate-float-fast delay-500">
                 <div className="p-4 bg-zinc-900/80 backdrop-blur border border-white/10 rounded-2xl shadow-2xl transform rotate-12">
                     <Coins className="w-8 h-8 text-yellow-500" />
                 </div>
             </FloatingElement>
              <FloatingElement className="bottom-[30%] right-[15%] animate-float-slow delay-200">
                 <div className="p-4 bg-zinc-900/80 backdrop-blur border border-white/10 rounded-2xl shadow-2xl transform -rotate-6">
                     <CreditCard className="w-8 h-8 text-purple-500" />
                 </div>
             </FloatingElement>
         </div>

         {/* Dashboard Mockup (3D Tilt) */}
         <div className="relative mt-24 w-full max-w-5xl perspective-1000 group">
            <RevealOnScroll>
                <div className="relative rounded-xl border border-white/10 bg-[#09090b] shadow-2xl shadow-orange-900/20 transform rotate-x-12 scale-[0.9] group-hover:rotate-x-0 group-hover:scale-100 transition-all duration-1000 ease-[cubic-bezier(0.25,0.1,0.25,1)] p-2">
                    {/* CSS Drawn Dashboard - Miniaturized for visual impact */}
                    <div className="flex h-[400px] md:h-[600px] rounded-lg overflow-hidden bg-black/50">
                        {/* Mock Sidebar */}
                        <div className="hidden md:flex w-16 lg:w-48 border-r border-white/5 flex-col p-4 gap-4 bg-zinc-950/50">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-4 h-4 rounded-full bg-orange-500 shrink-0"></div>
                                <div className="h-2 w-20 bg-zinc-800 rounded hidden lg:block"></div>
                            </div>
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className={`h-8 rounded-lg w-full flex items-center px-2 gap-3 ${i === 1 ? 'bg-zinc-800/80 border border-white/5' : 'opacity-50'}`}>
                                    <div className={`w-4 h-4 rounded ${i === 1 ? 'bg-orange-500/50' : 'bg-zinc-800'}`}></div>
                                </div>
                            ))}
                        </div>
                        {/* Mock Main Content */}
                        <div className="flex-1 flex flex-col p-4 md:p-6 gap-6 overflow-hidden relative">
                            {/* Header */}
                            <div className="flex justify-between items-center mb-2">
                                <div>
                                    <div className="h-3 w-32 bg-zinc-800 rounded mb-2"></div>
                                </div>
                                <div className="flex gap-2">
                                    <div className="h-8 w-8 rounded-full bg-zinc-800"></div>
                                </div>
                            </div>
                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="p-4 rounded-xl bg-zinc-900/50 border border-white/5 relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>
                                    <div className="h-4 w-12 bg-zinc-800 rounded mb-2"></div>
                                    <div className="text-lg font-bold text-white">Rp 15.250.000</div>
                                </div>
                                <div className="p-4 rounded-xl bg-zinc-900/50 border border-white/5">
                                    <div className="h-4 w-12 bg-zinc-800 rounded mb-2"></div>
                                    <div className="text-lg font-bold text-emerald-500">+Rp 8.5M</div>
                                </div>
                                <div className="p-4 rounded-xl bg-zinc-900/50 border border-white/5">
                                    <div className="h-4 w-12 bg-zinc-800 rounded mb-2"></div>
                                    <div className="text-lg font-bold text-rose-500">-Rp 3.2M</div>
                                </div>
                            </div>
                             {/* Chart Area */}
                            <div className="flex-1 bg-zinc-900/30 border border-white/5 rounded-xl p-4 relative overflow-hidden">
                                <div className="absolute inset-x-0 bottom-0 top-10 opacity-40">
                                    <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="w-full h-full">
                                        <path d="M0,40 L0,30 C10,25 20,35 30,20 C40,5 50,25 60,15 C70,5 80,10 90,5 L100,0 L100,40 Z" fill="url(#grad)" />
                                        <defs>
                                            <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                                                <stop offset="0%" stopColor="#f97316" stopOpacity="0.5" />
                                                <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
                                            </linearGradient>
                                        </defs>
                                        <path d="M0,30 C10,25 20,35 30,20 C40,5 50,25 60,15 C70,5 80,10 90,5 L100,0" stroke="#f97316" strokeWidth="0.5" fill="none" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </RevealOnScroll>
         </div>
      </section>

      {/* --- INFINITE MARQUEE --- */}
      <div className="py-8 bg-black border-y border-white/10 overflow-hidden relative">
         <div className="flex gap-16 animate-marquee whitespace-nowrap min-w-full">
            {[...t.marquee, ...t.marquee, ...t.marquee].map((item, i) => (
                <div key={i} className="text-zinc-500 font-bold text-xl uppercase tracking-widest flex items-center gap-16">
                    {item}
                    <div className="w-2 h-2 rounded-full bg-orange-500/50"></div>
                </div>
            ))}
         </div>
         {/* Gradient Fade for Marquee */}
         <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#050505] to-transparent z-10"></div>
         <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#050505] to-transparent z-10"></div>
      </div>

      {/* --- IMAGE-FIRST BENTO GRID FEATURES --- */}
      <section className="py-32 px-6 bg-[#0a0a0a]">
          <div className="max-w-7xl mx-auto">
             <RevealOnScroll className="text-center mb-20">
                <h2 className="text-4xl md:text-5xl font-bold mb-4">{t.features.title}</h2>
                <p className="text-zinc-400 text-lg">{t.features.subtitle}</p>
             </RevealOnScroll>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
                 
                 {/* 1. Analytics (Large) */}
                 <RevealOnScroll className="md:col-span-2 row-span-1">
                    <BentoCard 
                        title={t.features.bento.analytics}
                        desc={t.features.bento.analyticsDesc}
                        imgSrc="/feature-analytics.png"
                        className="h-full"
                    />
                 </RevealOnScroll>

                 {/* 2. Security (Small) */}
                 <RevealOnScroll className="md:col-span-1">
                     <BentoCard 
                        title={t.features.bento.secure}
                        desc={t.features.bento.secureDesc}
                        imgSrc="/feature-security.png"
                        className="h-full"
                    />
                 </RevealOnScroll>

                 {/* 3. Speed/Mobile (Small) */}
                 <RevealOnScroll className="md:col-span-1">
                     <BentoCard 
                        title={t.features.bento.speed}
                        desc={t.features.bento.speedDesc}
                        imgSrc="/feature-speed.png"
                        className="h-full"
                    />
                 </RevealOnScroll>

                 {/* 4. Budget (Large) */}
                 <RevealOnScroll className="md:col-span-2">
                     <BentoCard 
                        title={t.features.bento.budget}
                        desc={t.features.bento.budgetDesc}
                        imgSrc="/feature-budget.png"
                        className="h-full"
                    />
                 </RevealOnScroll>
             </div>
          </div>
      </section>

      {/* --- REDESIGNED IDENTITY SECTION (Glassmorphism Profile Card) --- */}
      <section className="py-32 px-6 bg-zinc-950 relative overflow-hidden">
          {/* Subtle Grid Bg */}
          <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none"></div>

          {/* Stroke Parallax Text (Subtler) */}
          <div 
             className="absolute top-10 left-10 text-[10vw] font-black text-transparent leading-none select-none pointer-events-none transition-transform duration-100 ease-linear opacity-20"
             style={{ WebkitTextStroke: '1px #3f3f46', transform: `translateX(${offset * 0.1}px)` }}
          >
              DEVELOPER
          </div>

          <div className="relative z-10 max-w-5xl mx-auto">
              <RevealOnScroll>
                  <div className="text-center mb-16">
                      <h2 className="text-3xl md:text-5xl font-bold mb-4">{t.about.title}</h2>
                      <div className="h-1 w-20 bg-orange-500 mx-auto rounded-full"></div>
                  </div>
              </RevealOnScroll>

              <RevealOnScroll className="delay-200">
                  <div className="bg-zinc-900/40 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl overflow-hidden relative group">
                      
                      {/* Glow FX */}
                      <div className="absolute -top-[20%] -right-[20%] w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[100px] group-hover:bg-orange-500/20 transition-all duration-700"></div>

                      <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
                          
                          {/* Left: Photo with Ring */}
                          <div className="shrink-0 relative">
                              <div className="w-48 h-48 md:w-64 md:h-64 rounded-full p-2 border-2 border-dashed border-orange-500/30 relative">
                                  <div className="absolute inset-0 rounded-full border border-orange-500/50 animate-spin-slow"></div>
                                  <div className="w-full h-full rounded-full overflow-hidden border-4 border-zinc-900 bg-zinc-800 relative z-10 group-hover:scale-105 transition-transform duration-500">
                                      <img 
                                        src="/me.jpg" 
                                        onError={(e) => e.currentTarget.src = "https://api.dicebear.com/7.x/avataaars/svg?seed=Gilang&backgroundColor=18181b"}
                                        alt="M. Gilang Alghipari" 
                                        className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500"
                                      />
                                  </div>
                              </div>
                              <div className="absolute bottom-4 right-4 bg-zinc-900 border border-white/10 px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                  {t.about.status}
                              </div>
                          </div>

                          {/* Right: Info */}
                          <div className="text-center md:text-left flex-1 space-y-6">
                              <div>
                                  <div className="text-orange-500 font-bold tracking-widest text-sm uppercase mb-2">{t.about.badge}</div>
                                  <h3 className="text-4xl md:text-5xl font-bold text-white tracking-tight">{t.about.name}</h3>
                                  <p className="text-xl text-zinc-400 mt-2 font-medium">{t.about.role}</p>
                              </div>

                              <p className="text-lg text-zinc-300 leading-relaxed max-w-2xl mx-auto md:mx-0">
                                  {t.about.bio}
                              </p>

                              {/* Tech Stack Mini-Grid */}
                              <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-2">
                                  <BadgeIcon icon={<Code size={14} />} label="React" />
                                  <BadgeIcon icon={<Database size={14} />} label="Supabase" />
                                  <BadgeIcon icon={<Layout size={14} />} label="Tailwind" />
                                  <BadgeIcon icon={<Smartphone size={14} />} label="PWA" />
                              </div>

                              <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-4">
                                  <SocialButton icon={<Github size={20} />} label={t.about.social.gh} href="https://github.com/Gilang657" />
                                  <SocialButton icon={<Instagram size={20} />} label={t.about.social.ig} href="#" />
                                  <SocialButton icon={<Linkedin size={20} />} label={t.about.social.li} href="#" />
                              </div>
                          </div>
                      </div>
                  </div>
              </RevealOnScroll>
          </div>
      </section>

      {/* --- TECH STACK SECTION --- */}
      <section className="py-24 px-6 border-t border-white/5 bg-[#0a0a0a]">
          <div className="max-w-6xl mx-auto">
              <RevealOnScroll className="text-center mb-16">
                  <h2 className="text-3xl font-bold mb-4">{t.tech.title}</h2>
                  <p className="text-zinc-500">{t.tech.desc}</p>
              </RevealOnScroll>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <RevealOnScroll className="delay-0"><TechCard icon={<Code />} title="React + Vite" desc={t.tech.items.react} /></RevealOnScroll>
                  <RevealOnScroll className="delay-100"><TechCard icon={<Layout />} title="Tailwind CSS" desc={t.tech.items.tw} /></RevealOnScroll>
                  <RevealOnScroll className="delay-200"><TechCard icon={<Database />} title="Supabase" desc={t.tech.items.sb} /></RevealOnScroll>
                  <RevealOnScroll className="delay-300"><TechCard icon={<Smartphone />} title="Responsive" desc={t.tech.items.resp} /></RevealOnScroll>
              </div>
          </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-zinc-600 text-sm border-t border-white/5 bg-black">
          <RevealOnScroll>
             <p>&copy; 2025 M. Gilang Alghipari. {t.footer}</p>
          </RevealOnScroll>
      </footer>
    </div>
  );
};

// --- HELPER COMPONENTS ---

const BadgeIcon = ({ icon, label }: { icon: React.ReactNode, label: string }) => (
    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-zinc-300 text-xs font-medium hover:bg-white/10 hover:border-white/20 transition-all cursor-default">
        {icon} {label}
    </div>
);

const SocialButton = ({ icon, label, href }: { icon: React.ReactNode, label: string, href: string }) => (
    <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center gap-3 px-6 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-300 hover:text-white hover:border-orange-500/50 hover:bg-zinc-900 transition-all group"
    >
        <span className="group-hover:scale-110 transition-transform duration-300 text-orange-500">{icon}</span>
        <span className="font-semibold">{label}</span>
        <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity -ml-1" />
    </a>
);

const BentoCard = ({ title, desc, imgSrc, className = "" }: { title: string, desc: string, imgSrc: string, className?: string }) => (
    <div className={`group relative overflow-hidden rounded-3xl bg-zinc-900/40 border border-white/5 hover:bg-zinc-900/60 hover:border-orange-500/20 transition-all duration-500 ${className}`}>
        
        {/* Image Container with 3D Tilt Effect */}
        <div className="absolute inset-0 z-0 overflow-hidden">
             {/* The image is offset and rotated, then straightens on hover */}
            <div className="absolute top-[20%] -left-[10%] w-[120%] h-[120%] transform rotate-6 translate-y-12 group-hover:rotate-0 group-hover:translate-y-0 group-hover:left-0 group-hover:top-0 group-hover:w-full group-hover:h-full transition-all duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)]">
                 <img 
                    src={imgSrc} 
                    onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                    alt={title} 
                    className="w-full h-full object-cover object-left-top opacity-50 group-hover:opacity-100 transition-opacity duration-500 shadow-2xl" 
                 />
                 {/* Fallback Placeholder (shown if image fails load) */}
                 <div className="hidden absolute inset-0 bg-zinc-900 flex flex-col items-center justify-center text-zinc-600 text-xs font-mono p-4 text-center border border-white/5">
                    <div className="mb-2 p-2 bg-white/5 rounded-full"><Layout /></div>
                    <span className="opacity-50">Image not found:</span>
                    <span className="text-orange-500 font-bold mt-1">{imgSrc}</span>
                 </div>
            </div>
        </div>
        
        {/* Content Overlay */}
        <div className="relative z-10 p-8 h-full flex flex-col justify-end pointer-events-none bg-gradient-to-t from-black/90 via-black/40 to-transparent">
            <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">{title}</h3>
                <p className="text-zinc-300 text-sm max-w-xs drop-shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">{desc}</p>
            </div>
        </div>
    </div>
);

const FloatingElement = ({ children, className }: { children: React.ReactNode, className: string }) => (
    <div className={`absolute ${className}`}>
        {children}
    </div>
);

const TechCard = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
    <div className="p-6 rounded-xl bg-zinc-900/50 border border-white/5 hover:border-orange-500/30 transition-colors group text-center md:text-left h-full">
        <div className="mb-4 text-zinc-400 group-hover:text-orange-500 transition-colors inline-block">{icon}</div>
        <div className="font-bold text-white mb-1">{title}</div>
        <div className="text-xs text-zinc-500">{desc}</div>
    </div>
);
