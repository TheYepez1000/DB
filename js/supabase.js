/**
 * DETECTIVE DIVISION // SUPABASE INTEGRATION MODULE
 * Persistent database backend — all CRUD operations + in-memory cache
 * Static site: uses Supabase JS v2 with anon key from browser
 */

const SUPABASE_URL  = 'https://ehhjtttkvptxujtmsniv.supabase.co';
const SUPABASE_ANON = 'sb_publishable_0wOOUCDpbhHfF2_PmCVPpQ_cXwlkY48';

// Wait for the Supabase UMD bundle to expose window.supabase
let db = null;
try {
  db = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON);
} catch (e) {
  console.warn('[DB] Supabase client init failed:', e);
}

// ─── IN-MEMORY CACHE ────────────────────────────────────────────────────────
let CACHE = {
  agents:    null,  // array of DB rows (snake_case)
  auditLogs: null,  // array of DB rows
  reports:   null,  // array of DB rows
  tips:      null,  // array of DB rows
  cases:     null,  // array of DB rows
  loaded:    false
};

// ─── DB STATUS INDICATOR ─────────────────────────────────────────────────────
function showDBStatus(state) {
  const dot  = document.getElementById('db-status-indicator');
  const text = document.getElementById('db-status-text');
  if (!dot || !text) return;
  dot.classList.remove('bg-amber-400', 'bg-emerald-400', 'bg-red-500', 'animate-pulse');

  if (state === 'connecting') {
    dot.classList.add('bg-amber-400', 'animate-pulse');
    text.textContent = 'Conectando BD…';
  } else if (state === 'online') {
    dot.classList.add('bg-emerald-400');
    text.textContent = 'Supabase OK';
  } else {
    dot.classList.add('bg-red-500');
    text.textContent = 'BD offline';
  }
}

// ─── INIT — parallel load of all 5 tables ────────────────────────────────────
async function initSupabase() {
  if (!db) {
    console.warn('[DB] No Supabase client — falling back to localStorage');
    _loadFromLocalStorage();
    showDBStatus('offline');
    return;
  }

  showDBStatus('connecting');

  try {
    const [agentsRes, logsRes, reportsRes, tipsRes, casesRes] = await Promise.all([
      db.from('agents').select('*').order('created_at', { ascending: true }),
      db.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(200),
      db.from('reports').select('*').order('report_date', { ascending: false }),
      db.from('tips').select('*').order('created_at', { ascending: false }),
      db.from('cases').select('*').order('case_date', { ascending: false })
    ]);

    // If any critical query errored, fall back
    if (agentsRes.error) throw agentsRes.error;

    CACHE.agents    = agentsRes.data   || [];
    CACHE.auditLogs = logsRes.data     || [];
    CACHE.reports   = reportsRes.error  ? [] : (reportsRes.data || []);
    CACHE.tips      = tipsRes.error     ? [] : (tipsRes.data    || []);
    CACHE.cases     = casesRes.error    ? [] : (casesRes.data   || []);
    CACHE.loaded    = true;

    showDBStatus('online');
    console.log('[DB] Supabase cargado — agentes:', CACHE.agents.length,
      '| logs:', CACHE.auditLogs.length,
      '| reports:', CACHE.reports.length,
      '| tips:', CACHE.tips.length,
      '| cases:', CACHE.cases.length);

    // Subscribe to realtime agent changes
    _subscribeAgentChanges();

  } catch (err) {
    console.warn('[DB] Supabase load error — usando localStorage como fallback:', err);
    _loadFromLocalStorage();
    showDBStatus('offline');
  }
}

// ─── LOCALSTORAGE FALLBACK ───────────────────────────────────────────────────
function _loadFromLocalStorage() {
  try {
    const rosterRaw = localStorage.getItem('dd_jefatura_roster');
    CACHE.agents = rosterRaw
      ? JSON.parse(rosterRaw).map(agentToRow)
      : [];
  } catch (e) { CACHE.agents = []; }

  try {
    const logsRaw = localStorage.getItem('dd_audit_logs');
    CACHE.auditLogs = logsRaw ? JSON.parse(logsRaw) : [];
  } catch (e) { CACHE.auditLogs = []; }

  try {
    const repRaw = localStorage.getItem('dd_confidential_reports');
    CACHE.reports = repRaw ? JSON.parse(repRaw).map(reportToRow) : [];
  } catch (e) { CACHE.reports = []; }

  try {
    const tipsRaw = localStorage.getItem('lspd_rp_tips');
    CACHE.tips = tipsRaw ? JSON.parse(tipsRaw).map(tipToRow) : [];
  } catch (e) { CACHE.tips = []; }

  try {
    const casesRaw = localStorage.getItem('dd_custom_cases');
    CACHE.cases = casesRaw ? JSON.parse(casesRaw).map(caseToRow) : [];
  } catch (e) { CACHE.cases = []; }

  CACHE.loaded = true;
}

