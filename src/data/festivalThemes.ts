export type FestivalThemeId = 
  | 'auto'
  | 'monsoon'
  | 'independence'
  | 'diwali'
  | 'holi'
  | 'republic'
  | 'gandhi'
  | 'winter'
  | 'classic';

export interface FestivalThemeConfig {
  id: FestivalThemeId;
  name: string;
  subtitle: string;
  badge: string;
  icon: string;
  seasonText: string;
  quote: string;
  primaryColor: string; // Tailwind hex or class description
  accentColor: string;
  gradientBg: string;
  headerBorderGradient: string;
  activeLightBg: string;
  activeDarkBg: string;
  badgeColor: string;
  particleType: 'raindrops' | 'tiranga' | 'diyas' | 'gulal' | 'snow' | 'none';
  dateRangeDesc: string;
}

export const FESTIVAL_THEMES: Record<FestivalThemeId, FestivalThemeConfig> = {
  auto: {
    id: 'auto',
    name: 'Auto Seasonal (Real-Time)',
    subtitle: 'Automatically adapts to current Indian festival, monsoon & season based on live calendar',
    badge: '⚡ Live Calendar Sync',
    icon: '✨',
    seasonText: 'Real-time Season Detection Active',
    quote: 'Knowledge is the greatest festival of the mind. Keep learning every day!',
    primaryColor: '#4F46E5',
    accentColor: '#06B6D4',
    gradientBg: 'from-indigo-900/30 via-slate-900/20 to-slate-950',
    headerBorderGradient: 'from-indigo-500 via-purple-500 to-pink-500',
    activeLightBg: '#EEF2FF',
    activeDarkBg: '#1E1B4B',
    badgeColor: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border-indigo-300',
    particleType: 'none',
    dateRangeDesc: 'Adapts automatically year-round'
  },
  monsoon: {
    id: 'monsoon',
    name: 'Monsoon Study Vibe (Sawan Rains)',
    subtitle: 'Lush greenery, petrichor & refreshing cool rain aesthetics for focused monsoon study sessions',
    badge: '🌧️ Indian Monsoon (Sawan)',
    icon: '🌧️',
    seasonText: 'Monsoon Season • June to September',
    quote: 'Like raindrops nourish the earth, daily consistent revisions nurture your IAS dreams.',
    primaryColor: '#059669', // Emerald
    accentColor: '#0D9488', // Teal
    gradientBg: 'from-emerald-950/40 via-teal-950/30 to-slate-950',
    headerBorderGradient: 'from-emerald-400 via-teal-400 to-cyan-400',
    activeLightBg: '#ECFDF5',
    activeDarkBg: '#064E3B',
    badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-400',
    particleType: 'raindrops',
    dateRangeDesc: 'June 1 – September 30'
  },
  independence: {
    id: 'independence',
    name: 'Tiranga National Pride (15th August)',
    subtitle: 'Patriotic Saffron, White & Green harmony celebrating the Spirit of Indian Civil Services',
    badge: '🇮🇳 Independence Day Special',
    icon: '🇮🇳',
    seasonText: 'Independence Day & National Pride • August',
    quote: 'Satyameva Jayate: Truth alone triumphs. Dedicate your knowledge to nation building.',
    primaryColor: '#EA580C', // Saffron
    accentColor: '#16A34A', // Green
    gradientBg: 'from-orange-950/40 via-slate-900/30 to-emerald-950/30',
    headerBorderGradient: 'from-orange-500 via-white to-emerald-500',
    activeLightBg: '#FFF7ED',
    activeDarkBg: '#431407',
    badgeColor: 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300 border-orange-400',
    particleType: 'tiranga',
    dateRangeDesc: 'August 1 – August 31'
  },
  diwali: {
    id: 'diwali',
    name: 'Diwali Festival of Lights (Deepotsav)',
    subtitle: 'Radiant golden diyas & royal purple warmth illuminating your pathway to success',
    badge: '🪔 Diwali & Deepotsav Glow',
    icon: '🪔',
    seasonText: 'Festival of Lights • October to November',
    quote: 'Tamso Ma Jyotirgamaya: From darkness of doubts to the radiant light of knowledge.',
    primaryColor: '#D97706', // Amber Gold
    accentColor: '#7C3AED', // Purple
    gradientBg: 'from-amber-950/40 via-purple-950/30 to-slate-950',
    headerBorderGradient: 'from-amber-400 via-yellow-300 to-purple-500',
    activeLightBg: '#FEF3C7',
    activeDarkBg: '#451A03',
    badgeColor: 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 border-amber-400',
    particleType: 'diyas',
    dateRangeDesc: 'October 15 – November 25'
  },
  holi: {
    id: 'holi',
    name: 'Holi & Spring Colors (Vasant Utsav)',
    subtitle: 'Vibrant Gulal tones celebrating spring renewal, enthusiasm and positivity',
    badge: '🎨 Holi Spring Festival',
    icon: '🎨',
    seasonText: 'Spring & Holi Festival • March to April',
    quote: 'Fill your preparation with the vibrant colors of determination, courage, and perseverance.',
    primaryColor: '#DB2777', // Pink
    accentColor: '#EAB308', // Yellow
    gradientBg: 'from-pink-950/40 via-purple-950/30 to-yellow-950/20',
    headerBorderGradient: 'from-pink-500 via-purple-500 to-yellow-400',
    activeLightBg: '#FDF2F8',
    activeDarkBg: '#500724',
    badgeColor: 'bg-pink-100 text-pink-900 dark:bg-pink-950 dark:text-pink-300 border-pink-400',
    particleType: 'gulal',
    dateRangeDesc: 'March 1 – April 15'
  },
  republic: {
    id: 'republic',
    name: 'Republic Day & Constitution (26th January)',
    subtitle: 'Honoring the Constitution of India, fundamental rights, and civil services governance',
    badge: '📜 Republic Day & Samvidhan',
    icon: '🏛️',
    seasonText: 'Republic & Constitution Celebration • January',
    quote: 'We, the People of India: The Constitution is the holy book for every civil servant.',
    primaryColor: '#2563EB', // Royal Blue
    accentColor: '#16A34A', // Green
    gradientBg: 'from-blue-950/40 via-slate-900/30 to-emerald-950/30',
    headerBorderGradient: 'from-blue-500 via-sky-300 to-emerald-500',
    activeLightBg: '#EFF6FF',
    activeDarkBg: '#172554',
    badgeColor: 'bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-300 border-blue-400',
    particleType: 'tiranga',
    dateRangeDesc: 'January 15 – January 31'
  },
  gandhi: {
    id: 'gandhi',
    name: 'Gandhi Jayanti & Swachhta (2nd October)',
    subtitle: 'Khadi earth tones, truth, ethics & integrity for GS Paper IV and administrative values',
    badge: '🕊️ Gandhi Jayanti & Ahimsa',
    icon: '🕊️',
    seasonText: 'Gandhi Jayanti & National Ethics • October',
    quote: 'Be the change you wish to see in the world. Integrity is doing the right thing when no one is watching.',
    primaryColor: '#B45309', // Warm Khadi Ochre
    accentColor: '#4D7C0F', // Earth green
    gradientBg: 'from-amber-950/30 via-stone-900/30 to-slate-950',
    headerBorderGradient: 'from-amber-600 via-stone-400 to-emerald-600',
    activeLightBg: '#FEF3C7',
    activeDarkBg: '#292524',
    badgeColor: 'bg-stone-100 text-stone-900 dark:bg-stone-900 dark:text-stone-200 border-stone-400',
    particleType: 'none',
    dateRangeDesc: 'October 1 – October 10'
  },
  winter: {
    id: 'winter',
    name: 'Winter Focus & New Year Resolutions',
    subtitle: 'Cool frosted morning study vibes, hot chai aesthetic & resolution streak builder',
    badge: '❄️ Winter Focus & New Year',
    icon: '❄️',
    seasonText: 'Winter Study Sprint • December to January',
    quote: 'Winter mornings test discipline. Those who master early hours conquer the prelims.',
    primaryColor: '#0284C7', // Sky Blue
    accentColor: '#6366F1', // Indigo
    gradientBg: 'from-sky-950/40 via-indigo-950/30 to-slate-950',
    headerBorderGradient: 'from-sky-400 via-indigo-400 to-blue-400',
    activeLightBg: '#F0F9FF',
    activeDarkBg: '#082F49',
    badgeColor: 'bg-sky-100 text-sky-900 dark:bg-sky-950 dark:text-sky-300 border-sky-400',
    particleType: 'snow',
    dateRangeDesc: 'December 1 – January 14'
  },
  classic: {
    id: 'classic',
    name: 'Classic ExamNexus Navy',
    subtitle: 'Signature deep navy & clean modern typography for focused, distraction-free study',
    badge: '🏛️ Pro Navy Aesthetic',
    icon: '🏛️',
    seasonText: 'Standard All-Year Theme',
    quote: 'Consistent daily effort compounds into extraordinary rank achievements.',
    primaryColor: '#4F46E5',
    accentColor: '#8B5CF6',
    gradientBg: 'from-slate-900 via-slate-900 to-slate-950',
    headerBorderGradient: 'from-indigo-500 to-purple-500',
    activeLightBg: '#EEF2FF',
    activeDarkBg: '#1E1B4B',
    badgeColor: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border-indigo-300',
    particleType: 'none',
    dateRangeDesc: 'Standard UI'
  }
};

