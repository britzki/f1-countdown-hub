import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useTheme } from './hooks/useTheme';
import { CalendarPage } from './components/Calendar/CalendarPage';
import { StandingsPage } from './components/Standings/StandingsPage';
import { LoginPage } from './components/Auth/LoginPage';
import { ProtectedRoute } from './components/Auth/ProtectedRoute';
import { ProfilePage } from './components/Profile/ProfilePage';

function NavBar({ toggleTheme, theme }: { toggleTheme: () => void; theme: string }) {
  const { user, signOut } = useAuth();

  const navLink = ({ isActive }: { isActive: boolean }) =>
    `text-xs font-medium px-3 py-1.5 rounded-md transition-colors ${
      isActive ? 'bg-red-700 text-white' : 'bg-red-600 text-white hover:bg-red-700'
    }`;

  const navBtn = "text-xs font-medium px-3 py-1.5 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors";

  return (
    <nav className="border-b border-gray-100 dark:border-gray-800 dark:bg-gray-900 px-4 py-3 flex items-center gap-2">
      <span className="text-sm font-semibold text-red-600 tracking-tight mr-4">F1 Hub</span>

      <NavLink to="/" end className={navLink}>Calendário</NavLink>
      <NavLink to="/standings" className={navLink}>Standings</NavLink>

      <div className="ml-auto flex items-center gap-2">
        {user ? (
          <>
            <NavLink to="/perfil" className={navLink}>Perfil</NavLink>
            <button onClick={signOut} className={navBtn}>Sair</button>
          </>
        ) : (
          <NavLink to="/login" className={navLink}>Entrar</NavLink>
        )}
        <button
          onClick={toggleTheme}
          className={navBtn}
          aria-label="Alternar tema"
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>
    </nav>
  );
}

function AppRoutes() {
  // useTheme aqui garante que o tema é aplicado globalmente
  const { theme, toggleTheme } = useTheme();

  return (
    // min-h-screen garante que o fundo escuro cobre a página toda
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <NavBar toggleTheme={toggleTheme} theme={theme} />
      <Routes>
        <Route path="/" element={<CalendarPage />} />
        <Route path="/standings" element={<StandingsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/perfil"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;