import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

export function useTheme() {
  // Lê preferência salva ou usa 'light' como padrão
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('theme') as Theme) ?? 'light';
  });

  // Aplica a classe 'dark' no <html> e salva no localStorage
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((t) => (t === 'light' ? 'dark' : 'light'));
  }

  return { theme, toggleTheme };
}