// ─── REALTIME ────────────────────────────────────────────────────────────────
function _subscribeAgentChanges() {
  if (!db) return;
  try {
    db.channel('dd-agents-rt')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'agents' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          CACHE.agents.push(payload.new);
        } else if (payload.eventType === 'UPDATE') {
          const idx = CACHE.agents.findIndex(r => r.discord_id === payload.new.discord_id);
          if (idx >= 0) CACHE.agents[idx] = payload.new;
          else CACHE.agents.push(payload.new);
        } else if (payload.eventType === 'DELETE') {
          CACHE.agents = CACHE.agents.filter(r => r.discord_id !== payload.old.discord_id);
        }
        // Re-render roster if Jefatura tab is visible
        const jefSection = document.getElementById('jefatura');
        if (jefSection && !jefSection.classList.contains('hidden')) {
          if (typeof renderJefaturaRoster === 'function') {
            renderJefaturaRoster(getCachedRoster().map(rowToAgent));
          }
          if (typeof renderJefaturaKPIs === 'function') renderJefaturaKPIs();
        }
      })
      .subscribe();
  } catch (e) {
    console.warn('[DB] Realtime subscribe failed:', e);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  AGENTS
// ─────────────────────────────────────────────────────────────────────────────

/** camelCase agent → snake_case DB row */
function agentToRow(agent) {
  return {
    discord_id:  agent.discordId,
    discord_tag: agent.discordTag || '',
    ic_name:     agent.icName || '',
    badge:       agent.badge || '',
    rank:        agent.rank || 'aspirante',
    division:    agent.division || '',
    status:      agent.status || 'Pendiente',
    awards:      JSON.stringify(agent.awards || []),
    notes:       agent.notes || '',
    avatar:      agent.avatar || '',
    join_date:   agent.joinDate || ''
  };
}

/** snake_case DB row → camelCase agent */
function rowToAgent(row) {
  let awards = [];
  try { awards = Array.isArray(row.awards) ? row.awards : JSON.parse(row.awards || '[]'); } catch(e) {}
  return {
    discordId:  row.discord_id,
    discordTag: row.discord_tag || '',
    icName:     row.ic_name || '',
    badge:      row.badge || '',
    rank:       row.rank || 'aspirante',
    division:   row.division || '',
    status:     row.status || 'Pendiente',
    awards,
    notes:      row.notes || '',
    avatar:     row.avatar || '',
    joinDate:   row.join_date || ''
  };
}

function getCachedRoster() {
  return CACHE.agents || [];
}

async function dbUpsertAgent(agent) {
  // Always update cache immediately
  const row = agentToRow(agent);
  const idx = CACHE.agents.findIndex(r => r.discord_id === agent.discordId);
  if (idx >= 0) CACHE.agents[idx] = { ...CACHE.agents[idx], ...row };
  else CACHE.agents.push(row);

  if (!db) {
    // Fallback: persist all to localStorage
    localStorage.setItem('dd_jefatura_roster', JSON.stringify(getCachedRoster().map(rowToAgent)));
    return;
  }
  try {
    const { error } = await db.from('agents').upsert(row, { onConflict: 'discord_id' });
    if (error) console.warn('[DB] upsert agent error:', error);
  } catch (e) {
    console.warn('[DB] upsert agent exception:', e);
    localStorage.setItem('dd_jefatura_roster', JSON.stringify(getCachedRoster().map(rowToAgent)));
  }
}

async function dbDeleteAgent(discordId) {
  CACHE.agents = CACHE.agents.filter(r => r.discord_id !== discordId);
  if (!db) {
    localStorage.setItem('dd_jefatura_roster', JSON.stringify(getCachedRoster().map(rowToAgent)));
    return;
  }
  try {
    const { error } = await db.from('agents').delete().eq('discord_id', discordId);
    if (error) console.warn('[DB] delete agent error:', error);
  } catch (e) {
    console.warn('[DB] delete agent exception:', e);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  AUDIT LOGS
// ─────────────────────────────────────────────────────────────────────────────

function getCachedAuditLogs() {
  return CACHE.auditLogs || [];
}

/**
 * Maps DB audit row to app log object
 */
function rowToAuditLog(row) {
  return {
    id:         row.id,
    action:     row.action || '',
    agentName:  row.agent_name || '',
    discordTag: row.discord_tag || '',
    detail:     row.detail || '',
    commander:  row.commander || 'Sistema',
    timestamp:  row.created_at
      ? new Date(row.created_at).toLocaleString('es-ES')
      : new Date().toLocaleString('es-ES')
  };
}

async function dbInsertAuditLog({ action, agentName, discordTag, detail, commander }) {
  const entry = {
    id:         'LOG-' + Date.now() + '-' + Math.random().toString(36).slice(2,6),
    action:     action || '',
    agentName:  agentName || '',
    discordTag: discordTag || '',
    detail:     detail || '',
    commander:  commander || 'Sistema',
    timestamp:  new Date().toLocaleString('es-ES')
  };

  // Always add to cache first (top)
  CACHE.auditLogs.unshift(entry);
  if (CACHE.auditLogs.length > 200) CACHE.auditLogs.splice(200);

  if (!db) {
    localStorage.setItem('dd_audit_logs', JSON.stringify(CACHE.auditLogs));
    return;
  }
  try {
    const dbRow = {
      action:      action,
      agent_name:  agentName,
      discord_tag: discordTag,
      detail:      detail,
      commander:   commander || 'Sistema'
    };
    const { error } = await db.from('audit_logs').insert(dbRow);
    if (error) console.warn('[DB] insert audit log error:', error);
  } catch (e) {
    console.warn('[DB] insert audit log exception:', e);
    localStorage.setItem('dd_audit_logs', JSON.stringify(CACHE.auditLogs));
  }
}

async function dbClearAuditLogs() {
  CACHE.auditLogs = [];
  if (!db) {
    localStorage.removeItem('dd_audit_logs');
    return;
  }
  try {
    const { error } = await db.from('audit_logs').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (error) console.warn('[DB] clear audit logs error:', error);
  } catch (e) {
    console.warn('[DB] clear audit logs exception:', e);
    localStorage.removeItem('dd_audit_logs');
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  CONFIDENTIAL REPORTS
// ─────────────────────────────────────────────────────────────────────────────

function reportToRow(report) {
  return {
    id:              report.id,
    title:           report.title || '',
    category:        report.category || '',
    status:          report.status || '',
    status_type:     report.statusType || '',
    clearance:       report.clearance || '',
    lead_detective:  report.leadDetective || '',
    report_date:     report.date || '',
    summary:         report.summary || '',
    evidence:        JSON.stringify(report.evidence || [])
  };
}

function rowToReport(row) {
  let evidence = [];
  try { evidence = Array.isArray(row.evidence) ? row.evidence : JSON.parse(row.evidence || '[]'); } catch(e) {}
  return {
    id:             row.id,
    title:          row.title || '',
    category:       row.category || '',
    status:         row.status || '',
    statusType:     row.status_type || '',
    clearance:      row.clearance || '',
    leadDetective:  row.lead_detective || '',
    date:           row.report_date || '',
    summary:        row.summary || '',
    evidence
  };
}

function getCachedReports() {
  return CACHE.reports || [];
}

async function dbUpsertReport(report) {
  const row = reportToRow(report);
  const idx = CACHE.reports.findIndex(r => r.id === report.id);
  if (idx >= 0) CACHE.reports[idx] = { ...CACHE.reports[idx], ...row };
  else CACHE.reports.unshift(row);

  if (!db) {
    localStorage.setItem('dd_confidential_reports', JSON.stringify(getCachedReports().map(rowToReport)));
    return;
  }
  try {
    const { error } = await db.from('reports').upsert(row, { onConflict: 'id' });
    if (error) console.warn('[DB] upsert report error:', error);
  } catch (e) {
    console.warn('[DB] upsert report exception:', e);
    localStorage.setItem('dd_confidential_reports', JSON.stringify(getCachedReports().map(rowToReport)));
  }
}

async function dbDeleteReport(reportId) {
  CACHE.reports = CACHE.reports.filter(r => r.id !== reportId);
  if (!db) {
    localStorage.setItem('dd_confidential_reports', JSON.stringify(getCachedReports().map(rowToReport)));
    return;
  }
  try {
    const { error } = await db.from('reports').delete().eq('id', reportId);
    if (error) console.warn('[DB] delete report error:', error);
  } catch (e) {
    console.warn('[DB] delete report exception:', e);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  TIPS (DENUNCIAS ANÓNIMAS)
// ─────────────────────────────────────────────────────────────────────────────

function tipToRow(tip) {
  return {
    code:        tip.code,
    category:    tip.category || '',
    location:    tip.location || '',
    description: tip.desc || tip.description || '',
    priority:    tip.priority || '',
    contact:     tip.contact || 'ANÓNIMO PROTEGIDO',
    status:      tip.status || 'RECIBIDA // EN REVISIÓN POR ANALISTA FORENSE'
  };
}

function rowToTip(row) {
  return {
    code:     row.code,
    category: row.category || '',
    location: row.location || '',
    desc:     row.description || '',
    priority: row.priority || '',
    contact:  row.contact || 'ANÓNIMO ABSOLUTO',
    date:     row.created_at
      ? new Date(row.created_at).toLocaleString('es-ES')
      : new Date().toLocaleString('es-ES'),
    status:   row.status || 'RECIBIDA // EN REVISIÓN POR ANALISTA FORENSE'
  };
}

function getCachedTips() {
  return CACHE.tips || [];
}

async function dbInsertTip(tip) {
  const row = tipToRow(tip);
  // Add synthetic date for immediate display
  CACHE.tips.unshift({
    ...row,
    created_at: new Date().toISOString()
  });

  if (!db) {
    localStorage.setItem('lspd_rp_tips', JSON.stringify(getCachedTips().map(rowToTip)));
    return;
  }
  try {
    const { error } = await db.from('tips').insert(row);
    if (error) console.warn('[DB] insert tip error:', error);
  } catch (e) {
    console.warn('[DB] insert tip exception:', e);
    localStorage.setItem('lspd_rp_tips', JSON.stringify(getCachedTips().map(rowToTip)));
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  CASES (EXPEDIENTES)
// ─────────────────────────────────────────────────────────────────────────────

function caseToRow(c) {
  return {
    id:              c.id,
    title:           c.title || '',
    division:        c.division || '',
    category:        c.category || '',
    status:          c.status || '',
    status_type:     c.statusType || '',
    priority:        c.priority || '',
    lead_detective:  c.leadDetective || '',
    case_date:       c.date || '',
    location:        c.location || '',
    summary:         c.summary || '',
    evidence:        JSON.stringify(c.evidence || []),
    suspects:        JSON.stringify(c.suspects || []),
    image:           c.image || ''
  };
}

function rowToCase(row) {
  let evidence = [], suspects = [];
  try { evidence = Array.isArray(row.evidence) ? row.evidence : JSON.parse(row.evidence || '[]'); } catch(e) {}
  try { suspects = Array.isArray(row.suspects) ? row.suspects : JSON.parse(row.suspects || '[]'); } catch(e) {}
  return {
    id:             row.id,
    title:          row.title || '',
    division:       row.division || '',
    category:       row.category || '',
    status:         row.status || '',
    statusType:     row.status_type || '',
    priority:       row.priority || '',
    leadDetective:  row.lead_detective || '',
    date:           row.case_date || '',
    location:       row.location || '',
    summary:        row.summary || '',
    evidence,
    suspects,
    image:          row.image || ''
  };
}

function getCachedCases() {
  return CACHE.cases || [];
}

async function dbUpsertCase(c) {
  const row = caseToRow(c);
  const idx = CACHE.cases.findIndex(r => r.id === c.id);
  if (idx >= 0) CACHE.cases[idx] = { ...CACHE.cases[idx], ...row };
  else CACHE.cases.unshift(row);

  if (!db) {
    localStorage.setItem('dd_custom_cases', JSON.stringify(getCachedCases().map(rowToCase)));
    return;
  }
  try {
    const { error } = await db.from('cases').upsert(row, { onConflict: 'id' });
    if (error) console.warn('[DB] upsert case error:', error);
  } catch (e) {
    console.warn('[DB] upsert case exception:', e);
    localStorage.setItem('dd_custom_cases', JSON.stringify(getCachedCases().map(rowToCase)));
  }
}

async function dbDeleteCase(caseId) {
  CACHE.cases = CACHE.cases.filter(r => r.id !== caseId);
  if (!db) {
    localStorage.setItem('dd_custom_cases', JSON.stringify(getCachedCases().map(rowToCase)));
    return;
  }
  try {
    const { error } = await db.from('cases').delete().eq('id', caseId);
    if (error) console.warn('[DB] delete case error:', error);
  } catch (e) {
    console.warn('[DB] delete case exception:', e);
  }
}