/**
 * Automatically computes which Indian seasonal / festival theme should be active today.
 */
export function getAutoDetectedSeasonalTheme(): FestivalThemeId {
  const now = new Date();
  const month = now.getMonth() + 1; // 1-12
  const date = now.getDate();

  // 1. Republic Day (Jan 15 - Jan 31)
  if (month === 1 && date >= 15 && date <= 31) {
    return 'republic';
  }

  // 2. Winter Focus / New Year (Dec 1 - Jan 14)
  if (month === 12 || (month === 1 && date < 15)) {
    return 'winter';
  }

  // 3. Spring / Holi (March 1 - April 15)
  if (month === 3 || (month === 4 && date <= 15)) {
    return 'holi';
  }

  // 4. Independence Day (August 1 - August 31)
  if (month === 8) {
    return 'independence';
  }

  // 5. Gandhi Jayanti (Oct 1 - Oct 10)
  if (month === 10 && date <= 10) {
    return 'gandhi';
  }

  // 6. Diwali / Festive Autumn (Oct 11 - Nov 25)
  if ((month === 10 && date > 10) || (month === 11 && date <= 25)) {
    return 'diwali';
  }

  // 7. Monsoon (June 1 - Sept 30) -> If August is not independence, or general monsoon
  if (month >= 6 && month <= 9) {
    // In August, we can feature Independence Day or Monsoon
    if (month === 8 && (date >= 10 && date <= 20)) {
      return 'independence';
    }
    return 'monsoon';
  }

  return 'classic';
}
