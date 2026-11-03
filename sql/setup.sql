-- ============================================================
-- DETECTIVE DIVISION // SUPABASE DATABASE SETUP
-- Ejecutar en: Supabase Dashboard -> SQL Editor -> New Query
-- ============================================================

-- 1. TABLA: AGENTS (Censo de Personal / Roster de Jefatura)
CREATE TABLE IF NOT EXISTS public.agents (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  discord_id   TEXT        UNIQUE NOT NULL,
  discord_tag  TEXT,
  ic_name      TEXT        NOT NULL,
  badge        TEXT,
  rank         TEXT        DEFAULT 'aspirante'
                           CHECK (rank IN ('capitan','teniente','sgt','det3','det2','det1','aspirante')),
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

-- 2. TABLA: AUDIT_LOGS (Historial de Decisiones de Mando)
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  action       TEXT        NOT NULL,
  agent_name   TEXT,
  discord_tag  TEXT,
  detail       TEXT,
  commander    TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABLA: REPORTS (Informes Confidenciales Policiales)
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

-- 4. TABLA: TIPS (Canal de Denuncias Anónimas)
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

-- 5. TABLA: CASES (Expedientes de Investigación)
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
-- TRIGGER: auto-actualizar updated_at en agents
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

-- ============================================================
-- ROW LEVEL SECURITY
-- (App estática con clave anon pública — acceso total al rol anon)
-- ============================================================
ALTER TABLE public.agents     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tips       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cases      ENABLE ROW LEVEL SECURITY;

-- Políticas: acceso completo al rol anon (requerido para app estática sin backend)
CREATE POLICY "anon_all_agents"     ON public.agents     FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_audit_logs" ON public.audit_logs FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_reports"    ON public.reports    FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_tips"       ON public.tips       FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_cases"      ON public.cases      FOR ALL TO anon USING (true) WITH CHECK (true);

-- ============================================================
-- ÍNDICES para consultas frecuentes
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_agents_discord_id  ON public.agents (discord_id);
CREATE INDEX IF NOT EXISTS idx_agents_rank        ON public.agents (rank);
CREATE INDEX IF NOT EXISTS idx_agents_status      ON public.agents (status);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON public.audit_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tips_created       ON public.tips (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reports_created    ON public.reports (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cases_created      ON public.cases (created_at DESC);

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

