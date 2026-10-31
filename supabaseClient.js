// supabaseClient.js — único lugar donde se configura la conexión a Supabase.
// Lo usan tanto la página pública (index.html) como el panel (/admin).
//
// Supabase > Project Settings > API:
//   - "Project URL"            -> SUPABASE_URL
//   - "anon public" (API key)  -> SUPABASE_ANON_KEY
// La anon key es PÚBLICA por diseño: la seguridad la dan las políticas RLS
// del SQL. NUNCA pegues acá la "service_role" key.

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

export const SUPABASE_URL = 'https://gjyhivgempoyquuqflzk.supabase.co';
export const SUPABASE_ANON_KEY = 'sb_publishable_9eol9buiFIeyPckjTjuEUg_zJuy-8op';
export const BUCKET = 'imagenes-productos';

// true solo cuando ya pegaste una URL y una key reales (no los textos de ejemplo)
export const estaConfigurado =
  /^https:\/\/(?!tu-proyecto)[a-z0-9]+\.supabase\.co\/?$/i.test(SUPABASE_URL) &&
  SUPABASE_ANON_KEY.length > 20 && !SUPABASE_ANON_KEY.startsWith('TU-');

export const supabase = estaConfigurado
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false },
    })
  : null;
