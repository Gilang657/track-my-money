import React, { useState, useEffect } from 'react';
import { Code, Database, Layout, Smartphone, Github, Instagram, Linkedin, Globe, Wallet, PieChart, Coins, CreditCard, ExternalLink, ArrowRight } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';

// --- Reusable Component for Framer Motion Reveal ---
const RevealOnScroll = ({ children, className = "", delay = 0 }: { children: React.ReactNode, className?: string, delay?: number }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: delay, ease: "easeOut" }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

// --- GTA VI Style Directional Scroll Reveal ---
interface ScrollSlideInProps {
    direction: 'left' | 'right' | 'up';
    children: React.ReactNode;
    className?: string;
    delay?: number;
}

const ScrollSlideIn = ({ direction, children, className = "", delay = 0 }: ScrollSlideInProps) => {
    const variants = {
        hidden: {
            x: direction === 'left' ? -150 : direction === 'right' ? 150 : 0,
            y: direction === 'up' ? 100 : 0,
            opacity: 0
        },
        visible: {
            x: 0,
            y: 0,
            opacity: 1,
            transition: {
                type: "spring" as const,
                damping: 20,
                stiffness: 100,
                delay: delay
            }
        }
    };

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={variants}
            className={className}
        >
            {children}
        </motion.div>
    );
};

