
import React, { useState, useEffect, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { CourseHub } from './components/CourseHub';
import { HomePage } from './components/HomePage';
import { LoginPage } from './components/LoginPage';
import { SettingsModal } from './components/SettingsModal';
import { COURSES, HOME_PAGE_ID } from './constants';
import type { Course, User, Theme, FontSize, AccentColor, BotPersonality } from './types';
import { auth, onAuthStateChanged, signOut } from './firebase';
import { 
  syncUserProfile, 
  getUserProfile, 
  subscribeToCourses, 
  seedCourses 
} from './services/firebaseService';

// Color Palettes (RGB values)
const COLOR_PALETTES: Record<AccentColor, Record<number, string>> = {
  indigo: { 50: '238 242 255', 100: '224 231 255', 200: '199 210 254', 300: '165 180 252', 400: '129 140 248', 500: '99 102 241', 600: '79 70 229', 700: '67 56 202', 800: '55 48 163', 900: '49 46 129', 950: '30 27 75' },
  blue:   { 50: '239 246 255', 100: '219 234 254', 200: '191 219 254', 300: '147 197 253', 400: '96 165 250', 500: '59 130 246', 600: '37 99 235', 700: '29 78 216', 800: '30 64 175', 900: '30 58 138', 950: '23 37 84' },
  purple: { 50: '250 245 255', 100: '243 232 255', 200: '233 213 255', 300: '216 180 254', 400: '192 132 252', 500: '168 85 247', 600: '147 51 234', 700: '126 34 206', 800: '107 33 168', 900: '88 28 135', 950: '59 7 100' },
  emerald: { 50: '236 253 245', 100: '209 250 229', 200: '167 243 208', 300: '110 231 183', 400: '52 211 153', 500: '16 185 129', 600: '5 150 105', 700: '4 120 87', 800: '6 95 70', 900: '6 78 59', 950: '2 44 34' },
  rose:   { 50: '255 241 242', 100: '255 228 230', 200: '254 205 211', 300: '253 164 175', 400: '251 113 133', 500: '244 63 94', 600: '225 29 72', 700: '190 18 60', 800: '159 18 57', 900: '136 19 55', 950: '76 5 25' },
  amber:  { 50: '255 251 235', 100: '254 243 199', 200: '253 230 138', 300: '252 211 77', 400: '251 191 36', 500: '245 158 11', 600: '217 119 6', 700: '180 83 9', 800: '146 64 14', 900: '120 53 15', 950: '69 26 3' },
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [incompleteUser, setIncompleteUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>(HOME_PAGE_ID);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isBotSelectionOpen, setIsBotSelectionOpen] = useState(false);

  // Persistence State
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('theme') as Theme) || 'dark';
  });
  const [fontSize, setFontSize] = useState<FontSize>(() => {
    return (localStorage.getItem('fontSize') as FontSize) || 'medium';
  });
  const [accentColor, setAccentColor] = useState<AccentColor>(() => {
    return (localStorage.getItem('accentColor') as AccentColor) || 'indigo';
  });
  const [botPersonality, setBotPersonality] = useState<BotPersonality | null>(() => {
    return (localStorage.getItem('botPersonality') as BotPersonality) || null;
  });

  // Check for personality
  useEffect(() => {
    if (user && !botPersonality) {
        setIsBotSelectionOpen(true);
    }
  }, [user, botPersonality]);

  const handleSelectPersonality = (personality: BotPersonality) => {
      setBotPersonality(personality);
      localStorage.setItem('botPersonality', personality);
      setIsBotSelectionOpen(false);
  };

  // Firebase Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const profile = await getUserProfile(firebaseUser.uid);
        if (profile && profile.academicYear) {
          setUser(profile);
          setIncompleteUser(null);
        } else {
          setIncompleteUser({
            id: firebaseUser.uid,
            name: profile?.name || firebaseUser.displayName || '',
            picture: profile?.picture || firebaseUser.photoURL || `https://avatar.iran.liara.run/public?username=${firebaseUser.uid}`,
          });
          setUser(null);
        }
      } else {
        setUser(null);
        setIncompleteUser(null);
      }
      setIsAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  // Firestore Courses Listener & Seeding
  useEffect(() => {
    if (!isAuthReady || !user || !user.academicYear) return;

    // Sync courses to Firestore to ensure updates are applied
    // This will fail silently for non-admins due to our catch block in seedCourses
    seedCourses(COURSES).catch(e => console.warn("Could not seed courses (likely not admin):", e));

    const unsubscribe = subscribeToCourses(user.academicYear, (fetchedCourses) => {
      setCourses(fetchedCourses);
    });

    return () => unsubscribe();
  }, [isAuthReady, user]);

  // Apply Theme Effect
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Persist Font Size
  useEffect(() => {
    localStorage.setItem('fontSize', fontSize);
  }, [fontSize]);

  // Apply Accent Color
  useEffect(() => {
    const root = document.documentElement;
    const palette = COLOR_PALETTES[accentColor];
    
    // Inject CSS variables for primary color
    Object.entries(palette).forEach(([shade, value]) => {
      root.style.setProperty(`--color-primary-${shade}`, value as string);
    });

    localStorage.setItem('accentColor', accentColor);
  }, [accentColor]);

  // Determine global font size class
  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'small': return 'text-sm';
      case 'large': return 'text-lg';
      case 'medium':
      default: return 'text-base';
    }
  };

  const handleLogin = async (name: string, picture: string | null, academicYear: 'third' | 'fourth') => {
    if (!auth.currentUser) return;
    
    const updatedUser: User = {
      id: auth.currentUser.uid,
      name: name,
      picture: picture || auth.currentUser.photoURL || `https://avatar.iran.liara.run/public?username=${encodeURIComponent(name)}`,
      academicYear
    };
    setUser(updatedUser);
    setIncompleteUser(null);
    await syncUserProfile(updatedUser);
  };

  const handleLogout = async () => {
    await signOut(auth);
    setSelectedCourseId(HOME_PAGE_ID);
  };

  const handleUpdateUser = async (updatedUser: User) => {
    setUser(updatedUser);
    await syncUserProfile(updatedUser);
  };

  if (!isAuthReady) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage onLogin={handleLogin} incompleteUser={incompleteUser} />;
  }

  const selectedCourse = courses.find(c => c.id === selectedCourseId) as Course | undefined;

  return (
    <div className={`flex h-screen bg-[#f3f4f6] dark:bg-[#0b1021] text-gray-900 dark:text-gray-100 font-sans transition-all duration-300 ${getFontSizeClass()}`}>
      <Sidebar
        user={user}
        onLogout={handleLogout}
        onUpdateUser={handleUpdateUser}
        courses={courses}
        selectedCourseId={selectedCourseId}
        setSelectedCourseId={setSelectedCourseId}
        isExpanded={isSidebarExpanded}
        setIsExpanded={setIsSidebarExpanded}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />
      <main className="flex-1 overflow-y-auto transition-all duration-300 flex flex-col relative z-0">
        
        {/* Dashboard Ambient Lights */}
        <div className="absolute top-0 right-0 w-full h-[500px] bg-primary-500/10 dark:bg-primary-500/5 pointer-events-none -z-10 blur-[120px]"></div>
        <div className="absolute top-0 left-0 w-1/2 h-[500px] bg-indigo-500/10 dark:bg-indigo-500/5 pointer-events-none -z-10 blur-[120px]"></div>

        <div className="flex-1 z-10 flex flex-col">
          {selectedCourse ? (
            <CourseHub key={selectedCourse.id} course={selectedCourse} userName={user.name} botPersonality={botPersonality || 'bakkar'} />
          ) : (
            <HomePage 
              onSelectCourse={setSelectedCourseId} 
              userName={user.name} 
              courses={courses}
            />
          )}
        </div>
        
        {!selectedCourse && (
          <footer className="py-6 px-4 text-center border-t border-gray-200/50 dark:border-[#1a233a] bg-transparent backdrop-blur-sm z-10">
            <p className="text-sm text-gray-500 dark:text-[#64748b] font-medium">
              تم التطوير بواسطة <span className="text-primary-600 dark:text-primary-400 font-bold drop-shadow-sm">Dev Lido</span>
            </p>
          </footer>
        )}
      </main>

      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        theme={theme}
        setTheme={setTheme}
        fontSize={fontSize}
        setFontSize={setFontSize}
        accentColor={accentColor}
        setAccentColor={setAccentColor}
        user={user}
        onUpdateUser={handleUpdateUser}
        botPersonality={botPersonality || 'bakkar'}
        setBotPersonality={handleSelectPersonality}
      />

      {/* Bot Selection Modal */}
      {isBotSelectionOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md px-4">
            <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-2xl max-w-lg w-full text-center border border-gray-100 dark:border-gray-800">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">اختر شخصية المساعد الذكي</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-8">اختر الشخصية والصوت المفضل لك لتبدأ رحلتك التعليمية</p>
                
                <div className="grid grid-cols-2 gap-4">
                    <button 
                        onClick={() => handleSelectPersonality('bakkar')}
                        className="flex flex-col items-center p-6 border-2 border-gray-100 dark:border-gray-800 rounded-2xl hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all group"
                    >
                        <img src="https://j.top4top.io/p_37593ndpq1.png" alt="بكار" className="w-24 h-24 rounded-full mb-4 group-hover:scale-110 transition-transform shadow-md object-cover" />
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">بكار</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">أسلوب عملي ومرح</p>
                    </button>
                    <button 
                        onClick={() => handleSelectPersonality('hania')}
                        className="flex flex-col items-center p-6 border-2 border-gray-100 dark:border-gray-800 rounded-2xl hover:border-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all group"
                    >
                        <img src="https://h.top4top.io/p_3759u2ov61.png" alt="هنية" className="w-24 h-24 rounded-full mb-4 group-hover:scale-110 transition-transform shadow-md object-cover" />
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">هنية</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">أسلوب هادئ ومفصل</p>
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default App;
