import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useProfile } from '../../hooks/useProfile';
import {
  fetchDriverStandings,
  fetchConstructorStandings,
  type DriverStanding,
  type ConstructorStanding,
} from '../../services/jolpica';

// Cores por equipe para a barra lateral dos cards
const TEAM_COLORS: Record<string, string> = {
  mclaren: 'bg-orange-400', ferrari: 'bg-red-600', red_bull: 'bg-blue-700',
  mercedes: 'bg-teal-400', aston_martin: 'bg-green-700', alpine: 'bg-pink-500',
  haas: 'bg-gray-400', williams: 'bg-blue-400', sauber: 'bg-green-500',
  rb: 'bg-blue-500', kick_sauber: 'bg-green-500',
};

export function ProfilePage() {
  const { user } = useAuth();
  const { profile, loading: profileLoading, saveProfile } = useProfile();

  const [drivers, setDrivers] = useState<DriverStanding[]>([]);
  const [constructors, setConstructors] = useState<ConstructorStanding[]>([]);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Seleções locais antes de salvar
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null);
  const [selectedConstructor, setSelectedConstructor] = useState<string | null>(null);

  // Carrega pilotos e construtores da API
  useEffect(() => {
    fetchDriverStandings(2026).then(setDrivers);
    fetchConstructorStandings(2026).then(setConstructors);
  }, []);

  // Quando o perfil carregar, inicializa as seleções
  useEffect(() => {
  if (!profile) return;
  setSelectedDriver(profile.favorite_driver);
  setSelectedConstructor(profile.favorite_constructor);
}, [profile]);

  async function handleSave() {
    setSaving(true);
    setSuccessMsg(null);
    const error = await saveProfile({
      favorite_driver: selectedDriver,
      favorite_constructor: selectedConstructor,
    });
    setSaving(false);
    if (!error) setSuccessMsg('Preferências salvas!');
  }

  // Dados do piloto favorito selecionado
  const favoriteDriver = drivers.find((d) => d.Driver.driverId === selectedDriver);
  // Dados da equipe favorita selecionada
  const favoriteConstructor = constructors.find((c) => c.Constructor.constructorId === selectedConstructor);

  if (profileLoading) return (
    <div className="text-center py-20 text-sm text-gray-400">Carregando...</div>
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">

      {/* Cabeçalho */}
      <div className="flex items-center gap-3 mb-8">
        <h1 className="text-lg font-medium text-gray-900">Perfil</h1>
        <span className="text-xs text-gray-400">{user?.email}</span>
      </div>

      {/* Seleção de piloto favorito */}
      <section className="mb-8">
        <h2 className="text-sm font-medium text-gray-700 mb-3">Piloto favorito</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {drivers.map((d) => {
            const teamId = d.Constructors[0]?.constructorId ?? '';
            const isSelected = selectedDriver === d.Driver.driverId;
            return (
              <button
                key={d.Driver.driverId}
                onClick={() => setSelectedDriver(d.Driver.driverId)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-all
                  ${isSelected
                    ? 'border-red-600 bg-red-50'
                    : 'border-gray-100 bg-white hover:border-gray-200'}`}
              >
                <div className={`w-1 h-8 rounded-full shrink-0 ${TEAM_COLORS[teamId] ?? 'bg-gray-300'}`} />
                <div className="min-w-0">
                  <p className="text-xs font-medium text-gray-900 truncate">{d.Driver.familyName}</p>
                  <p className="text-[11px] text-gray-400 truncate">{d.Constructors[0]?.name}</p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Seleção de equipe favorita */}
      <section className="mb-8">
        <h2 className="text-sm font-medium text-gray-700 mb-3">Equipe favorita</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {constructors.map((c) => {
            const isSelected = selectedConstructor === c.Constructor.constructorId;
            return (
              <button
                key={c.Constructor.constructorId}
                onClick={() => setSelectedConstructor(c.Constructor.constructorId)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-all
                  ${isSelected
                    ? 'border-red-600 bg-red-50'
                    : 'border-gray-100 bg-white hover:border-gray-200'}`}
              >
                <div className={`w-1 h-8 rounded-full shrink-0 ${TEAM_COLORS[c.Constructor.constructorId] ?? 'bg-gray-300'}`} />
                <div className="min-w-0">
                  <p className="text-xs font-medium text-gray-900 truncate">{c.Constructor.name}</p>
                  <p className="text-[11px] text-gray-400">{c.position}º · {c.points} pts</p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Estatísticas do piloto favorito */}
      {favoriteDriver && (
        <section className="mb-8">
          <h2 className="text-sm font-medium text-gray-700 mb-3">
            Stats — {favoriteDriver.Driver.givenName} {favoriteDriver.Driver.familyName}
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Posição', value: `${favoriteDriver.position}º` },
              { label: 'Pontos', value: favoriteDriver.points },
              { label: 'Vitórias', value: favoriteDriver.wins },
            ].map(({ label, value }) => (
              <div key={label} className="bg-gray-50 rounded-xl px-4 py-3 text-center">
                <p className="text-xl font-semibold text-gray-900">{value}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Estatísticas da equipe favorita */}
      {favoriteConstructor && (
        <section className="mb-8">
          <h2 className="text-sm font-medium text-gray-700 mb-3">
            Stats — {favoriteConstructor.Constructor.name}
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Posição', value: `${favoriteConstructor.position}º` },
              { label: 'Pontos', value: favoriteConstructor.points },
              { label: 'Vitórias', value: favoriteConstructor.wins },
            ].map(({ label, value }) => (
              <div key={label} className="bg-gray-50 rounded-xl px-4 py-3 text-center">
                <p className="text-xl font-semibold text-gray-900">{value}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Botão salvar */}
      {successMsg && (
        <p className="text-xs text-green-600 bg-green-50 px-3 py-2 rounded-lg mb-3">{successMsg}</p>
      )}
      <button
        onClick={handleSave}
        disabled={saving}
        className="bg-red-600 text-white text-sm font-medium px-6 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
      >
        {saving ? 'Salvando...' : 'Salvar preferências'}
      </button>
    </div>
  );
}