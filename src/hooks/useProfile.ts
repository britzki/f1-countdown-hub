import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export interface Profile {
  favorite_driver: string | null;
  favorite_constructor: string | null;
}

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Busca o perfil do usuário logado
  useEffect(() => {
  if (!user) {
    setLoading(false);
    return;
  }

  let cancelled = false;

  supabase
    .from('profiles')
    .select('favorite_driver, favorite_constructor')
    .eq('id', user.id)
    .single()
    .then(({ data }) => {
      if (!cancelled) {
        setProfile(data ?? { favorite_driver: null, favorite_constructor: null });
        setLoading(false);
      }
    });

  return () => { cancelled = true; };
}, [user]);

  // Salva ou atualiza preferências via upsert
  async function saveProfile(updates: Partial<Profile>) {
    if (!user) return;

    const { error } = await supabase
      .from('profiles')
      .upsert({ id: user.id, ...updates, updated_at: new Date().toISOString() });

    if (!error) {
      setProfile((prev) => ({ ...prev ?? { favorite_driver: null, favorite_constructor: null }, ...updates }));
    }

    return error;
  }

  return { profile, loading, saveProfile };
}