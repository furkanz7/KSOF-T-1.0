import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Layout } from './components/Layout';
import { Button } from './components/Button';
import { Input } from './components/Input';
import { generateWorkoutPlan, generateNutritionPlan, suggestChefMeal, findNearbyGyms } from './services/geminiService';
import { Screen, UserStats, WorkoutPlan, NutritionPlan, MealSuggestion, Gym, HistoryLog } from './types';
import { 
  Loader2, ChevronLeft, User, LogOut, Dumbbell, Utensils, 
  Check, X, Settings, Lightbulb,
  History, Sparkles, ChefHat,
  MapPin, Star, Scale,
  Timer, RotateCcw, Zap, Search, Edit2, ChevronRight, Crown, ChevronDown, Flame, Activity, Calendar, Save, Battery, Moon, Quote
} from 'lucide-react';

// --- TYPES & CONSTANTS ---

type Language = 'en' | 'tr';
type ThemeColor = 'blue' | 'emerald' | 'violet' | 'rose' | 'amber';

const TRANSLATIONS = {
  en: {
    welcome: "Welcome back,",
    subtitle: "Your legacy is built daily.",
    complete_profile: "Complete Setup",
    complete_profile_desc: "Unlock your AI plans.",
    create_workout: "New Workout",
    create_workout_desc: "AI-generated split.",
    nutrition_plan: "Nutrition",
    nutrition_plan_desc: "Macros & meal prep.",
    active_plans: "My Plans",
    workout: "Workout",
    diet: "Diet",
    profile: "Profile",
    edit_details: "Edit Details",
    settings: "Settings",
    sign_out: "Sign Out",
    save_changes: "Save Changes",
    biometrics: "Biometrics",
    first_name: "First Name",
    last_name: "Last Name",
    theme: "App Theme",
    language: "Language",
    appearance: "Appearance",
    back: "Back",
    login_btn: "Sign In",
    create_account: "Create Account",
    join_now: "Sign Up",
    weekly_avail: "Weekly Availability",
    primary_goal: "Primary Goal",
    generate_workout: "Generate Workout Plan",
    dietary_pref: "Dietary Preferences",
    generate_diet: "Generate Diet Plan",
    days: "Days",
    view_plan: "View Plan",
    premium_title: "PRO Suite",
    premium_desc: "Unlock advanced AI tools.",
    select_exercise: "Select Exercise",
    current_weight: "Weight (kg)",
    current_reps: "Reps",
    analyze_btn: "Analyze Potential",
    est_1rm: "Est. 1RM",
    next_target: "Next Target",
    pro_badge: "PRO",
    no_history: "No plans yet. Create one above!",
    created_at: "Created",
    tab_predictor: "Predictor",
    tab_chef: "Smart Chef",
    chef_placeholder: "Enter exact ingredients (e.g. 5 Eggs, 200g Chicken breast)...",
    chef_btn: "Cook It",
    chef_desc: "Strict recipe generator using ONLY what you have.",
    coach_tip: "COACH TIP",
    tip_increase: "Increase weight! You're ready.",
    tip_maintain: "Great intensity. Keep pushing.",
    macro_breakdown: "Macro Breakdown",
    chef_suggestion: "Chef's Plate",
    find_gyms: "Nearby Gyms",
    locating: "Locating gyms nearby...",
    hydration: "Hydration",
    streak: "Day Streak",
    daily_challenge: "Daily Challenge",
    challenge_complete: "Challenge Complete",
    reflex_trainer: "Reflex Trainer",
    reflex_desc: "Test your reaction time.",
    start_reflex: "Start",
    wait_reflex: "Wait...",
    click_reflex: "TAP!",
    too_early: "Too Early!",
    best_time: "Best: ",
    login_subtitle: "Killer Skinny Obese Fit",
    login_quote: "Break The Cycle. Push The Limits. Rebuild Yourself.",
    no_account: "Don't have an account?",
    has_account: "Already have an account?",
    bmi_calc: "BMI Calculator",
    body_fat: "Body Fat Est.",
    search_gym_placeholder: "Enter city (e.g. New York)",
    search_btn: "Search",
    add_ingredient: "Add",
    ing_name: "Food Name",
    ing_amount: "Amount (g)",
    calculate: "Calculate",
    bmi_result: "Your BMI",
    underweight: "Underweight",
    normal: "Normal",
    overweight: "Overweight",
    obese: "Obese",
    timer: "Workout Timer",
    stopwatch: "Stopwatch",
    start: "Start",
    stop: "Stop",
    reset: "Reset",
    select_ex_placeholder: "Choose movement...",
    calorie_logic: "AI calculates TDEE based on your stats.",
    biometric_summary: "Biometric Summary",
    finish_save: "Finish & Save",
    saved_to_history: "Saved to History!",
    history_title: "Activity History",
    no_logs: "No completed activities yet.",
    view_history: "View History",
    recovery_status: "Recovery Status",
    sleep_hours: "Sleep (Hours)",
    soreness_level: "Soreness (1-10)",
    calc_recovery: "Check Readiness",
    readiness_score: "Readiness Score",
    go_hard: "GO HARD",
    take_easy: "TAKE IT EASY",
    recovery_tip: "Based on your sleep & soreness.",
    daily_motivation: "Daily Fuel",
    new_quote: "New Quote"
  },
  tr: {
    welcome: "Tekrar hoşgeldin,",
    subtitle: "Mirasın her gün inşa ediliyor.",
    complete_profile: "Kurulumu Tamamla",
    complete_profile_desc: "Yapay zeka planlarını aç.",
    create_workout: "Yeni Antrenman",
    create_workout_desc: "AI destekli program.",
    nutrition_plan: "Beslenme",
    nutrition_plan_desc: "Makro ve yemek planı.",
    active_plans: "Planlarım",
    workout: "Antrenman",
    diet: "Diyet",
    profile: "Profil",
    edit_details: "Bilgileri Düzenle",
    settings: "Ayarlar",
    sign_out: "Çıkış Yap",
    save_changes: "Değişiklikleri Kaydet",
    biometrics: "Vücut Ölçüleri",
    first_name: "Ad",
    last_name: "Soyad",
    theme: "Uygulama Teması",
    language: "Dil",
    appearance: "Görünüm",
    back: "Geri",
    login_btn: "Giriş Yap",
    create_account: "Hesap Oluştur",
    join_now: "Kayıt Ol",
    weekly_avail: "Haftalık Müsaitlik",
    primary_goal: "Ana Hedef",
    generate_workout: "Antrenman Planı Oluştur",
    dietary_pref: "Beslenme Tercihleri",
    generate_diet: "Diyet Planı Oluştur",
    days: "Gün",
    view_plan: "Planı Gör",
    premium_title: "PRO Araçlar",
    premium_desc: "Gelişmiş AI araçlarını kullan.",
    select_exercise: "Hareket Seç",
    current_weight: "Ağırlık (kg)",
    current_reps: "Tekrar",
    analyze_btn: "Potansiyeli Analiz Et",
    est_1rm: "Tahmini 1RM",
    next_target: "Sonraki Hedef",
    pro_badge: "PRO",
    no_history: "Henüz plan yok. Yukarıdan oluştur!",
    created_at: "Oluşturuldu",
    tab_predictor: "Tahminci",
    tab_chef: "Akıllı Şef",
    chef_placeholder: "Tam malzemeleri girin (örn. 5 Yumurta, 200g Tavuk)...",
    chef_btn: "Pişir",
    chef_desc: "Sadece elindekileri kullanarak tarif oluşturur.",
    coach_tip: "KOÇ İPUCU",
    tip_increase: "Ağırlığı arttır! Hazırsın.",
    tip_maintain: "Harika yoğunluk. Devam et.",
    macro_breakdown: "Besin Dağılımı",
    chef_suggestion: "Şefin Tabağı",
    find_gyms: "Yakındaki Spor Salonları",
    locating: "Konum taranıyor...",
    hydration: "Su Tüketimi",
    streak: "Günlük Seri",
    daily_challenge: "Günlük Meydan Okuma",
    challenge_complete: "Tamamlandı",
    reflex_trainer: "Refleks Eğitimi",
    reflex_desc: "Reaksiyon hızını test et.",
    start_reflex: "Başla",
    wait_reflex: "Bekle...",
    click_reflex: "BAS!",
    too_early: "Erken!",
    best_time: "En İyi: ",
    login_subtitle: "Killer Skinny Obese Fit",
    login_quote: "Döngüyü Kır. Sınırları Zorla. Kendini Yeniden İnşa Et.",
    no_account: "Hesabın yok mu?",
    has_account: "Zaten hesabın var mı?",
    bmi_calc: "VKI Hesaplayıcı",
    body_fat: "Yağ Oranı Tahmini",
    search_gym_placeholder: "Şehir girin (örn. İstanbul)",
    search_btn: "Ara",
    add_ingredient: "Ekle",
    ing_name: "Besin (örn. Yumurta)",
    ing_amount: "Gramaj (örn. 200g)",
    calculate: "Hesapla",
    bmi_result: "Vücut Kitle Endeksin",
    underweight: "Zayıf",
    normal: "Normal",
    overweight: "Kilolu",
    obese: "Obez",
    timer: "Kronometre",
    stopwatch: "Zamanlayıcı",
    start: "Başla",
    stop: "Dur",
    reset: "Sıfırla",
    select_ex_placeholder: "Hareket seç...",
    calorie_logic: "AI, istatistiklerine göre kalori ihtiyacını hesaplar.",
    biometric_summary: "Vücut Özeti",
    finish_save: "Bitir & Kaydet",
    saved_to_history: "Geçmişe Kaydedildi!",
    history_title: "Aktivite Geçmişi",
    no_logs: "Henüz tamamlanmış aktivite yok.",
    view_history: "Geçmişi Gör",
    recovery_status: "Toparlanma Durumu",
    sleep_hours: "Uyku (Saat)",
    soreness_level: "Ağrı Seviyesi (1-10)",
    calc_recovery: "Hazırlığı Kontrol Et",
    readiness_score: "Hazırlık Skoru",
    go_hard: "YÜKLEN!",
    take_easy: "SAKİN OL",
    recovery_tip: "Uyku ve ağrı seviyene göre.",
    daily_motivation: "Günlük Motivasyon",
    new_quote: "Sözü Yenile"
  }
};

