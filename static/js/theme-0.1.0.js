/*! theme.js v0.1.0 — light/dark/system theme switching */

// Block scope keeps every declaration out of the shared global scope.
{
  const THEME_KEY = 'theme';
  const darkScheme = window.matchMedia('(prefers-color-scheme: dark)');

  const getStoredTheme = () => localStorage.getItem(THEME_KEY);

  const applyTheme = (pref) => {
    const isDark = pref === 'dark' || (!pref && darkScheme.matches);
    document.documentElement.classList.toggle('dark', isDark);
  };

  const updateIcons = (pref) => {
    const visible = pref === 'light' ? '.theme-icon-light'
      : pref === 'dark' ? '.theme-icon-dark'
      : '.theme-icon-system';
    document
      .querySelectorAll('.theme-icon-light, .theme-icon-dark, .theme-icon-system')
      .forEach((el) => el.classList.toggle('hidden', !el.matches(visible)));
  };

  // Cycle: system -> light -> dark -> system
  const nextTheme = (current) =>
    current === 'light' ? 'dark' : current === 'dark' ? null : 'light';

  const setTheme = (pref) => {
    if (pref) {
      localStorage.setItem(THEME_KEY, pref);
    } else {
      localStorage.removeItem(THEME_KEY);
    }
    applyTheme(pref);
    updateIcons(pref);
  };

  // Runs synchronously from <head>, before first paint, to avoid a theme flash.
  applyTheme(getStoredTheme());

  darkScheme.addEventListener('change', () => {
    if (!getStoredTheme()) applyTheme(null);
  });

  document.addEventListener('DOMContentLoaded', () => {
    updateIcons(getStoredTheme());
    document.querySelectorAll('.theme-toggle').forEach((btn) => {
      btn.addEventListener('click', () => setTheme(nextTheme(getStoredTheme())));
    });
  });
}
