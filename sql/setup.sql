-- ============================================================
-- DETECTIVE DIVISION // SUPABASE DATABASE SETUP
-- Ejecutar en: Supabase Dashboard -> SQL Editor -> New Query
-- ============================================================

-- 1. TABLA: RANKS (Rangos Dinámicos y Matriz de Permisos)
CREATE TABLE IF NOT EXISTS public.ranks (
  id           TEXT        PRIMARY KEY,
  label        TEXT        NOT NULL,
  level        NUMERIC     NOT NULL DEFAULT 1,
  clearance    TEXT        DEFAULT 'NIVEL 1 // RESTRINGIDO',
  icon         TEXT        DEFAULT '🛡️',
  color        TEXT        DEFAULT 'slate',
  badge_class  TEXT        DEFAULT 'rank-badge-det1',
  permissions  JSONB       NOT NULL DEFAULT '{}',
  is_system    BOOLEAN     DEFAULT FALSE,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TABLA: AGENTS (Censo de Personal / Roster de Jefatura)
CREATE TABLE IF NOT EXISTS public.agents (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  discord_id   TEXT        UNIQUE NOT NULL,
  discord_tag  TEXT,
  ic_name      TEXT        NOT NULL,
  badge        TEXT,
  rank         TEXT        DEFAULT 'aspirante',
  division     TEXT        DEFAULT 'Sin Asignar // En Evaluación',
  status       TEXT        DEFAULT 'Pendiente'
                           CHECK (status IN ('Activo','Pendiente','Suspendido','Expulsado')),
  awards       TEXT[]      DEFAULT '{}',
  notes        TEXT        DEFAULT '',
  avatar       TEXT        DEFAULT '',
  join_date    TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Si la tabla agents ya existía con la restricción check previa, la eliminamos:
ALTER TABLE public.agents DROP CONSTRAINT IF EXISTS agents_rank_check;

-- 3. TABLA: AUDIT_LOGS (Historial de Decisiones de Mando)
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  action       TEXT        NOT NULL,
  agent_name   TEXT,
  discord_tag  TEXT,
  detail       TEXT,
  commander    TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABLA: REPORTS (Informes Confidenciales Policiales)
CREATE TABLE IF NOT EXISTS public.reports (
  id             TEXT        PRIMARY KEY,
  title          TEXT        NOT NULL,
  category       TEXT        DEFAULT 'vigilancia',
  status         TEXT,
  status_type    TEXT        DEFAULT 'active',
  clearance      TEXT        DEFAULT 'NIVEL 2 (CONFIDENCIAL)',
  lead_detective TEXT,
  report_date    TEXT,
  summary        TEXT,
  evidence       TEXT[]      DEFAULT '{}',
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TABLA: TIPS (Canal de Denuncias Anónimas)
CREATE TABLE IF NOT EXISTS public.tips (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  code        TEXT        UNIQUE NOT NULL,
  category    TEXT,
  location    TEXT,
  description TEXT,
  priority    TEXT        DEFAULT 'media',
  contact     TEXT        DEFAULT 'ANÓNIMO PROTEGIDO',
  status      TEXT        DEFAULT 'RECIBIDA // EN REVISIÓN POR ANALISTA FORENSE',
  tip_date    TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 6. TABLA: CASES (Expedientes de Investigación)
CREATE TABLE IF NOT EXISTS public.cases (
  id             TEXT        PRIMARY KEY,
  title          TEXT        NOT NULL,
  division       TEXT,
  category       TEXT,
  status         TEXT,
  status_type    TEXT        DEFAULT 'active',
  priority       TEXT,
  lead_detective TEXT,
  case_date      TEXT,
  location       TEXT,
  summary        TEXT,
  evidence       TEXT[]      DEFAULT '{}',
  suspects       JSONB       DEFAULT '[]',
  image          TEXT        DEFAULT '',
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TRIGGER: auto-actualizar updated_at en agents y ranks
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_agents_updated_at ON public.agents;
CREATE TRIGGER set_agents_updated_at
  BEFORE UPDATE ON public.agents
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_ranks_updated_at ON public.ranks;
CREATE TRIGGER set_ranks_updated_at
  BEFORE UPDATE ON public.ranks
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE public.ranks      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agents     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tips       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cases      ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_all_ranks"      ON public.ranks      FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_agents"     ON public.agents     FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_audit_logs" ON public.audit_logs FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_reports"    ON public.reports    FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_tips"       ON public.tips       FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_cases"      ON public.cases      FOR ALL TO anon USING (true) WITH CHECK (true);

-- ============================================================
-- ÍNDICES para consultas frecuentes
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_ranks_level        ON public.ranks (level DESC);
CREATE INDEX IF NOT EXISTS idx_agents_discord_id  ON public.agents (discord_id);
CREATE INDEX IF NOT EXISTS idx_agents_rank        ON public.agents (rank);
CREATE INDEX IF NOT EXISTS idx_agents_status      ON public.agents (status);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON public.audit_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tips_created       ON public.tips (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reports_created    ON public.reports (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cases_created      ON public.cases (created_at DESC);

-- ============================================================
-- DATOS SEMILLA: RANGOS INICIALES Y MATRIZ DE PERMISOS
-- ============================================================
INSERT INTO public.ranks (id, label, level, clearance, icon, color, badge_class, is_system, permissions)
VALUES
  ('capitan', 'Capitán de División', 5, 'NIVEL 5 // COMANDO SUPREMO', '👑', 'amber', 'rank-badge-capitan', true,
   '{"view_cases":true,"create_cases":true,"edit_cases":true,"delete_cases":true,"view_reports":true,"create_reports":true,"edit_reports":true,"delete_reports":true,"view_tips":true,"delete_tips":true,"manage_roster":true,"change_ranks":true,"kick_agents":true,"manage_ranks":true,"manage_audit":true}'),
  
  ('teniente', 'Teniente de División', 4, 'NIVEL 4 // SUPERVISIÓN OPERATIVA', '⭐', 'blue', 'rank-badge-teniente', false,
   '{"view_cases":true,"create_cases":true,"edit_cases":true,"delete_cases":true,"view_reports":true,"create_reports":true,"edit_reports":true,"delete_reports":false,"view_tips":true,"delete_tips":true,"manage_roster":true,"change_ranks":true,"kick_agents":true,"manage_ranks":false,"manage_audit":true}'),
  
  ('sgt', 'Sargento de Detectives', 3.5, 'NIVEL 3.5 // MANDO DE TURNO', '🔷', 'cyan', 'rank-badge-sgt', false,
   '{"view_cases":true,"create_cases":true,"edit_cases":true,"delete_cases":false,"view_reports":true,"create_reports":true,"edit_reports":true,"delete_reports":false,"view_tips":true,"delete_tips":false,"manage_roster":true,"change_ranks":false,"kick_agents":false,"manage_ranks":false,"manage_audit":false}'),
  
  ('det3', 'Detective III', 3, 'NIVEL 3 // ALTO SECRETO', '🔵', 'purple', 'rank-badge-det3', false,
   '{"view_cases":true,"create_cases":true,"edit_cases":true,"delete_cases":false,"view_reports":true,"create_reports":true,"edit_reports":true,"delete_reports":false,"view_tips":true,"delete_tips":false,"manage_roster":false,"change_ranks":false,"kick_agents":false,"manage_ranks":false,"manage_audit":false}'),
  
  ('det2', 'Detective II', 2, 'NIVEL 2 // CONFIDENCIAL', '🟢', 'emerald', 'rank-badge-det2', false,
   '{"view_cases":true,"create_cases":true,"edit_cases":true,"delete_cases":false,"view_reports":true,"create_reports":true,"edit_reports":false,"delete_reports":false,"view_tips":true,"delete_tips":false,"manage_roster":false,"change_ranks":false,"kick_agents":false,"manage_ranks":false,"manage_audit":false}'),
  
  ('det1', 'Detective I', 1, 'NIVEL 1 // RESTRINGIDO', '⬜', 'slate', 'rank-badge-det1', false,
   '{"view_cases":true,"create_cases":true,"edit_cases":false,"delete_cases":false,"view_reports":true,"create_reports":true,"edit_reports":false,"delete_reports":false,"view_tips":false,"delete_tips":false,"manage_roster":false,"change_ranks":false,"kick_agents":false,"manage_ranks":false,"manage_audit":false}'),
  
  ('aspirante', 'Aspirante / Sin Asignar', 0, 'NIVEL 0 // SIN ACCESO', '🔴', 'red', 'rank-badge-aspirante', true,
   '{"view_cases":true,"create_cases":false,"edit_cases":false,"delete_cases":false,"view_reports":false,"create_reports":false,"edit_reports":false,"delete_reports":false,"view_tips":false,"delete_tips":false,"manage_roster":false,"change_ranks":false,"kick_agents":false,"manage_ranks":false,"manage_audit":false}')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- DATOS SEMILLA: Censo inicial de ejemplo
-- ============================================================
INSERT INTO public.agents (discord_id, discord_tag, ic_name, badge, rank, division, status, awards, notes, join_date)
VALUES
  ('101928374650192831', 'Cap.Vance#0101',   'Cap. David Vance',      '#101-DIV', 'capitan',  'Mando Supremo // Bureau Executive',  'Activo',   '{valor,servicio,merito}', 'Comandante fundador de la Detective Division. 12 años de servicio activo.', '01/ENE/2024'),
  ('201928374650192832', 'J_Sterling#0201',  'Tte. James Sterling',   '#201-DIV', 'teniente', 'RHD - Robos & Homicidios',           'Activo',   '{servicio,tirador}',      'Supervisor de RHD e incursiones tácticas. Especialista en negociación.', '15/MAR/2024'),
  ('404928374650192833', 'Marcus_Cole#0404', 'Det. III Marcus Cole',  '#404-DIV', 'det3',     'GND - Narcóticos & Infiltración',    'Activo',   '{valor}',                 'Líder de operaciones GND encubiertas. Infiltración de cárteles.',         '20/ABR/2024'),
  ('512928374650192834', 'E_Rostova#0512',   'Det. II Elena Rostova', '#512-DIV', 'det2',     'RHD - Robos & Homicidios',           'Activo',   '{merito}',                'Especialista en homicidios calificados y peritaje balístico.',             '05/JUL/2024'),
  ('522928374650192835', 'S_Connor#0522',    'Det. I Sarah Connor',   '#522-DIV', 'det1',     'CSI - Forense y Balística',          'Activo',   '{}',                      'Detective de primera asignación. Excelentes resultados en evaluaciones.', '01/SEP/2024')
ON CONFLICT (discord_id) DO NOTHING;

-- ============================================================
-- FIN DEL SCRIPT
-- ============================================================
