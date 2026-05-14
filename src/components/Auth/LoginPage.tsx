import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

type Mode = 'login' | 'signup';

export function LoginPage() {
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  async function handleSubmit() {
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    if (mode === 'login') {
      const { error } = await signIn(email, password);
      if (error) {
        setError(error);
      } else {
        navigate('/');
      }
    } else {
      const { error } = await signUp(email, password);
      if (error) {
        setError(error);
      } else {
        setSuccessMsg('Conta criada! Verifique seu email para confirmar.');
      }
    }

    setLoading(false);
  }

  return (
    <div className="max-w-sm mx-auto px-4 py-16">
      <div className="mb-8">
        <span className="text-xs font-medium bg-red-600 text-white px-2.5 py-1 rounded-md">F1 Hub</span>
        <h1 className="text-lg font-medium text-gray-900 mt-4">
          {mode === 'login' ? 'Entrar na sua conta' : 'Criar conta'}
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          {mode === 'login' ? 'Acesse seu perfil personalizado.' : 'Comece a personalizar sua experiência.'}
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400 transition-colors"
          />
        </div>

        <div>
          <label className="text-xs text-gray-500 mb-1 block">Senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400 transition-colors"
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />
        </div>

        {error && (
          <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
        )}

        {successMsg && (
          <p className="text-xs text-green-600 bg-green-50 px-3 py-2 rounded-lg">{successMsg}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading || !email || !password}
          className="bg-red-600 text-white text-sm font-medium py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-1"
        >
          {loading ? 'Aguarde...' : mode === 'login' ? 'Entrar' : 'Criar conta'}
        </button>

        <button
          onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(null); setSuccessMsg(null); }}
          className="text-xs text-gray-400 hover:text-gray-600 transition-colors text-center"
        >
          {mode === 'login' ? 'Não tem conta? Criar agora' : 'Já tem conta? Entrar'}
        </button>
      </div>
    </div>
  );
}