const QUOTES = {
  en: [
    "The body achieves what the mind believes.",
    "Pain is weakness leaving the body.",
    "Your only limit is you.",
    "Sweat is just fat crying.",
    "Don't stop when you're tired. Stop when you're done.",
    "Light weight baby! - Ronnie Coleman",
    "It never gets easier, you just get better.",
    "Discipline is doing what needs to be done, even if you don't want to do it.",
    "Suffer the pain of discipline or suffer the pain of regret.",
    "The only bad workout is the one that didn't happen."
  ],
  tr: [
    "Zihin inanırsa, vücut başarır.",
    "Acı, vücudu terk eden zayıflıktır.",
    "Tek limitin sensin.",
    "Ter, ağlayan yağlardır.",
    "Yorulduğunda durma. Bittiğinde dur.",
    "Hafif siklet bebek! - Ronnie Coleman",
    "Asla kolaylaşmaz, sadece sen güçlenirsin.",
    "Disiplin, yapmak istemesen bile yapılması gerekeni yapmaktır.",
    "Ya disiplin acısını çekersin ya da pişmanlık.",
    "Tek kötü antrenman, hiç yapılmamış olandır."
  ]
};

const INITIAL_PROFILE: UserStats = {
  firstName: '',
  lastName: '',
  age: '',
  weight: '',
  height: '',
  gender: 'Male',
  daysPerWeek: '',
  goal: 'Lose Weight',
  foodPreferences: []
};

const LoadingView = ({ text }: { text: string }) => (
  <div className="flex flex-col items-center justify-center h-full">
    <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
    <p className="text-white text-sm font-bold animate-pulse">{text}</p>
  </div>
);