export const LandingPage = ({ onStart }: { onStart: () => void }) => {
  const [lang, setLang] = useState<'id' | 'en'>('id'); // Default ID
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);

  const CONTENT = {
    id: {
      nav: { signIn: "Masuk", start: "Mulai Demo" },
      hero: {
        titlePrefix: "Kendalikan",
        titleSuffix: "Uang Anda.",
        desc: "Kelola dan optimalkan keuangan pribadi Anda melalui sistem analisis yang terstruktur, akurat, dan mudah digunakan",
        ctaMain: "Coba Gratis Sekarang",
        ctaSec: "Lihat Kode"
      },
      marquee: [
        "Real-time Analytics", "Aman & Privat", "Tanpa Iklan", "Mobile First", "Export CSV", "Smart Budgeting", "Multi-Currency", "Dark Mode"
      ],
      features: {
        title: "Satu Akun. Semua Perangkat.",
        subtitle: "Pengalaman finansial yang mulus di Desktop dan Mobile.",
        desktop: {
            title: "Kontrol Penuh di Desktop",
            desc: "Nikmati dashboard luas dengan analitik mendetail di layar besar Anda. Ideal untuk perencanaan bulanan."
        },
        mobile: {
            title: "Desain Mobile First",
            desc: "Kelola keuangan saat bepergian. Navigasi satu jempol yang terasa seperti aplikasi native."
        },
        analytics: {
            title: "Analitik Cerdas",
            desc: "Grafik interaktif yang memahami pola belanja Anda."
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
        title: "One Account. Any Device.",
        subtitle: "A seamless financial experience across Desktop and Mobile.",
        desktop: {
            title: "Full Control on Desktop",
            desc: "Experience the full dashboard with detailed analytics on your big screen. Perfect for deep dives."
        },
        mobile: {
            title: "Mobile First Design",
            desc: "Manage finances on the go with a native-app feel. Optimized for one-thumb navigation."
        },
        analytics: {
            title: "Smart Analytics",
            desc: "Interactive charts that understand your spending patterns."
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
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 w-full z-50 px-6 py-4 flex justify-between items-center bg-black/70 backdrop-blur-lg border-b border-white/5"
      >
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
      </motion.nav>

      {/* --- HERO SECTION --- */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
         
         {/* Video Background */}
         <div className="absolute inset-0 w-full h-full z-0">
             <video 
                 autoPlay 
                 loop 
                 muted 
                 playsInline 
                 className="w-full h-full object-cover"
             >
                 <source src="/3.mp4" type="video/mp4" />
                 {/* Fallback color if video fails */}
                 <div className="w-full h-full bg-[#050505]"></div>
             </video>
             
             {/* Dark Overlay for Text Readability */}
             <div className="absolute inset-0 bg-black/60 z-10"></div>
             
             {/* Gradient Fade to connect with next section naturally */}
             <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#050505] to-transparent z-10"></div>
         </div>

         <div className="relative z-20 text-center max-w-4xl mx-auto space-y-8 px-6 pt-20">
            <RevealOnScroll delay={0.1}>
                <h1 className="text-5xl sm:text-6xl md:text-8xl font-serif tracking-tight text-white leading-[1.1] drop-shadow-2xl">
                {t.hero.titlePrefix} <br/> 
                <span className="italic font-light text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-200">{t.hero.titleSuffix}</span>
                </h1>
            </RevealOnScroll>
            
            <RevealOnScroll delay={0.3}>
                <p className="text-lg md:text-xl text-zinc-300 max-w-2xl mx-auto font-light leading-relaxed drop-shadow-lg">
                {t.hero.desc}
                </p>
            </RevealOnScroll>
            
            <RevealOnScroll delay={0.5}>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
                <button onClick={onStart} className="w-full sm:w-auto px-8 py-4 bg-orange-500 text-white rounded-full font-bold text-lg hover:bg-orange-600 transition-all animate-pulse-glow hover:scale-105 active:scale-95 shadow-lg shadow-orange-900/50">
                    {t.hero.ctaMain}
                </button>
                <button onClick={onStart} className="w-full sm:w-auto px-8 py-4 border border-zinc-500 bg-white/5 backdrop-blur-sm rounded-full font-medium text-zinc-200 hover:text-white hover:bg-white/10 transition-all">
                    {t.hero.ctaSec}
                </button>
                </div>
            </RevealOnScroll>
         </div>

         {/* Floating Elements (3D Depth) - HIDDEN ON MOBILE to prevent text overlap */}
         <div className="absolute inset-0 pointer-events-none overflow-hidden max-w-7xl mx-auto hidden md:block z-10">
             <FloatingElement className="top-[20%] left-[5%] animate-float-slow delay-0">
                 <div className="p-4 bg-zinc-900/60 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl transform -rotate-12">
                     <Wallet className="w-8 h-8 text-orange-500" />
                 </div>
             </FloatingElement>
             <FloatingElement className="top-[25%] right-[8%] animate-float-medium delay-1000">
                 <div className="p-4 bg-zinc-900/60 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl transform rotate-6">
                     <PieChart className="w-8 h-8 text-emerald-500" />
                 </div>
             </FloatingElement>
             <FloatingElement className="bottom-[20%] left-[10%] animate-float-fast delay-500">
                 <div className="p-4 bg-zinc-900/60 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl transform rotate-12">
                     <Coins className="w-8 h-8 text-yellow-500" />
                 </div>
             </FloatingElement>
              <FloatingElement className="bottom-[30%] right-[15%] animate-float-slow delay-200">
                 <div className="p-4 bg-zinc-900/60 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl transform -rotate-6">
                     <CreditCard className="w-8 h-8 text-purple-500" />
                 </div>
             </FloatingElement>
         </div>

         {/* Dashboard Mockup (3D Tilt) */}
         <motion.div 
            initial={{ opacity: 0, scale: 0.8, rotateX: 40 }}
            whileInView={{ opacity: 1, scale: 0.9, rotateX: 20 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="relative mt-24 w-full max-w-5xl perspective-1000 group hover:scale-100 hover:rotate-x-0 transition-transform duration-1000 z-20"
         >
            <div className="relative rounded-xl border border-white/10 bg-[#09090b]/80 backdrop-blur-xl shadow-2xl shadow-orange-900/20 p-2">
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
         </motion.div>
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

      {/* --- REFACTORED FEATURES SECTION (DEVICE SHOWCASE) --- */}
      <section className="py-32 px-6 bg-[#0a0a0a]">
          <div className="max-w-7xl mx-auto">
             <RevealOnScroll className="text-center mb-20">
                <h2 className="text-4xl md:text-5xl font-bold mb-4">{t.features.title}</h2>
                <p className="text-zinc-400 text-lg max-w-2xl mx-auto">{t.features.subtitle}</p>
             </RevealOnScroll>

             {/* Bento Grid with Device Frames */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 
                 {/* Card 1: Desktop (Wide) */}
                 <ScrollSlideIn direction="left" className="md:col-span-2 min-h-[400px] md:min-h-[500px]" delay={0.1}>
                    <FeatureCard 
                        title={t.features.desktop.title}
                        desc={t.features.desktop.desc}
                    >
                         <LaptopMockup imgSrc="/1.png" />
                    </FeatureCard>
                 </ScrollSlideIn>

                 {/* Card 2: Mobile (Tall - Vertical) */}
                 <ScrollSlideIn direction="right" className="md:col-span-1 md:row-span-2 min-h-[500px]" delay={0.2}>
                     <FeatureCard 
                        title={t.features.mobile.title}
                        desc={t.features.mobile.desc}
                        className="h-full"
                    >
                        <PhoneMockup imgSrc="/2.png" />
                    </FeatureCard>
                 </ScrollSlideIn>

                 {/* Card 3: Analytics (Wide to fill gap) */}
                 <ScrollSlideIn direction="up" className="md:col-span-2 min-h-[300px]" delay={0.3}>
                     <FeatureCard 
                        title={t.features.analytics.title}
                        desc={t.features.analytics.desc}
                        className="flex flex-col md:flex-row items-center !p-0"
                     >
                        {/* Text Side */}
                        <div className="p-8 md:w-1/2 z-10">
                            <h3 className="text-2xl font-bold text-white mb-2">{t.features.analytics.title}</h3>
                            <p className="text-zinc-400 text-sm leading-relaxed">{t.features.analytics.desc}</p>
                            <div className="mt-4 text-orange-500 font-medium flex items-center gap-2 cursor-pointer hover:underline">
                                Explore Analytics <ArrowRight size={16}/>
                            </div>
                        </div>
                        {/* Visual Side */}
                        <div className="flex-1 w-full h-full relative min-h-[200px] overflow-hidden bg-gradient-to-br from-zinc-900 to-black/50">
                             <div className="absolute inset-4 opacity-80">
                                 {/* CSS Chart */}
                                 <div className="flex items-end gap-2 h-full w-full pb-4 px-4">
                                    {[30, 50, 40, 70, 50, 80, 60, 90, 70, 100].map((h, i) => (
                                        <div 
                                            key={i} 
                                            className="flex-1 bg-orange-500/20 rounded-t-sm hover:bg-orange-500 transition-all duration-300 relative group"
                                            style={{ height: `${h}%` }}
                                        >
                                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                                {h}%
                                            </div>
                                        </div>
                                    ))}
                                 </div>
                             </div>
                        </div>
                    </FeatureCard>
                 </ScrollSlideIn>
             </div>
          </div>
      </section>

      {/* --- REDESIGNED IDENTITY SECTION (Glassmorphism Profile Card) --- */}
      <section className="py-32 px-6 bg-zinc-950 relative overflow-hidden">
          {/* Subtle Grid Bg */}
          <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none"></div>

          {/* Stroke Parallax Text via Framer Motion */}
          <motion.div 
             style={{ x: y2, WebkitTextStroke: '1px #3f3f46' }}
             className="absolute top-10 left-10 text-[10vw] font-black text-transparent leading-none select-none pointer-events-none opacity-20"
          >
              DEVELOPER
          </motion.div>

          <div className="relative z-10 max-w-5xl mx-auto">
              <RevealOnScroll>
                  <div className="text-center mb-16">
                      <h2 className="text-3xl md:text-5xl font-bold mb-4">{t.about.title}</h2>
                      <div className="h-1 w-20 bg-orange-500 mx-auto rounded-full"></div>
                  </div>
              </RevealOnScroll>

              <RevealOnScroll delay={0.2}>
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
                                        src="https://github.com/Gilang657.png" 
                                        onError={(e) => {
                                            e.currentTarget.src = "https://api.dicebear.com/7.x/avataaars/svg?seed=Gilang&backgroundColor=18181b";
                                        }}
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
                  <RevealOnScroll delay={0}><TechCard icon={<Code />} title="React + Vite" desc={t.tech.items.react} /></RevealOnScroll>
                  <RevealOnScroll delay={0.1}><TechCard icon={<Layout />} title="Tailwind CSS" desc={t.tech.items.tw} /></RevealOnScroll>
                  <RevealOnScroll delay={0.2}><TechCard icon={<Database />} title="Supabase" desc={t.tech.items.sb} /></RevealOnScroll>
                  <RevealOnScroll delay={0.3}><TechCard icon={<Smartphone />} title="Responsive" desc={t.tech.items.resp} /></RevealOnScroll>
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

const FeatureCard = ({ title, desc, className = "", children }: { title: string, desc: string, className?: string, children: React.ReactNode }) => (
    <div className={`relative overflow-hidden rounded-3xl bg-zinc-900/50 border border-white/10 group shadow-lg ${className}`}>
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        
        {/* Only show default text layout if not customized (like Analytics card) */}
        {!className.includes('!p-0') && (
            <div className="relative z-10 p-8 pb-0 flex flex-col h-full">
                <div className="mb-6 z-20">
                    <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed max-w-sm">{desc}</p>
                </div>
                <div className="flex-1 relative flex items-end justify-center">
                    {children}
                </div>
            </div>
        )}
        {/* Render children directly if custom layout is used */}
        {className.includes('!p-0') && children}
    </div>
);

const LaptopMockup = ({ imgSrc }: { imgSrc: string }) => (
    <div className="relative w-[90%] mx-auto translate-y-6 group-hover:translate-y-2 transition-transform duration-700 ease-out z-10">
        {/* Lid */}
        <div className="relative bg-[#1a1a1a] rounded-t-xl border border-zinc-700 p-2 shadow-2xl ring-1 ring-white/5">
            {/* Screen */}
            <div className="bg-black rounded-lg overflow-hidden aspect-[16/10] relative border border-white/5">
                 <img 
                    src={imgSrc} 
                    alt="Desktop Demo"
                    className="w-full h-full object-cover object-top"
                    onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                 />
                 {/* Fallback */}
                 <div className="hidden absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
                    <Layout className="w-16 h-16 text-zinc-700" />
                 </div>
            </div>
            {/* Camera Dot */}
            <div className="absolute top-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-black rounded-full ring-1 ring-zinc-700"></div>
        </div>
        {/* Base */}
        <div className="absolute -bottom-3 inset-x-0 h-3 bg-[#2a2a2a] rounded-b-xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)] border-t border-black/50 mx-4"></div>
    </div>
);

const PhoneMockup = ({ imgSrc }: { imgSrc: string }) => (
    <div className="relative w-[65%] sm:w-[55%] mx-auto translate-y-8 group-hover:translate-y-4 transition-transform duration-700 ease-out z-10">
        <div className="bg-[#1a1a1a] rounded-[2.5rem] p-2 border border-zinc-700 shadow-2xl ring-1 ring-white/5">
            <div className="bg-black rounded-[2rem] overflow-hidden aspect-[9/19] relative border-[4px] border-black">
                 <img 
                    src={imgSrc} 
                    alt="Mobile Demo"
                    className="w-full h-full object-cover object-top"
                    onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                 />
                 {/* Fallback */}
                 <div className="hidden absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
                    <Smartphone className="w-12 h-12 text-zinc-700" />
                 </div>
                 
                 {/* Notch */}
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-b-2xl z-20 flex justify-center items-start pt-1">
                    <div className="w-12 h-1.5 bg-zinc-800/50 rounded-full"></div>
                 </div>
                 
                 {/* Home Indicator */}
                 <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1/3 h-1 bg-white/20 rounded-full z-20"></div>
            </div>
            {/* Side Buttons */}
            <div className="absolute top-20 -right-1 w-1 h-8 bg-zinc-700 rounded-r-md"></div>
            <div className="absolute top-20 -left-1 w-1 h-8 bg-zinc-700 rounded-l-md"></div>
            <div className="absolute top-32 -left-1 w-1 h-12 bg-zinc-700 rounded-l-md"></div>
        </div>
    </div>
);

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
