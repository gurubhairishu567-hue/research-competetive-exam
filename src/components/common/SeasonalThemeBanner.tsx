import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FESTIVAL_THEMES, FestivalThemeId } from '../../data/festivalThemes';
import { 
  Sparkles, CloudRain, Sun, Palette, 
  ChevronDown, Check, Volume2, VolumeX, Eye, 
  Sliders, X, Calendar, RefreshCw
} from 'lucide-react';

export const SeasonalThemeBanner: React.FC = () => {
  const { 
    festivalTheme, 
    setFestivalTheme, 
    effectiveFestivalTheme,
    isSeasonalEffectsEnabled,
    setIsSeasonalEffectsEnabled
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  const activeConfig = FESTIVAL_THEMES[effectiveFestivalTheme] || FESTIVAL_THEMES.classic;

  if (isDismissed) {
    return (
      <button
        onClick={() => setIsDismissed(false)}
        className="fixed bottom-6 left-6 z-40 px-3.5 py-2 rounded-full bg-slate-900/90 hover:bg-slate-800 text-white text-xs font-bold shadow-2xl border border-slate-700/80 backdrop-blur flex items-center gap-2 transition hover:scale-105"
        title="Open Seasonal Festival Theme Selector"
      >
        <span className="text-sm">{activeConfig.icon}</span>
        <span className="hidden sm:inline">{activeConfig.name.split(' ')[0]} Theme</span>
        <Palette className="w-3.5 h-3.5 text-amber-400" />
      </button>
    );
  }

  return (
    <>
      {/* Dynamic Seasonal Ambiance Particles */}
      {isSeasonalEffectsEnabled && activeConfig.particleType === 'raindrops' && (
        <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden opacity-30">
          {[...Array(18)].map((_, i) => (
            <div
              key={i}
              className="absolute w-[1.5px] bg-gradient-to-b from-transparent via-cyan-400 to-teal-200 rounded-full animate-rain"
              style={{
                height: `${Math.random() * 35 + 25}px`,
                left: `${(i * 5.8) + (Math.random() * 2)}%`,
                top: `-${Math.random() * 50}px`,
                animationDuration: `${0.8 + Math.random() * 0.7}s`,
                animationDelay: `${Math.random() * 2}s`,
                animationIterationCount: 'infinite'
              }}
            />
          ))}
        </div>
      )}

      {isSeasonalEffectsEnabled && activeConfig.particleType === 'diyas' && (
        <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden opacity-35">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-amber-400/80 blur-[1px] animate-pulse"
              style={{
                left: `${(i * 8.3) + (Math.random() * 3)}%`,
                top: `${(i * 7.5) + (Math.random() * 10)}%`,
                animationDuration: `${1.5 + Math.random() * 1.5}s`,
                animationDelay: `${Math.random() * 3}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Top Festival / Seasonal Ribbon */}
      <div className={`relative overflow-hidden transition-all duration-300 border-b border-slate-200/60 dark:border-slate-800 bg-gradient-to-r ${activeConfig.gradientBg}`}>
        {/* Top Highlight line matching festival colors */}
        <div className={`h-1 w-full bg-gradient-to-r ${activeConfig.headerBorderGradient}`} />

        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-3 text-xs">
          
          {/* Left: Badge & Live Seasonal Greeting */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold border flex items-center gap-1.5 shadow-2xs ${activeConfig.badgeColor}`}>
              <span>{activeConfig.icon}</span>
              <span>{activeConfig.badge}</span>
            </span>

            <p className="text-slate-700 dark:text-slate-200 font-medium hidden md:flex items-center gap-1.5 text-[11px]">
              <span className="font-semibold text-slate-900 dark:text-white">"{activeConfig.quote}"</span>
            </p>
          </div>

          {/* Right: Theme Switcher Trigger & Controls */}
          <div className="flex items-center gap-2 shrink-0 ml-auto">
            
            {/* Auto indicator */}
            {festivalTheme === 'auto' && (
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                Auto-Synced
              </span>
            )}

            {/* Selector Button */}
            <div className="relative">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="px-2.5 py-1 rounded-xl bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 transition shadow-xs"
                aria-label="Change Festival or Seasonal Theme"
              >
                <Palette className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span className="text-[11px]">Theme: <strong>{activeConfig.name.split(' ')[0]}</strong></span>
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>

              {/* Theme Dropdown Menu */}
              {isOpen && (
                <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-1.5">
                      <Palette className="w-4 h-4 text-indigo-500" />
                      <span className="font-extrabold text-xs text-slate-900 dark:text-white">Indian Seasons & Festivals</span>
                    </div>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                    {(Object.keys(FESTIVAL_THEMES) as FestivalThemeId[]).map((themeKey) => {
                      const item = FESTIVAL_THEMES[themeKey];
                      const isSelected = festivalTheme === themeKey;
                      const isCurrentEffective = effectiveFestivalTheme === themeKey;

                      return (
                        <button
                          key={themeKey}
                          onClick={() => {
                            setFestivalTheme(themeKey);
                            setIsOpen(false);
                          }}
                          className={`w-full text-left p-2 rounded-xl transition flex items-center justify-between gap-2 text-xs border ${
                            isSelected
                              ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-300 dark:border-indigo-700 text-indigo-900 dark:text-indigo-200 font-bold'
                              : 'bg-slate-50/50 dark:bg-slate-800/40 border-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-base">{item.icon}</span>
                            <div className="min-w-0">
                              <div className="font-extrabold truncate flex items-center gap-1.5">
                                <span>{item.name}</span>
                                {themeKey === 'auto' && (
                                  <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">Live</span>
                                )}
                              </div>
                              <div className="text-[10px] text-slate-400 truncate">{item.dateRangeDesc}</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            {isSelected && <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
                            {!isSelected && isCurrentEffective && festivalTheme === 'auto' && (
                              <span className="text-[10px] text-emerald-600 font-bold">Active</span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Effects Toggle in Dropdown */}
                  <div className="pt-2.5 mt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Ambient Seasonal Effects:</span>
                    <button
                      onClick={() => setIsSeasonalEffectsEnabled(!isSeasonalEffectsEnabled)}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition ${
                        isSeasonalEffectsEnabled
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {isSeasonalEffectsEnabled ? 'ON' : 'OFF'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Dismiss banner button */}
            <button
              onClick={() => setIsDismissed(true)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-black/5 dark:hover:bg-white/5 transition"
              title="Minimize Festival Ribbon"
            >
              <X className="w-3.5 h-3.5" />
            </button>

          </div>

        </div>
      </div>
    </>
  );
};