// --- DONUT CHART COMPONENT ---
const DonutChart = ({ p, c, f }: { p: number, c: number, f: number }) => {
  const total = p + c + f;
  const pPct = total > 0 ? (p / total) * 100 : 0;
  const cPct = total > 0 ? (c / total) * 100 : 0;
  const fPct = total > 0 ? (f / total) * 100 : 0;

  // SVG Calculations
  const radius = 40;
  const circumference = 2 * Math.PI * radius; // ~251.32
  
  const pDash = (pPct / 100) * circumference;
  const cDash = (cPct / 100) * circumference;
  const fDash = (fPct / 100) * circumference;

  const pOffset = 0;
  const cOffset = -pDash;
  const fOffset = -(pDash + cDash);

  return (
    <div className="flex items-center justify-around py-4">
      <div className="relative w-32 h-32 flex items-center justify-center">
        <svg width="128" height="128" viewBox="0 0 100 100" className="transform -rotate-90">
          <circle cx="50" cy="50" r={radius} stroke="#1e293b" strokeWidth="12" fill="none" />
          
          {total > 0 && (
            <>
              {/* Protein (Blue) */}
              <circle 
                cx="50" cy="50" r={radius} 
                stroke="#3b82f6" strokeWidth="12" fill="none"
                strokeDasharray={`${pDash} ${circumference}`}
                strokeDashoffset={pOffset}
              />
              
              {/* Carbs (Emerald) */}
              <circle 
                cx="50" cy="50" r={radius} 
                stroke="#10b981" strokeWidth="12" fill="none"
                strokeDasharray={`${cDash} ${circumference}`}
                strokeDashoffset={cOffset}
              />
              
              {/* Fats (Amber) */}
              <circle 
                cx="50" cy="50" r={radius} 
                stroke="#f59e0b" strokeWidth="12" fill="none"
                strokeDasharray={`${fDash} ${circumference}`}
                strokeDashoffset={fOffset}
              />
            </>
          )}
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-xl font-bold text-white">{total}g</span>
          <span className="text-[10px] text-gray-400">Total</span>
        </div>
      </div>

      <div className="space-y-3">
         <div className="flex items-center gap-2">
           <div className="w-3 h-3 rounded-full bg-blue-500" />
           <div>
             <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Protein</p>
             <p className="text-sm font-bold text-white">{p}g <span className="text-gray-500 font-normal">({Math.round(pPct)}%)</span></p>
           </div>
         </div>
         <div className="flex items-center gap-2">
           <div className="w-3 h-3 rounded-full bg-emerald-500" />
           <div>
             <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Carbs</p>
             <p className="text-sm font-bold text-white">{c}g <span className="text-gray-500 font-normal">({Math.round(cPct)}%)</span></p>
           </div>
         </div>
         <div className="flex items-center gap-2">
           <div className="w-3 h-3 rounded-full bg-amber-500" />
           <div>
             <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Fats</p>
             <p className="text-sm font-bold text-white">{f}g <span className="text-gray-500 font-normal">({Math.round(fPct)}%)</span></p>
           </div>
         </div>
      </div>
    </div>
  );
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('LOGIN');
  
  // Settings State
  const [lang, setLang] = useState<Language>('en');
  const [theme, setTheme] = useState<ThemeColor>('blue');

  // Data State
  const [userProfile, setUserProfile] = useState<UserStats>(INITIAL_PROFILE);
  const [gymSearchQuery, setGymSearchQuery] = useState('');
  const [locationError, setLocationError] = useState(false);

  // History Arrays
  const [workoutHistory, setWorkoutHistory] = useState<WorkoutPlan[]>([]);
  const [nutritionHistory, setNutritionHistory] = useState<NutritionPlan[]>([]);
  const [historyLogs, setHistoryLogs] = useState<HistoryLog[]>([]); // New Persisted History
  const [gyms, setGyms] = useState<Gym[]>([]);
  
  // Selection State (ID of the plan currently being viewed)
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  // Premium Widget State
  const [premiumTab, setPremiumTab] = useState<'PREDICTOR' | 'CHEF'>('PREDICTOR');
  
  // Predictor State
  const [predictorExercise, setPredictorExercise] = useState('');
  const [predictorWeight, setPredictorWeight] = useState('');
  const [predictorReps, setPredictorReps] = useState('');
  const [predictionResult, setPredictionResult] = useState<{oneRm: number, nextWeight: number, nextReps: number, tip?: string} | null>(null);
  const [showExerciseDropdown, setShowExerciseDropdown] = useState(false);

  // Chef State (Ingredient Builder)
  type Ingredient = { id: string; name: string; amount: string };
  const [chefIngredientsList, setChefIngredientsList] = useState<Ingredient[]>([]);
  const [chefIngName, setChefIngName] = useState('');
  const [chefIngAmount, setChefIngAmount] = useState('');
  const [chefSuggestion, setChefSuggestion] = useState<MealSuggestion | null>(null);
  const [isChefLoading, setIsChefLoading] = useState(false);

  // BMI Calculator State
  const [bmiWeight, setBmiWeight] = useState('');
  const [bmiHeight, setBmiHeight] = useState('');
  const [bmiResult, setBmiResult] = useState<string | null>(null);
  const [bmiCategory, setBmiCategory] = useState<string | null>(null);

  // Timer State
  const [timerTime, setTimerTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerIntervalRef = useRef<number | null>(null);

  // Recovery Manager State
  const [sleepHours, setSleepHours] = useState('');
  const [soreness, setSoreness] = useState('');
  const [recoveryScore, setRecoveryScore] = useState<number | null>(null);

  // Motivation State
  const [quote, setQuote] = useState('');

  // Reflex Game State
  const [reflexState, setReflexState] = useState<'idle' | 'waiting' | 'ready' | 'early' | 'finished'>('idle');
  const [reflexTime, setReflexTime] = useState<number | null>(null);
  const [reflexBest, setReflexBest] = useState<number | null>(null);
  const reflexTimerRef = useRef<number | null>(null);
  const reflexStartRef = useRef<number>(0);
  
  // Auth State
  const [authEmail, setAuthEmail] = useState('');
  const [authPass, setAuthPass] = useState('');
  const [authConfirmPass, setAuthConfirmPass] = useState('');
  const [authError, setAuthError] = useState('');

  // UI State
  const [isLoading, setIsLoading] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Helper for translations
  const t = (key: keyof typeof TRANSLATIONS['en']) => TRANSLATIONS[lang][key];

  // Initialize Quote
  useEffect(() => {
    handleNewQuote();
  }, [lang]);

  // Helper: Get Unique Exercises
  const availableExercises = useMemo(() => {
    const exercises = new Set<string>();
    workoutHistory.forEach(plan => {
      plan.schedule.forEach(day => {
        day.exercises.forEach(ex => exercises.add(ex.name));
      });
    });
    // Add some defaults if history is empty so the feature is visible
    if (exercises.size === 0) {
       ['Bench Press', 'Squat', 'Deadlift', 'Shoulder Press', 'Lat Pulldown', 'Dumbbell Curl'].forEach(e => exercises.add(e));
    }
    return Array.from(exercises).sort();
  }, [workoutHistory]);

  // --- HANDLERS ---

  const handleNewQuote = () => {
    const quotes = QUOTES[lang];
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote);
  };

  const handleNumericChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void, limit = 6) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= limit) setter(value);
  };

  const handleRegister = () => {
    if (!authEmail || !authPass || !authConfirmPass) return setAuthError("All fields required");
    if (authPass.length !== 6) return setAuthError("Password must be 6 digits");
    if (authPass !== authConfirmPass) return setAuthError("Passwords do not match");
    setAuthError("");
    setCurrentScreen('LOGIN');
    setAuthPass(''); setAuthConfirmPass('');
  };

  const handleLogin = () => {
    if (!authEmail || !authPass) return setAuthError("Enter email and password");
    if (authPass.length !== 6) return setAuthError("Password must be 6 digits");
    setAuthError("");
    if (!userProfile.firstName) {
      setCurrentScreen('DASHBOARD');
    } else {
      setCurrentScreen('DASHBOARD');
    }
  };

  const handleLogout = () => {
    setUserProfile(INITIAL_PROFILE);
    setWorkoutHistory([]);
    setNutritionHistory([]);
    setHistoryLogs([]);
    setShowProfileMenu(false);
    setAuthEmail('');
    setAuthPass('');
    setCurrentScreen('LOGIN');
  };

  const checkProfileBeforeAction = (targetScreen: Screen) => {
    if (!userProfile.firstName || !userProfile.weight || !userProfile.height) {
      alert("Please complete your profile first!");
      setCurrentScreen('PROFILE_EDIT');
    } else {
      setCurrentScreen(targetScreen);
    }
  };

  const handleEditProfile = () => {
    setShowProfileMenu(false);
    setCurrentScreen('PROFILE_EDIT');
  };

  const handleOpenSettings = () => {
    setShowProfileMenu(false);
    setCurrentScreen('SETTINGS');
  };

  const handleFindGyms = () => {
    setShowProfileMenu(false);
    setIsLoading(true);
    setLocationError(false);
    setCurrentScreen('NEARBY_GYMS');
    searchGymsWithGPS();
  };

  const searchGymsWithGPS = () => {
    setIsLoading(true);
    setGyms([]);
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            try {
                const results = await findNearbyGyms(position.coords.latitude, position.coords.longitude);
                setGyms(results);
            } catch (e) {
                setLocationError(true);
            } finally {
                setIsLoading(false);
            }
        }, (err) => {
            setLocationError(true);
            setIsLoading(false);
        });
    } else {
        setLocationError(true);
        setIsLoading(false);
    }
  };

  const searchGymsManual = async () => {
      if (!gymSearchQuery) return;
      setIsLoading(true);
      setLocationError(false);
      setGyms([]);
      try {
          const results = await findNearbyGyms(undefined, undefined, gymSearchQuery);
          setGyms(results);
      } catch (e) {
          alert("Could not find gyms.");
      } finally {
          setIsLoading(false);
      }
  };

  // --- LOGGING / HISTORY LOGIC ---
  const saveWorkoutLog = (plan: WorkoutPlan, dayIdx: number) => {
    const day = plan.schedule[dayIdx];
    const completedCount = day.exercises.filter(e => e.isCompleted).length;
    const totalCount = day.exercises.length;
    const rate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    const log: HistoryLog = {
      id: Date.now().toString(),
      date: Date.now(),
      type: 'WORKOUT',
      title: `${plan.planName} - ${day.day}`,
      completionRate: rate,
      details: { ...day }
    };

    setHistoryLogs(prev => [log, ...prev]);
    alert(t('saved_to_history'));
    setCurrentScreen('DASHBOARD');
  };

  const saveNutritionLog = (plan: NutritionPlan) => {
    const completedCount = plan.meals.filter(m => m.isCompleted).length;
    const totalCount = plan.meals.length;
    const rate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    const log: HistoryLog = {
      id: Date.now().toString(),
      date: Date.now(),
      type: 'NUTRITION',
      title: plan.planName,
      completionRate: rate,
      details: { ...plan }
    };

    setHistoryLogs(prev => [log, ...prev]);
    alert(t('saved_to_history'));
    setCurrentScreen('DASHBOARD');
  };

  // --- RECOVERY LOGIC ---
  const calculateRecovery = () => {
    const sleep = parseFloat(sleepHours) || 0;
    const sore = parseFloat(soreness) || 0;
    // Simple algorithm: Base 100 - (10-sleep)*10 - (sore*5)
    
    // Normalize Sleep (Max credit 8h)
    let score = 100;
    if (sleep < 8) score -= (8 - sleep) * 12;
    if (sore > 0) score -= sore * 5;
    
    if (score < 0) score = 0;
    if (score > 100) score = 100;
    
    setRecoveryScore(Math.round(score));
  };

  // --- WORKOUT LOGIC ---
  const generateWorkout = async () => {
    setIsLoading(true);
    setCurrentScreen('WORKOUT_RESULT');
    try {
      const plan = await generateWorkoutPlan(userProfile);
      const newPlan: WorkoutPlan = {
        ...plan,
        id: Date.now().toString(),
        createdAt: Date.now()
      };
      setWorkoutHistory(prev => [newPlan, ...prev]);
      setSelectedPlanId(newPlan.id);
    } catch (e) {
      alert("Failed to generate workout.");
      setCurrentScreen('WORKOUT_SETUP');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleExercise = (planId: string, dayIdx: number, exIdx: number) => {
    setWorkoutHistory(prev => prev.map(plan => {
      if (plan.id !== planId) return plan;
      const newSchedule = [...plan.schedule];
      const exercise = newSchedule[dayIdx].exercises[exIdx];
      exercise.isCompleted = !exercise.isCompleted;
      return { ...plan, schedule: newSchedule };
    }));
  };

  // --- NUTRITION LOGIC ---
  const toggleFoodPref = (pref: string) => {
    const current = userProfile.foodPreferences || [];
    const updated = current.includes(pref) 
      ? current.filter(p => p !== pref)
      : [...current, pref];
    setUserProfile({ ...userProfile, foodPreferences: updated });
  };

  const generateNutrition = async () => {
    setIsLoading(true);
    setCurrentScreen('NUTRITION_RESULT');
    try {
      const plan = await generateNutritionPlan(userProfile);
      const newPlan: NutritionPlan = {
        ...plan,
        id: Date.now().toString(),
        createdAt: Date.now()
      };
      setNutritionHistory(prev => [newPlan, ...prev]);
      setSelectedPlanId(newPlan.id);
    } catch (e) {
      alert("Failed to generate nutrition plan.");
      setCurrentScreen('NUTRITION_SETUP');
    } finally {
      setIsLoading(false);
    }
  };

  // --- SMART CHEF LOGIC ---
  const addIngredient = () => {
    if (!chefIngName || !chefIngAmount) return;
    setChefIngredientsList(prev => [...prev, { id: Date.now().toString(), name: chefIngName, amount: chefIngAmount }]);
    setChefIngName('');
    setChefIngAmount('');
  };

  const removeIngredient = (id: string) => {
    setChefIngredientsList(prev => prev.filter(i => i.id !== id));
  };

  const handleSmartChef = async () => {
    if (chefIngredientsList.length === 0) return;
    setIsChefLoading(true);
    setChefSuggestion(null);
    const ingredientsString = chefIngredientsList.map(i => `${i.amount} ${i.name}`).join(', ');

    try {
      const suggestion = await suggestChefMeal(userProfile, ingredientsString);
      setChefSuggestion(suggestion);
    } catch (e) {
      alert("Chef is busy. Try again.");
    } finally {
      setIsChefLoading(false);
    }
  };

  const toggleMeal = (planId: string, mealIdx: number) => {
    setNutritionHistory(prev => prev.map(plan => {
      if (plan.id !== planId) return plan;
      const newMeals = [...plan.meals];
      newMeals[mealIdx].isCompleted = !newMeals[mealIdx].isCompleted;
      return { ...plan, meals: newMeals };
    }));
  };

  // --- BMI CALCULATOR LOGIC ---
  const calculateBMI = () => {
    if (!bmiWeight || !bmiHeight) return;
    const w = parseFloat(bmiWeight);
    const h = parseFloat(bmiHeight) / 100;
    if (h === 0) return;
    const bmi = w / (h * h);
    setBmiResult(bmi.toFixed(1));

    let cat = '';
    if (bmi < 18.5) cat = t('underweight');
    else if (bmi < 25) cat = t('normal');
    else if (bmi < 30) cat = t('overweight');
    else cat = t('obese');
    setBmiCategory(cat);
  };

  // --- TIMER LOGIC ---
  const toggleTimer = () => {
    if (isTimerRunning) {
      if (timerIntervalRef.current) window.clearInterval(timerIntervalRef.current);
      setIsTimerRunning(false);
    } else {
      setIsTimerRunning(true);
      const startTime = Date.now() - timerTime;
      timerIntervalRef.current = window.setInterval(() => {
        setTimerTime(Date.now() - startTime);
      }, 10);
    }
  };

  const resetTimer = () => {
    if (timerIntervalRef.current) window.clearInterval(timerIntervalRef.current);
    setIsTimerRunning(false);
    setTimerTime(0);
  };

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) window.clearInterval(timerIntervalRef.current);
    };
  }, []);

  // --- PREDICTOR LOGIC ---
  const handlePredict = () => {
    if(!predictorWeight || !predictorReps) return;
    const w = parseFloat(predictorWeight);
    const r = parseFloat(predictorReps);
    
    const oneRm = w * (1 + r/30);
    const rawTarget = w * 1.025;
    let nextWeight = Math.round(rawTarget / 2.5) * 2.5;

    if (nextWeight <= w) {
        nextWeight = w + 2.5;
    }

    let nextReps = Math.floor(30 * ((oneRm / nextWeight) - 1));
    if (nextReps < 1) nextReps = 1;

    let tip = "";
    if (r >= 12) {
        tip = t('tip_increase');
    } else if (r <= 5) {
        tip = t('tip_maintain');
    } else {
        tip = "Perfect range. Add weight next time.";
    }
    
    setPredictionResult({
      oneRm: Math.round(oneRm),
      nextWeight: nextWeight,
      nextReps: nextReps,
      tip
    });
  };

  // --- REFLEX GAME LOGIC ---
  const startReflexGame = () => {
    if (reflexState === 'waiting') {
        clearTimeout(reflexTimerRef.current!);
        setReflexState('early');
        return;
    }
    if (reflexState === 'ready') {
        const endTime = Date.now();
        const diff = endTime - reflexStartRef.current;
        setReflexTime(diff);
        setReflexState('finished');
        if (reflexBest === null || diff < reflexBest) {
            setReflexBest(diff);
        }
        return;
    }
    if (reflexState === 'idle' || reflexState === 'finished' || reflexState === 'early') {
        setReflexState('waiting');
        setReflexTime(null);
        const randomDelay = Math.floor(Math.random() * 2500) + 1500;
        reflexTimerRef.current = window.setTimeout(() => {
            setReflexState('ready');
            reflexStartRef.current = Date.now();
        }, randomDelay);
    }
  };

  // --- RENDERERS ---

  const Header = ({ title, showBack = false }: { title: string, showBack?: boolean }) => (
    <div className="flex justify-between items-center mb-6 pt-2">
      <div className="flex items-center gap-3">
        {showBack && (
          <button 
            onClick={() => setCurrentScreen('DASHBOARD')} 
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-white/10 active:scale-95 transition-all"
          >
            <ChevronLeft size={20} className="text-white" />
          </button>
        )}
        {title === 'KSOFit' ? (
          <span className={`text-3xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-${theme}-400 to-white tracking-tighter`}>
            KF
          </span>
        ) : (
          <h2 className="text-xl font-bold text-white tracking-wide">{title}</h2>
        )}
      </div>
      
      {!['LOGIN', 'REGISTER'].includes(currentScreen) && (
        <button 
          onClick={() => setShowProfileMenu(true)}
          className={`w-11 h-11 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 border border-${theme}-500/30 flex items-center justify-center text-${theme}-400 hover:text-white hover:border-${theme}-400/50 shadow-lg shadow-black/20 transition-all active:scale-95`}
        >
          <User size={20} />
        </button>
      )}
    </div>
  );

  const renderProfileMenu = () => {
    if (!showProfileMenu) return null;
    return (
      <div className="absolute inset-0 z-50 flex">
        <div className="w-4/5 max-w-sm bg-[#0f172a] h-full shadow-2xl border-r border-white/10 flex flex-col relative z-50 animate-in slide-in-from-left duration-300 overflow-y-auto no-scrollbar">
          
          <div className="p-6 border-b border-white/5 flex justify-between items-center bg-slate-900/50">
            <h3 className="text-xl font-black italic text-white tracking-wider">{t('profile').toUpperCase()}</h3>
            <button 
              onClick={() => setShowProfileMenu(false)} 
              className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10"
            >
              <X size={18} />
            </button>
          </div>

          <div className="p-8 flex flex-col items-center border-b border-white/5 bg-gradient-to-b from-slate-900/50 to-transparent">
            <div className={`w-24 h-24 rounded-full bg-gradient-to-tr from-${theme}-600 to-white/20 p-[2px] mb-4 shadow-xl shadow-${theme}-900/20`}>
              <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
                 <span className="text-4xl font-bold text-white">
                   {userProfile.firstName ? userProfile.firstName[0].toUpperCase() : 'U'}
                 </span>
              </div>
            </div>
            <h4 className="text-xl font-bold text-white mb-1">
              {userProfile.firstName} {userProfile.lastName}
            </h4>
            <div className={`flex items-center gap-2 text-sm text-${theme}-300/80 font-medium`}>
              <span>{userProfile.age ? `${userProfile.age} YEARS` : 'AGE N/A'}</span>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <span>{userProfile.weight ? `${userProfile.weight} KG` : 'WEIGHT N/A'}</span>
            </div>
          </div>

          {/* Recovery Status Feature (New) */}
          <div className="px-6 pt-6">
             <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-4">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                   <Battery size={14} className="text-green-400" />
                   {t('recovery_status')}
                </h4>
                <div className="space-y-3">
                   <div className="flex gap-2">
                      <Input 
                        placeholder={t('sleep_hours')} 
                        className="text-sm py-2" 
                        value={sleepHours}
                        onChange={(e) => handleNumericChange(e, setSleepHours, 2)}
                      />
                      <Input 
                        placeholder={t('soreness_level')} 
                        className="text-sm py-2" 
                        value={soreness}
                        onChange={(e) => handleNumericChange(e, setSoreness, 2)}
                      />
                   </div>
                   <Button onClick={calculateRecovery} variant="secondary" className="py-2 text-sm w-full bg-slate-700 hover:bg-slate-600 text-white border-none">
                      {t('calc_recovery')}
                   </Button>
                   
                   {recoveryScore !== null && (
                      <div className="mt-2 text-center animate-in zoom-in">
                         <p className="text-3xl font-black text-white">{recoveryScore}%</p>
                         <p className={`text-xs font-bold ${recoveryScore > 70 ? 'text-green-400' : recoveryScore > 40 ? 'text-yellow-400' : 'text-red-400'}`}>
                            {recoveryScore > 70 ? t('go_hard') : t('take_easy')}
                         </p>
                      </div>
                   )}
                </div>
             </div>
          </div>

          <div className="p-6 space-y-3 flex-1">
            <button 
              onClick={() => { setShowProfileMenu(false); setCurrentScreen('HISTORY'); }}
              className={`w-full p-4 rounded-xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-between group hover:bg-purple-600/20 transition-all`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-purple-500/20 text-purple-400 group-hover:text-white transition-colors`}>
                  <Calendar size={18} />
                </div>
                <span className={`font-bold text-sm text-purple-100 group-hover:text-white`}>{t('view_history')}</span>
              </div>
              <ChevronRight size={16} className={`text-purple-500/50 group-hover:translate-x-1 transition-transform`} />
            </button>

            <button 
              onClick={handleEditProfile}
              className={`w-full p-4 rounded-xl bg-${theme}-600/10 border border-${theme}-500/20 flex items-center justify-between group hover:bg-${theme}-600/20 transition-all`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-${theme}-500/20 text-${theme}-400 group-hover:text-white transition-colors`}>
                  <Edit2 size={18} />
                </div>
                <span className={`font-bold text-sm text-${theme}-100 group-hover:text-white`}>{t('edit_details')}</span>
              </div>
              <ChevronRight size={16} className={`text-${theme}-500/50 group-hover:translate-x-1 transition-transform`} />
            </button>

            <button 
              onClick={() => { setShowProfileMenu(false); setCurrentScreen('BMI_CALCULATOR'); }}
              className={`w-full p-4 rounded-xl bg-teal-600/10 border border-teal-500/20 flex items-center justify-between group hover:bg-teal-600/20 transition-all`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-teal-500/20 text-teal-400 group-hover:text-white transition-colors`}>
                  <Scale size={18} />
                </div>
                <span className={`font-bold text-sm text-teal-100 group-hover:text-white`}>{t('bmi_calc')}</span>
              </div>
              <ChevronRight size={16} className={`text-teal-500/50 group-hover:translate-x-1 transition-transform`} />
            </button>

            <button 
              onClick={() => { setShowProfileMenu(false); setCurrentScreen('TIMER'); }}
              className={`w-full p-4 rounded-xl bg-orange-600/10 border border-orange-500/20 flex items-center justify-between group hover:bg-orange-600/20 transition-all`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-orange-500/20 text-orange-400 group-hover:text-white transition-colors`}>
                  <Timer size={18} />
                </div>
                <span className={`font-bold text-sm text-orange-100 group-hover:text-white`}>{t('timer')}</span>
              </div>
              <ChevronRight size={16} className={`text-orange-500/50 group-hover:translate-x-1 transition-transform`} />
            </button>
            
            <button 
              onClick={handleOpenSettings}
              className="w-full p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between group hover:bg-white/10 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white/10 text-gray-400 group-hover:text-white transition-colors">
                  <Settings size={18} />
                </div>
                <span className="font-bold text-sm text-gray-300 group-hover:text-white">{t('settings')}</span>
              </div>
              <ChevronRight size={16} className="text-white/20" />
            </button>
          </div>

          <div className="p-6 border-t border-white/5">
            <Button variant="outline" onClick={handleLogout} className="w-full flex items-center justify-center gap-2 border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50">
              <LogOut size={18} /> {t('sign_out')}
            </Button>
          </div>
        </div>
        <div className="flex-1 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setShowProfileMenu(false)} />
      </div>
    );
  };

  const renderDashboard = () => (
    <div className="flex flex-col h-full p-6 overflow-y-auto no-scrollbar pb-32">
      <Header title="KSOFit" />
      
      {/* Welcome Section */}
      <div className="mb-6">
        <h1 className="text-3xl font-black italic text-white mb-1">{t('welcome')} {userProfile.firstName || 'Guest'}</h1>
        <p className="text-gray-400 text-sm">{t('subtitle')}</p>
      </div>

      {/* Motivation Quote Section */}
      <div className="mb-6 animate-in slide-in-from-right duration-500">
         <div className="p-4 rounded-xl bg-gradient-to-r from-violet-900/40 to-slate-900 border border-violet-500/20 relative group">
             <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2 text-violet-400">
                   <Quote size={18} className="fill-current" />
                   <span className="text-[10px] font-bold uppercase tracking-wider">{t('daily_motivation')}</span>
                </div>
                <button onClick={handleNewQuote} className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors" title={t('new_quote')}>
                   <RotateCcw size={14} />
                </button>
             </div>
             <p className="text-white font-medium italic text-lg leading-snug pr-2">
                "{quote}"
             </p>
         </div>
      </div>

      {/* Main Actions */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <button 
          onClick={() => checkProfileBeforeAction('WORKOUT_SETUP')}
          className={`p-5 rounded-2xl bg-gradient-to-br from-${theme}-600 to-${theme}-800 border border-${theme}-500/30 relative overflow-hidden group shadow-lg shadow-${theme}-900/20`}
        >
           <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
              <Dumbbell size={64} />
           </div>
           <div className="relative z-10 flex flex-col items-start h-full justify-between">
              <div className="p-2 rounded-lg bg-white/10 mb-3">
                <Dumbbell size={20} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white leading-tight mb-1">{t('create_workout')}</h3>
                <p className="text-xs text-white/60">{t('create_workout_desc')}</p>
              </div>
           </div>
        </button>

        <button 
          onClick={() => checkProfileBeforeAction('NUTRITION_SETUP')}
          className="p-5 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 border border-emerald-500/30 relative overflow-hidden group shadow-lg shadow-emerald-900/20"
        >
           <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
              <Utensils size={64} />
           </div>
           <div className="relative z-10 flex flex-col items-start h-full justify-between">
              <div className="p-2 rounded-lg bg-white/10 mb-3">
                <Utensils size={20} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white leading-tight mb-1">{t('nutrition_plan')}</h3>
                <p className="text-xs text-white/60">{t('nutrition_plan_desc')}</p>
              </div>
           </div>
        </button>
      </div>

      {/* Quick Tools Row */}
      <div className="grid grid-cols-3 gap-3 mb-6">
         <button onClick={handleFindGyms} className="px-3 py-3 rounded-xl bg-slate-800/50 border border-white/5 flex flex-col items-center justify-center gap-2 hover:bg-slate-800 transition-colors">
            <MapPin size={20} className="text-indigo-400" />
            <span className="text-[10px] font-bold text-gray-300 text-center">{t('find_gyms')}</span>
         </button>
         <button onClick={() => setCurrentScreen('BMI_CALCULATOR')} className="px-3 py-3 rounded-xl bg-slate-800/50 border border-white/5 flex flex-col items-center justify-center gap-2 hover:bg-slate-800 transition-colors">
            <Scale size={20} className="text-teal-400" />
            <span className="text-[10px] font-bold text-gray-300 text-center">{t('bmi_calc')}</span>
         </button>
         <button onClick={() => setCurrentScreen('TIMER')} className="px-3 py-3 rounded-xl bg-slate-800/50 border border-white/5 flex flex-col items-center justify-center gap-2 hover:bg-slate-800 transition-colors">
            <Timer size={20} className="text-orange-400" />
            <span className="text-[10px] font-bold text-gray-300 text-center">{t('stopwatch')}</span>
         </button>
      </div>

      {/* Recent Activity / Plans */}
      <div className="mb-6">
         <div className="flex justify-between items-center mb-4">
             <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">{t('active_plans')}</h3>
             <button onClick={() => setCurrentScreen('HISTORY')} className="text-xs font-bold text-blue-400 hover:text-blue-300">
                {t('view_history')}
             </button>
         </div>
         
         {workoutHistory.length === 0 && nutritionHistory.length === 0 ? (
             <div className="p-6 rounded-2xl bg-white/5 border border-white/5 border-dashed flex flex-col items-center justify-center text-center">
                 <History size={24} className="text-gray-600 mb-2" />
                 <p className="text-gray-500 text-sm font-medium">{t('no_history')}</p>
             </div>
         ) : (
             <div className="space-y-3">
                 {workoutHistory.slice(0, 1).map(plan => (
                     <button 
                       key={plan.id} 
                       onClick={() => { setSelectedPlanId(plan.id); setCurrentScreen('WORKOUT_RESULT'); }}
                       className={`w-full p-4 rounded-xl bg-gradient-to-r from-${theme}-900/50 to-slate-900 border border-${theme}-500/20 flex justify-between items-center group`}
                     >
                        <div className="flex items-center gap-3">
                           <div className={`p-2 rounded-lg bg-${theme}-500/20 text-${theme}-400`}>
                              <Dumbbell size={18} />
                           </div>
                           <div className="text-left">
                              <p className="font-bold text-white text-sm">{plan.planName}</p>
                              <p className="text-[10px] text-gray-500">{new Date(plan.createdAt).toLocaleDateString()}</p>
                           </div>
                        </div>
                        <ChevronRight size={16} className="text-gray-600 group-hover:text-white transition-colors" />
                     </button>
                 ))}
                 {nutritionHistory.slice(0, 1).map(plan => (
                     <button 
                       key={plan.id} 
                       onClick={() => { setSelectedPlanId(plan.id); setCurrentScreen('NUTRITION_RESULT'); }}
                       className="w-full p-4 rounded-xl bg-gradient-to-r from-emerald-900/50 to-slate-900 border border-emerald-500/20 flex justify-between items-center group"
                     >
                        <div className="flex items-center gap-3">
                           <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                              <Utensils size={18} />
                           </div>
                           <div className="text-left">
                              <p className="font-bold text-white text-sm">{plan.planName}</p>
                              <p className="text-[10px] text-gray-500">{new Date(plan.createdAt).toLocaleDateString()}</p>
                           </div>
                        </div>
                        <ChevronRight size={16} className="text-gray-600 group-hover:text-white transition-colors" />
                     </button>
                 ))}
             </div>
         )}
      </div>

      {/* Pro Suite */}
      <div className="relative mb-6">
         {/* Premium Card Background */}
         <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl border border-white/10 shadow-2xl z-0" />
         
         <div className="relative z-10 p-5">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                    <Crown size={20} className="text-yellow-400" fill="currentColor" />
                    <h3 className="text-lg font-black italic text-white tracking-wide">{t('premium_title')}</h3>
                </div>
            </div>

            <div className="bg-black/30 p-1 rounded-2xl flex gap-1 mb-5">
                <button 
                  onClick={() => setPremiumTab('PREDICTOR')}
                  className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${premiumTab === 'PREDICTOR' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-gray-400 hover:text-white'}`}
                >
                  {t('tab_predictor')}
                </button>
                <button 
                  onClick={() => setPremiumTab('CHEF')}
                  className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${premiumTab === 'CHEF' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/50' : 'text-gray-400 hover:text-white'}`}
                >
                  {t('tab_chef')}
                </button>
            </div>

            <div className="min-h-[220px]">
                {premiumTab === 'PREDICTOR' ? (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                      
                       <div className="relative">
                           <button 
                             onClick={() => setShowExerciseDropdown(!showExerciseDropdown)}
                             className="w-full bg-slate-800/80 border border-white/10 rounded-xl px-4 py-3 text-left text-sm text-white flex justify-between items-center"
                           >
                              <span className={predictorExercise ? 'text-white' : 'text-gray-400'}>
                                {predictorExercise || t('select_ex_placeholder')}
                              </span>
                              <ChevronDown size={16} className="text-gray-400" />
                           </button>
                           
                           {showExerciseDropdown && (
                             <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-white/10 rounded-xl max-h-48 overflow-y-auto z-20 shadow-xl">
                                {availableExercises.map((ex, idx) => (
                                  <button
                                    key={idx}
                                    onClick={() => { setPredictorExercise(ex); setShowExerciseDropdown(false); }}
                                    className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-white/5 border-b border-white/5 last:border-0"
                                  >
                                    {ex}
                                  </button>
                                ))}
                             </div>
                           )}
                       </div>

                       <div className="flex gap-2">
                           <Input 
                             placeholder={t('current_weight')}
                             value={predictorWeight}
                             onChange={(e) => handleNumericChange(e, setPredictorWeight, 3)}
                             className="flex-1"
                           />
                           <div className="w-24">
                               <Input 
                                 placeholder={t('current_reps')}
                                 value={predictorReps}
                                 onChange={(e) => handleNumericChange(e, setPredictorReps, 2)}
                               />
                           </div>
                       </div>
                       
                       <Button onClick={handlePredict} fullWidth className="py-3 text-sm bg-gradient-to-r from-blue-600 to-blue-500 hover:to-blue-400 border-none shadow-blue-500/20">{t('analyze_btn')}</Button>
                       
                       {predictionResult && (
                           <div className="mt-4 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 animate-in fade-in zoom-in duration-300">
                               <div className="flex justify-between items-center mb-3 border-b border-white/5 pb-2">
                                   <div className="text-center">
                                       <p className="text-[10px] text-blue-300 font-bold uppercase">{t('est_1rm')}</p>
                                       <p className="text-xl font-black text-white">{predictionResult.oneRm}kg</p>
                                   </div>
                                   <div className="text-center">
                                       <p className="text-[10px] text-emerald-300 font-bold uppercase">{t('next_target')}</p>
                                       <p className="text-xl font-black text-white">{predictionResult.nextWeight}kg x {predictionResult.nextReps}</p>
                                   </div>
                               </div>
                               <p className="text-xs text-gray-300 italic text-center">"{predictionResult.tip}"</p>
                           </div>
                       )}
                    </div>
                ) : (
                    <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
                        <p className="text-xs text-gray-400 mb-2">{t('chef_desc')}</p>
                        
                        <div className="flex gap-2 items-center">
                            <div className="flex-1 space-y-2">
                                <Input 
                                  placeholder={t('ing_name')}
                                  value={chefIngName}
                                  onChange={(e) => setChefIngName(e.target.value)}
                                />
                                 <Input 
                                  placeholder={t('ing_amount')}
                                  value={chefIngAmount}
                                  onChange={(e) => setChefIngAmount(e.target.value)}
                                />
                            </div>
                            <button onClick={addIngredient} className="h-24 bg-emerald-600 px-4 rounded-xl text-white font-bold text-xs hover:bg-emerald-500 shadow-lg shadow-emerald-500/20 flex items-center justify-center">
                                {t('add_ingredient')}
                            </button>
                        </div>

                        {chefIngredientsList.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {chefIngredientsList.map(ing => (
                                    <span key={ing.id} className="text-[10px] bg-white/10 px-2 py-1 rounded-md text-gray-300 flex items-center gap-1">
                                        {ing.name} ({ing.amount})
                                        <button onClick={() => removeIngredient(ing.id)} className="text-red-400 hover:text-red-300 ml-1"><X size={10} /></button>
                                    </span>
                                ))}
                            </div>
                        )}

                        <Button onClick={handleSmartChef} fullWidth className="py-3 text-sm flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-500 border-none shadow-emerald-500/20" disabled={isChefLoading || chefIngredientsList.length === 0}>
                            {isChefLoading ? <Loader2 className="animate-spin" size={16} /> : <ChefHat size={16} />}
                            {t('chef_btn')}
                        </Button>

                        {chefSuggestion && (
                            <div className="mt-4 p-4 rounded-xl bg-emerald-900/20 border border-emerald-500/20 animate-in fade-in zoom-in duration-300">
                                 <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-bold text-white text-sm">{chefSuggestion.name}</h4>
                                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/20">{chefSuggestion.calories} kcal</span>
                                 </div>
                                 <p className="text-xs text-gray-400 mb-2">{chefSuggestion.description}</p>
                                 <div className="bg-black/20 rounded-lg p-2 mb-2">
                                     <p className="text-[10px] text-gray-500 font-mono">{chefSuggestion.protein}P • {chefSuggestion.carbs}C • {chefSuggestion.fats}F</p>
                                 </div>
                                 <div className="space-y-1">
                                     {chefSuggestion.instructions.slice(0, 3).map((step, idx) => (
                                         <div key={idx} className="flex gap-2 text-[10px] text-gray-300">
                                             <span className="text-emerald-500 font-bold">{idx + 1}.</span>
                                             <p>{step}</p>
                                         </div>
                                     ))}
                                 </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
         </div>
      </div>

      {/* Reflex Game Widget */}
      <div className="bg-gradient-to-br from-purple-900/40 to-slate-900 border border-purple-500/20 rounded-2xl p-5 relative overflow-hidden flex-shrink-0 min-h-[160px] flex flex-col justify-between mb-8">
          <div className="flex justify-between items-center relative z-10">
              <h3 className="font-bold text-purple-100 flex items-center gap-2">
                  <Zap size={16} className="text-purple-400" />
                  {t('reflex_trainer')}
              </h3>
              {reflexBest && <span className="text-xs font-mono text-purple-300">{t('best_time')}{reflexBest}ms</span>}
          </div>
          
          <button 
             onClick={startReflexGame}
             className={`w-full h-24 rounded-xl font-black text-2xl transition-all relative z-10 flex items-center justify-center border-b-4 active:border-b-0 active:translate-y-1 active:border-t-4 mt-4 ${
                 reflexState === 'idle' || reflexState === 'finished' ? 'bg-purple-600 border-purple-800 text-white hover:bg-purple-500' :
                 reflexState === 'waiting' ? 'bg-red-500 border-red-700 text-white' :
                 reflexState === 'ready' ? 'bg-emerald-500 border-emerald-700 text-white' :
                 'bg-yellow-500 border-yellow-700 text-white' // early
             }`}
          >
              {reflexState === 'idle' && (reflexTime ? `${reflexTime}ms` : t('start_reflex'))}
              {reflexState === 'finished' && `${reflexTime}ms`}
              {reflexState === 'waiting' && t('wait_reflex')}
              {reflexState === 'ready' && t('click_reflex')}
              {reflexState === 'early' && t('too_early')}
          </button>
      </div>
    </div>
  );

  return (
    <Layout backgroundImage={['LOGIN', 'REGISTER'].includes(currentScreen) ? "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2000&auto=format&fit=crop" : undefined}>
      {renderProfileMenu()}

      {currentScreen === 'LOGIN' && (
        <div className="flex flex-col h-full p-8 justify-center animate-in fade-in zoom-in duration-500">
           <div className="mb-8">
              <h1 className="text-5xl font-black italic text-white mb-2 tracking-tighter">KSOFit<span className={`text-${theme}-500`}>.</span></h1>
              <p className="text-gray-400 font-medium text-lg">{t('login_subtitle')}</p>
           </div>
           
           <div className="space-y-4 mb-8">
              <Input 
                placeholder="Email" 
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
              />
              <Input 
                type="password"
                placeholder="Password"
                value={authPass}
                onChange={(e) => setAuthPass(e.target.value)}
                error={authError}
              />
           </div>

           <Button onClick={handleLogin} fullWidth className={`mb-4 shadow-${theme}-900/20 bg-${theme}-600 hover:bg-${theme}-500`}>
             {t('login_btn')}
           </Button>

           <p className="text-center text-gray-400 text-sm">
             {t('no_account')} <button onClick={() => setCurrentScreen('REGISTER')} className={`text-${theme}-400 font-bold hover:text-${theme}-300 transition-colors`}>{t('join_now')}</button>
           </p>

           <div className="mt-12 p-6 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm">
              <p className="text-gray-400 italic text-center text-sm">"{t('login_quote')}"</p>
           </div>
        </div>
      )}

      {currentScreen === 'REGISTER' && (
        <div className="flex flex-col h-full p-8 justify-center animate-in slide-in-from-right duration-500">
           <Header title={t('create_account')} showBack />
           
           <div className="space-y-4 mb-8">
              <Input 
                placeholder="Email" 
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
              />
              <Input 
                type="password"
                placeholder="Password (6 digits)"
                value={authPass}
                onChange={(e) => handleNumericChange(e, setAuthPass)}
              />
              <Input 
                type="password"
                placeholder="Confirm Password"
                value={authConfirmPass}
                onChange={(e) => handleNumericChange(e, setAuthConfirmPass)}
                error={authError}
              />
           </div>

           <Button onClick={handleRegister} fullWidth className={`mb-4 shadow-${theme}-900/20 bg-${theme}-600 hover:bg-${theme}-500`}>
             {t('create_account')}
           </Button>
        </div>
      )}

      {currentScreen === 'DASHBOARD' && renderDashboard()}

      {currentScreen === 'PROFILE_EDIT' && (
        <div className="flex flex-col h-full p-6 animate-in slide-in-from-right duration-300 overflow-y-auto">
          <Header title={t('complete_profile')} showBack />
          
          <div className="space-y-5">
             <div className="grid grid-cols-2 gap-4">
               <Input label={t('first_name')} value={userProfile.firstName} onChange={(e) => setUserProfile({...userProfile, firstName: e.target.value})} />
               <Input label={t('last_name')} value={userProfile.lastName} onChange={(e) => setUserProfile({...userProfile, lastName: e.target.value})} />
             </div>

             <div className="grid grid-cols-3 gap-3">
               <Input label="Age" value={userProfile.age} onChange={(e) => handleNumericChange(e, (v) => setUserProfile({...userProfile, age: v}), 3)} />
               <Input label="Weight (kg)" value={userProfile.weight} onChange={(e) => handleNumericChange(e, (v) => setUserProfile({...userProfile, weight: v}), 3)} />
               <Input label="Height (cm)" value={userProfile.height} onChange={(e) => handleNumericChange(e, (v) => setUserProfile({...userProfile, height: v}), 3)} />
             </div>

             <div>
                <label className="block text-gray-400 text-xs font-bold mb-2 ml-1 uppercase tracking-wider">{t('primary_goal')}</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Lose Weight', 'Gain Weight', 'Recomp', 'Bulk'].map((g) => (
                    <button
                      key={g}
                      onClick={() => setUserProfile({...userProfile, goal: g as any})}
                      className={`p-3 rounded-xl border text-sm font-bold transition-all ${userProfile.goal === g ? `bg-${theme}-600 border-${theme}-500 text-white` : 'bg-slate-800 border-transparent text-gray-400 hover:bg-slate-700'}`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
             </div>

             <Input label={t('weekly_avail')} placeholder="e.g. 4" value={userProfile.daysPerWeek} onChange={(e) => handleNumericChange(e, (v) => setUserProfile({...userProfile, daysPerWeek: v}), 1)} />
             
             <Button onClick={() => setCurrentScreen('DASHBOARD')} fullWidth className={`mt-4 bg-${theme}-600 hover:bg-${theme}-500`}>
               {t('save_changes')}
             </Button>
          </div>
        </div>
      )}

      {currentScreen === 'HISTORY' && (
          <div className="flex flex-col h-full p-6 animate-in slide-in-from-right duration-300 overflow-y-auto">
              <Header title={t('history_title')} showBack />
              
              {historyLogs.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50 pb-20">
                      <History size={64} className="mb-4 text-gray-500" />
                      <p className="text-gray-400">{t('no_logs')}</p>
                  </div>
              ) : (
                  <div className="space-y-4 pb-12">
                      {historyLogs.sort((a, b) => b.date - a.date).map((log) => (
                          <div key={log.id} className="p-4 rounded-xl bg-slate-800/50 border border-white/5 flex flex-col gap-2">
                              <div className="flex justify-between items-center">
                                  <div className="flex items-center gap-2">
                                      {log.type === 'WORKOUT' ? (
                                          <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400">
                                              <Dumbbell size={16} />
                                          </div>
                                      ) : (
                                          <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                                              <Utensils size={16} />
                                          </div>
                                      )}
                                      <div>
                                          <h4 className="font-bold text-white text-sm">{log.title}</h4>
                                          <p className="text-[10px] text-gray-500">{new Date(log.date).toLocaleDateString()} • {new Date(log.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                      </div>
                                  </div>
                                  <div className={`px-2 py-1 rounded text-xs font-bold ${log.completionRate >= 80 ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                      {log.completionRate}%
                                  </div>
                              </div>
                          </div>
                      ))}
                  </div>
              )}
          </div>
      )}

      {currentScreen === 'WORKOUT_SETUP' && (
         <div className="flex flex-col h-full p-6 animate-in slide-in-from-right duration-300">
            <Header title={t('create_workout')} showBack />
            <div className="flex-1 flex flex-col justify-center items-center text-center space-y-6">
                <div className={`w-32 h-32 rounded-full bg-${theme}-500/10 flex items-center justify-center mb-4`}>
                   <Dumbbell size={48} className={`text-${theme}-500`} />
                </div>
                <h3 className="text-2xl font-bold text-white">{t('create_workout')}</h3>
                <p className="text-gray-400 max-w-xs">{t('create_workout_desc')}</p>
                <Button onClick={generateWorkout} fullWidth disabled={isLoading} className={`bg-${theme}-600 hover:bg-${theme}-500 shadow-${theme}-900/20`}>
                   {isLoading ? <Loader2 className="animate-spin mx-auto" /> : t('generate_workout')}
                </Button>
            </div>
         </div>
      )}

      {currentScreen === 'WORKOUT_RESULT' && (
        <div className="flex flex-col h-full p-6 animate-in slide-in-from-right duration-300 overflow-y-auto">
           <Header title={t('workout')} showBack />
           {isLoading ? <LoadingView text="Forging your legacy..." /> : (
             <div className="space-y-6 pb-24">
               {workoutHistory.filter(p => p.id === selectedPlanId).map(plan => (
                 <div key={plan.id}>
                    <div className={`p-4 rounded-xl bg-gradient-to-r from-${theme}-900/40 to-slate-900 border border-${theme}-500/20 mb-6`}>
                       <h3 className="text-xl font-bold text-white mb-2">{plan.planName}</h3>
                       <div className="flex flex-wrap gap-2">
                          {plan.nutritionTips.slice(0, 2).map((tip, idx) => (
                             <span key={idx} className={`text-[10px] px-2 py-1 rounded bg-${theme}-500/10 text-${theme}-300 border border-${theme}-500/10`}>
                               {tip}
                             </span>
                          ))}
                       </div>
                    </div>

                    <div className="space-y-4">
                       {plan.schedule.map((day, dayIdx) => (
                          <div key={dayIdx} className="bg-slate-800/50 rounded-xl p-4 border border-white/5">
                             <div className="flex justify-between items-center mb-3">
                                <h4 className={`font-bold text-${theme}-400`}>{day.day}</h4>
                                <span className="text-xs text-gray-400 bg-white/5 px-2 py-1 rounded">{day.focus}</span>
                             </div>
                             <div className="space-y-2 mb-4">
                                {day.exercises.map((ex, exIdx) => (
                                   <div key={exIdx} onClick={() => toggleExercise(plan.id, dayIdx, exIdx)} className={`p-3 rounded-lg border transition-all cursor-pointer flex items-center gap-3 ${ex.isCompleted ? 'bg-green-500/10 border-green-500/30' : 'bg-black/20 border-white/5 hover:bg-white/5'}`}>
                                      <div className={`w-5 h-5 rounded border flex items-center justify-center ${ex.isCompleted ? 'bg-green-500 border-green-500' : 'border-gray-500'}`}>
                                         {ex.isCompleted && <Check size={12} className="text-white" />}
                                      </div>
                                      <div className="flex-1">
                                         <p className={`font-bold text-sm ${ex.isCompleted ? 'text-green-400 line-through' : 'text-gray-200'}`}>{ex.name}</p>
                                         <p className="text-xs text-gray-500">{ex.sets} x {ex.reps} • {ex.tips}</p>
                                      </div>
                                   </div>
                                ))}
                             </div>
                             {/* Finish Button per Day */}
                             <Button 
                                variant="secondary" 
                                onClick={() => saveWorkoutLog(plan, dayIdx)}
                                className="w-full py-2 text-sm flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white border-none"
                             >
                                <Save size={14} /> {t('finish_save')}
                             </Button>
                          </div>
                       ))}
                    </div>
                 </div>
               ))}
             </div>
           )}
        </div>
      )}

      {currentScreen === 'NUTRITION_SETUP' && (
         <div className="flex flex-col h-full p-6 animate-in slide-in-from-right duration-300">
            <Header title={t('nutrition_plan')} showBack />
            <div className="flex-1 flex flex-col overflow-y-auto pb-10">
                
                {/* Biometric Summary Card */}
                <div className="bg-slate-800/50 rounded-2xl p-4 border border-white/5 mb-6">
                    <div className="flex items-center gap-2 mb-3">
                        <Activity size={16} className="text-emerald-400" />
                        <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider">{t('biometric_summary')}</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-[10px] text-gray-500">Weight & Height</p>
                            <p className="text-sm font-bold text-white">{userProfile.weight}kg • {userProfile.height}cm</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-500">Activity Level</p>
                            <p className="text-sm font-bold text-white">{userProfile.daysPerWeek} Days/Week</p>
                        </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-2">
                        <Flame size={14} className="text-orange-400" />
                        <p className="text-[10px] text-orange-200">{t('calorie_logic')}</p>
                    </div>
                </div>

                <div className="mb-6">
                   <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-3 ml-1">{t('primary_goal')}</h3>
                   <div className="grid grid-cols-2 gap-2">
                      {['Lose Weight', 'Gain Weight', 'Recomp', 'Bulk'].map((g) => (
                        <button
                          key={g}
                          onClick={() => setUserProfile({...userProfile, goal: g as any})}
                          className={`p-4 rounded-xl border text-sm font-bold transition-all ${userProfile.goal === g ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-900/40' : 'bg-slate-800 border-transparent text-gray-400 hover:bg-slate-700'}`}
                        >
                          {g}
                        </button>
                      ))}
                   </div>
                </div>

                <div className="mb-6">
                   <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-3 ml-1">{t('dietary_pref')}</h3>
                   <div className="flex flex-wrap gap-2">
                      {['High Protein', 'Keto', 'Vegan', 'Vegetarian', 'Paleo', 'Intermittent Fasting', 'Gluten Free', 'Dairy Free', 'Low Carb', 'Mediterranean', 'Pescatarian'].map(pref => (
                        <button
                          key={pref}
                          onClick={() => toggleFoodPref(pref)}
                          className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${userProfile.foodPreferences?.includes(pref) ? 'bg-emerald-600 border-emerald-500 text-white shadow-md' : 'bg-slate-800 border-white/10 text-gray-400 hover:border-emerald-500/50'}`}
                        >
                          {pref}
                        </button>
                      ))}
                   </div>
                </div>

                <div className="mt-auto pb-6">
                   <Button onClick={generateNutrition} fullWidth disabled={isLoading} className="bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20 py-4 text-lg">
                      {isLoading ? <Loader2 className="animate-spin mx-auto" /> : t('generate_diet')}
                   </Button>
                </div>
            </div>
         </div>
      )}

      {currentScreen === 'NUTRITION_RESULT' && (
         <div className="flex flex-col h-full p-6 animate-in slide-in-from-right duration-300 overflow-y-auto">
            <Header title={t('diet')} showBack />
            {isLoading ? <LoadingView text="Calculating optimal macros..." /> : (
              <div className="space-y-6 pb-24">
                 {nutritionHistory.filter(p => p.id === selectedPlanId).map(plan => (
                   <div key={plan.id}>
                      <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-900/40 to-slate-900 border border-emerald-500/20 mb-6">
                         <div className="flex justify-between items-center mb-2">
                           <h3 className="text-xl font-bold text-white">{plan.planName}</h3>
                           <span className="text-lg font-bold text-emerald-400">{plan.dailyCalories} kcal</span>
                         </div>
                         {plan.macroTargets && (
                           <DonutChart p={plan.macroTargets.protein} c={plan.macroTargets.carbs} f={plan.macroTargets.fats} />
                         )}
                      </div>

                      <div className="space-y-3 mb-6">
                         {plan.meals.map((meal, idx) => (
                           <div key={idx} onClick={() => toggleMeal(plan.id, idx)} className={`p-4 rounded-xl border transition-all cursor-pointer ${meal.isCompleted ? 'bg-emerald-900/20 border-emerald-500/30' : 'bg-slate-800/50 border-white/5 hover:bg-slate-800'}`}>
                              <div className="flex justify-between items-start mb-2">
                                 <div className="flex items-center gap-3">
                                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${meal.isCompleted ? 'bg-emerald-500 border-emerald-500' : 'border-gray-500'}`}>
                                       {meal.isCompleted && <Check size={12} className="text-white" />}
                                    </div>
                                    <h4 className={`font-bold ${meal.isCompleted ? 'text-emerald-400 line-through' : 'text-white'}`}>{meal.name}</h4>
                                 </div>
                                 <span className="text-xs font-mono text-gray-400">{meal.calories}</span>
                              </div>
                              <p className="text-xs text-gray-500 ml-8 mb-2">{meal.ingredients.join(', ')}</p>
                              <div className="ml-8 inline-block px-2 py-1 rounded bg-black/20 text-[10px] text-gray-400 font-mono">
                                {meal.macros}
                              </div>
                           </div>
                         ))}
                      </div>

                      <Button 
                        variant="primary" 
                        onClick={() => saveNutritionLog(plan)}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 flex items-center justify-center gap-2"
                      >
                        <Save size={18} /> {t('finish_save')}
                      </Button>
                   </div>
                 ))}
              </div>
            )}
         </div>
      )}

      {currentScreen === 'SETTINGS' && (
         <div className="flex flex-col h-full p-6 animate-in slide-in-from-right duration-300">
            <Header title={t('settings')} showBack />
            
            <div className="space-y-6">
               <div className="space-y-3">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">{t('language')}</h3>
                  <div className="grid grid-cols-2 gap-3">
                     <button onClick={() => setLang('en')} className={`p-3 rounded-xl border text-sm font-bold ${lang === 'en' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-800 border-white/10 text-gray-400'}`}>English</button>
                     <button onClick={() => setLang('tr')} className={`p-3 rounded-xl border text-sm font-bold ${lang === 'tr' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-800 border-white/10 text-gray-400'}`}>Türkçe</button>
                  </div>
               </div>

               <div className="space-y-3">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">{t('theme')}</h3>
                  <div className="flex gap-2">
                     {(['blue', 'emerald', 'violet', 'rose', 'amber'] as ThemeColor[]).map(c => (
                        <button 
                          key={c}
                          onClick={() => setTheme(c)}
                          className={`w-10 h-10 rounded-full bg-${c}-500 border-2 ${theme === c ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-50'} transition-all`}
                        />
                     ))}
                  </div>
               </div>
            </div>
         </div>
      )}

      {currentScreen === 'NEARBY_GYMS' && (
          <div className="flex flex-col h-full p-6 animate-in slide-in-from-right duration-300">
              <Header title={t('find_gyms')} showBack />
              
              <div className="flex gap-2 mb-4">
                  <Input 
                      placeholder={t('search_gym_placeholder')} 
                      value={gymSearchQuery}
                      onChange={(e) => setGymSearchQuery(e.target.value)}
                  />
                  <Button onClick={searchGymsManual} className="py-3 px-4">
                      <Search size={20} />
                  </Button>
              </div>

              {isLoading ? <LoadingView text={t('locating')} /> : (
                  <div className="flex-1 overflow-y-auto space-y-3 pb-12">
                      {locationError && (
                          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-4">
                              Could not access location. Please enable GPS or search by city.
                          </div>
                      )}
                      
                      {gyms.map((gym, idx) => (
                          <a 
                              key={idx} 
                              href={gym.uri} 
                              target="_blank" 
                              rel="noreferrer"
                              className="block p-4 rounded-xl bg-slate-800/50 border border-white/5 hover:bg-slate-800 transition-colors"
                          >
                              <div className="flex justify-between items-start mb-1">
                                  <h4 className="font-bold text-white">{gym.title}</h4>
                                  <div className="flex items-center gap-1 text-yellow-400">
                                      <Star size={14} fill="currentColor" />
                                      <span className="text-xs font-bold">{gym.rating || 'N/A'}</span>
                                  </div>
                              </div>
                              <p className="text-xs text-blue-400 flex items-center gap-1">
                                  <MapPin size={12} />
                                  {gym.address}
                              </p>
                          </a>
                      ))}
                      
                      {gyms.length === 0 && !locationError && (
                          <div className="text-center text-gray-500 mt-10">
                              <MapPin size={48} className="mx-auto mb-2 opacity-20" />
                              <p>No gyms found.</p>
                          </div>
                      )}
                  </div>
              )}
          </div>
      )}

      {currentScreen === 'BMI_CALCULATOR' && (
          <div className="flex flex-col h-full p-6 animate-in slide-in-from-right duration-300">
              <Header title={t('bmi_calc')} showBack />
              
              <div className="space-y-4">
                   <div className="grid grid-cols-2 gap-4">
                       <Input label="Weight (kg)" value={bmiWeight} onChange={(e) => handleNumericChange(e, setBmiWeight, 3)} />
                       <Input label="Height (cm)" value={bmiHeight} onChange={(e) => handleNumericChange(e, setBmiHeight, 3)} />
                   </div>
                   <Button onClick={calculateBMI} fullWidth>{t('calculate')}</Button>
              </div>

              {bmiResult && (
                  <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-teal-900/40 to-slate-900 border border-teal-500/20 text-center animate-in zoom-in duration-300">
                      <p className="text-sm text-teal-300 font-bold uppercase mb-2">{t('bmi_result')}</p>
                      <h2 className="text-5xl font-black text-white mb-2">{bmiResult}</h2>
                      <p className={`text-lg font-bold ${
                          bmiCategory === t('normal') ? 'text-green-400' : 
                          bmiCategory === t('overweight') ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                          {bmiCategory}
                      </p>
                  </div>
              )}
          </div>
      )}

      {currentScreen === 'TIMER' && (
          <div className="flex flex-col h-full p-6 animate-in slide-in-from-right duration-300">
              <Header title={t('stopwatch')} showBack />
              
              <div className="flex-1 flex flex-col items-center justify-center">
                   <div className="w-64 h-64 rounded-full border-4 border-orange-500/20 flex items-center justify-center relative mb-8">
                       <div className="absolute inset-0 rounded-full border-t-4 border-orange-500 animate-spin-slow opacity-50" />
                       <span className="text-5xl font-black text-white font-mono tracking-wider">
                           {formatTime(timerTime)}
                       </span>
                   </div>

                   <div className="grid grid-cols-2 gap-4 w-full">
                       <Button 
                         variant={isTimerRunning ? 'outline' : 'primary'} 
                         className={isTimerRunning ? 'border-red-500 text-red-500' : 'bg-orange-500 shadow-orange-500/20'}
                         onClick={toggleTimer}
                       >
                           {isTimerRunning ? t('stop') : t('start')}
                       </Button>
                       <Button variant="secondary" onClick={resetTimer}>
                           {t('reset')}
                       </Button>
                   </div>
              </div>
          </div>
      )}
    </Layout>
  );
}