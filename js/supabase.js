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
  ranks:     null,  // array of DB rows (snake_case)
  agents:    null,  // array of DB rows (snake_case)
  auditLogs: null,  // array of DB rows
  reports:   null,  // array of DB rows
  tips:      null,  // array of DB rows
  cases:     null,  // array of DB rows
  wanted:    null,  // array of DB rows (Los Más Buscados)
  loaded:    false
};

// ─── DB STATUS INDICATOR & LIVE SYNC PULSE ──────────────────────────────────
let _syncPulseTimeout = null;

function showDBStatus(state) {
  const dot  = document.getElementById('db-status-indicator');
  const text = document.getElementById('db-status-text');
  if (!dot || !text) return;
  dot.classList.remove('bg-amber-400', 'bg-emerald-400', 'bg-red-500', 'bg-cyan-400', 'animate-pulse', 'animate-ping');

  if (state === 'connecting') {
    dot.classList.add('bg-amber-400', 'animate-pulse');
    text.textContent = 'Conectando BD…';
    text.classList.remove('text-cyan-400');
  } else if (state === 'online') {
    dot.classList.add('bg-emerald-400');
    text.textContent = 'Supabase OK';
    text.classList.remove('text-cyan-400');
  } else {
    dot.classList.add('bg-red-500');
    text.textContent = 'BD offline';
    text.classList.remove('text-cyan-400');
  }
}

function showDBSyncPulse(label = 'Sincronizado en vivo') {
  const dot  = document.getElementById('db-status-indicator');
  const text = document.getElementById('db-status-text');
  if (!dot || !text) return;

  dot.classList.remove('bg-amber-400', 'bg-red-500', 'bg-emerald-400');
  dot.classList.add('bg-cyan-400', 'animate-ping');
  text.textContent = label;
  text.classList.add('text-cyan-400');

  clearTimeout(_syncPulseTimeout);
  _syncPulseTimeout = setTimeout(() => {
    dot.classList.remove('animate-ping', 'bg-cyan-400');
    dot.classList.add('bg-emerald-400');
    text.textContent = 'Supabase OK';
    text.classList.remove('text-cyan-400');
  }, 2200);
}

// ─── INIT — parallel load of all tables ──────────────────────────────────────
async function initSupabase() {
  if (!db) {
    console.warn('[DB] No Supabase client — falling back to localStorage');
    _loadFromLocalStorage();
    showDBStatus('offline');
    return;
  }

  showDBStatus('connecting');

  try {
    const [ranksRes, agentsRes, logsRes, reportsRes, tipsRes, casesRes, wantedRes] = await Promise.all([
      db.from('ranks').select('*').order('level', { ascending: false }),
      db.from('agents').select('*').order('created_at', { ascending: true }),
      db.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(200),
      db.from('reports').select('*').order('report_date', { ascending: false }),
      db.from('tips').select('*').order('created_at', { ascending: false }),
      db.from('cases').select('*').order('case_date', { ascending: false }),
      db.from('wanted').select('*').order('level', { ascending: false })
    ]);

    // Critical check on agents
    if (agentsRes.error) throw agentsRes.error;

    // Ranks: if table empty or not created yet, seed from default
    if (ranksRes.data && ranksRes.data.length > 0) {
      CACHE.ranks = ranksRes.data;
    } else {
      CACHE.ranks = _getDefaultRanksRows();
      _seedDefaultRanksToSupabase();
    }

    // Wanted: if table empty or not created yet, seed from default
    if (wantedRes.data && wantedRes.data.length > 0) {
      CACHE.wanted = wantedRes.data;
      _sortCachedWanted();
    } else {
      CACHE.wanted = _getDefaultWantedRows();
      _sortCachedWanted();
      _seedDefaultWantedToSupabase();
    }

    CACHE.agents    = agentsRes.data   || [];
    CACHE.auditLogs = logsRes.data     || [];
    CACHE.reports   = reportsRes.error  ? [] : (reportsRes.data || []);
    CACHE.tips      = tipsRes.error     ? [] : (tipsRes.data    || []);
    CACHE.cases     = casesRes.error    ? [] : (casesRes.data   || []);
    CACHE.loaded    = true;

    // ─── LIMPIEZA: filtrar agentes de ejemplo, pero NO sobreescribir la BD ───
    CACHE.agents = CACHE.agents.filter(r => !_EXAMPLE_AGENT_IDS.includes(r.discord_id));

    // Si la tabla de agentes estuviera completamente vacía, asegurar al fundador inicial
    if (CACHE.agents.length === 0) {
      CACHE.agents = [{ ..._FOUNDER_ROW }];
      try {
        await db.from('agents').upsert(_FOUNDER_ROW, { onConflict: 'discord_id' });
      } catch(e) {}
    }

    showDBStatus('online');
    console.log('[DB] Supabase cargado — rangos:', CACHE.ranks.length,
      '| agentes:', CACHE.agents.length,
      '| logs:', CACHE.auditLogs.length,
      '| reports:', CACHE.reports.length,
      '| tips:', CACHE.tips.length,
      '| cases:', CACHE.cases.length,
      '| wanted:', CACHE.wanted.length);

    // Subscribe to realtime & broadcast sync
    _subscribeRealtime();

  } catch (err) {
    console.warn('[DB] Supabase load error — usando localStorage como fallback:', err);
    _loadFromLocalStorage();
    showDBStatus('offline');
  }
}

// ─── LOCALSTORAGE FALLBACK ───────────────────────────────────────────────────
function _loadFromLocalStorage() {
  try {
    const ranksRaw = localStorage.getItem('dd_custom_ranks');
    CACHE.ranks = ranksRaw ? JSON.parse(ranksRaw).map(rankToRow) : _getDefaultRanksRows();
  } catch (e) { CACHE.ranks = _getDefaultRanksRows(); }

  try {
    const wantedRaw = localStorage.getItem('dd_custom_wanted');
    CACHE.wanted = wantedRaw ? JSON.parse(wantedRaw).map(wantedToRow) : _getDefaultWantedRows();
    _sortCachedWanted();
  } catch (e) { CACHE.wanted = _getDefaultWantedRows(); _sortCachedWanted(); }

  try {
    const rosterRaw = localStorage.getItem('dd_jefatura_roster');
    CACHE.agents = rosterRaw ? JSON.parse(rosterRaw).map(agentToRow) : [];
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

// ─── DEDUPLICATION HELPER ───────────────────────────────────────────────────
const _recentlyProcessed = new Map();
function _shouldProcess(key) {
  const now = Date.now();
  const last = _recentlyProcessed.get(key) || 0;
  if (now - last < 400) return false;
  _recentlyProcessed.set(key, now);
  if (_recentlyProcessed.size > 200) {
    for (const [k, t] of _recentlyProcessed.entries()) {
      if (now - t > 5000) _recentlyProcessed.delete(k);
    }
  }
  return true;
}

// ─── BROADCAST CHANNEL (PEER-TO-PEER INSTANT REALTIME) ──────────────────────
let _liveBroadcastChannel = null;

function _initBroadcastChannel() {
  if (!db) return;
  try {
    _liveBroadcastChannel = db.channel('dd-live-sync', {
      config: { broadcast: { self: false } }
    });
    _liveBroadcastChannel
      .on('broadcast', { event: 'dd-sync' }, (payload) => {
        if (!payload || !payload.payload) return;
        _handleLiveBroadcastMessage(payload.payload);
      })
      .subscribe((status) => {
        console.log('[DB] Canal Broadcast dd-live-sync:', status);
      });
  } catch (e) {
    console.warn('[DB] Broadcast channel init failed:', e);
  }
}

async function _broadcastLiveSync(entity, action, data) {
  if (!_liveBroadcastChannel) return;
  try {
    const sender = (typeof currentDiscordUser !== 'undefined' && currentDiscordUser)
      ? (currentDiscordUser.username || currentDiscordUser.icName || 'Oficial')
      : 'Oficial';
    await _liveBroadcastChannel.send({
      type: 'broadcast',
      event: 'dd-sync',
      payload: { entity, action, data, sender, timestamp: Date.now() }
    });
  } catch (e) {
    console.warn('[DB] Broadcast send failed:', e);
  }
}

function _handleLiveBroadcastMessage(msg) {
  if (!msg || !msg.entity) return;
  const { entity, action, data, sender } = msg;
  _dispatchEntityUpdate(entity, action, data, 'broadcast', sender);
}

// ─── POSTGRES CHANGES REALTIME (SUPABASE REALTIME) ──────────────────────────
let _pgRealtimeChannel = null;

function _subscribeRealtime() {
  if (!db) return;

  _initBroadcastChannel();

  try {
    _pgRealtimeChannel = db.channel('dd-all-tables-rt');

    _pgRealtimeChannel
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ranks' }, (payload) => {
        _dispatchEntityUpdate('ranks', payload.eventType, payload.eventType === 'DELETE' ? payload.old : payload.new, 'postgres');
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'agents' }, (payload) => {
        _dispatchEntityUpdate('agents', payload.eventType, payload.eventType === 'DELETE' ? payload.old : payload.new, 'postgres');
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'cases' }, (payload) => {
        _dispatchEntityUpdate('cases', payload.eventType, payload.eventType === 'DELETE' ? payload.old : payload.new, 'postgres');
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reports' }, (payload) => {
        _dispatchEntityUpdate('reports', payload.eventType, payload.eventType === 'DELETE' ? payload.old : payload.new, 'postgres');
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tips' }, (payload) => {
        _dispatchEntityUpdate('tips', payload.eventType, payload.eventType === 'DELETE' ? payload.old : payload.new, 'postgres');
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'audit_logs' }, (payload) => {
        _dispatchEntityUpdate('audit_logs', payload.eventType, payload.eventType === 'DELETE' ? payload.old : payload.new, 'postgres');
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'wanted' }, (payload) => {
        _dispatchEntityUpdate('wanted', payload.eventType, payload.eventType === 'DELETE' ? payload.old : payload.new, 'postgres');
      })
      .subscribe((status) => {
        console.log('[DB] Canal Postgres Realtime dd-all-tables-rt:', status);
      });

    // Gentle background sync every 15s for total consistency
    setInterval(_backgroundSyncAll, 15000);

  } catch (e) {
    console.warn('[DB] Realtime subscribe error:', e);
  }
}

// ─── DISPATCH ENTITY UPDATES TO SPECIALIZED HANDLERS ─────────────────────────
function _dispatchEntityUpdate(entity, action, data, source = 'postgres', sender = '') {
  if (!data) return;
  const dedupKey = `${entity}:${action}:${data.id || data.discord_id || data.discordId || data.code || ''}`;
  if (!_shouldProcess(dedupKey)) return;

  console.log(`[DB Realtime] Sincronizando ${entity} [${action}] vía ${source}`);

  if (entity === 'agents') {
    _handleAgentsRealtime(action, data, sender);
  } else if (entity === 'ranks') {
    _handleRanksRealtime(action, data, sender);
  } else if (entity === 'cases') {
    _handleCasesRealtime(action, data, sender);
  } else if (entity === 'reports') {
    _handleReportsRealtime(action, data, sender);
  } else if (entity === 'tips') {
    _handleTipsRealtime(action, data, sender);
  } else if (entity === 'audit_logs') {
    _handleAuditLogsRealtime(action, data, sender);
  } else if (entity === 'wanted') {
    _handleWantedRealtime(action, data, sender);
  }
}

// ─── 1. AGENTS REALTIME HANDLER ──────────────────────────────────────────────
function _handleAgentsRealtime(action, row, sender) {
  const discordId = row.discord_id || row.discordId;
  if (!discordId) return;

  const rowData = row.discord_id ? row : agentToRow(row);

  if (action === 'DELETE') {
    CACHE.agents = CACHE.agents.filter(a => a.discord_id !== discordId);
  } else {
    const idx = CACHE.agents.findIndex(a => a.discord_id === discordId);
    if (idx >= 0) CACHE.agents[idx] = { ...CACHE.agents[idx], ...rowData };
    else CACHE.agents.push(rowData);
  }

  try {
    localStorage.setItem('dd_jefatura_roster', JSON.stringify(CACHE.agents.map(rowToAgent)));
  } catch(e) {}

  // Si el oficial modificado es el usuario de esta sesión
  if (typeof currentDiscordUser !== 'undefined' && currentDiscordUser && currentDiscordUser.id === discordId) {
    if (action === 'DELETE' || rowData.status === 'Expulsado') {
      currentDiscordUser.rankKey = 'aspirante';
      currentDiscordUser.role = 'Expulsado // Sin Acceso';
      currentDiscordUser.isAuthorizedDetective = false;
      currentDiscordUser.isHighCommand = false;
      localStorage.setItem('dd_discord_user', JSON.stringify(currentDiscordUser));
      if (typeof updateDiscordAuthUI === 'function') updateDiscordAuthUI();
      if (typeof showToast === 'function') showToast("🚨 JEFATURA: Has sido dado de baja de la Detective Division.");
      if (typeof audioEngine !== 'undefined' && audioEngine.playAlertSound) audioEngine.playAlertSound();
    } else {
      const oldRank = currentDiscordUser.rankKey;
      const newRank = rowData.rank || 'aspirante';
      const rankMeta = (typeof RANK_META !== 'undefined' && RANK_META[newRank]) ? RANK_META[newRank] : null;

      currentDiscordUser.rankKey   = newRank;
      currentDiscordUser.badge     = rowData.badge || currentDiscordUser.badge;
      currentDiscordUser.role      = rowData.ic_name || currentDiscordUser.role;
      currentDiscordUser.rankLevel = rankMeta ? rankMeta.level : 0;
      currentDiscordUser.clearance = rankMeta ? rankMeta.clearance : 'NIVEL 0';
      if (typeof hasPermission === 'function') {
        currentDiscordUser.isAuthorizedDetective = hasPermission('view_reports');
        currentDiscordUser.isHighCommand = hasPermission('manage_roster') || hasPermission('manage_ranks') || hasPermission('manage_audit') || (rankMeta && rankMeta.level >= 4);
      }
      localStorage.setItem('dd_discord_user', JSON.stringify(currentDiscordUser));
      if (typeof updateDiscordAuthUI === 'function') updateDiscordAuthUI();
      if (oldRank !== newRank) {
        if (typeof showToast === 'function') showToast(`🔄 JEFATURA: Tu rango ha sido actualizado a ${rankMeta ? rankMeta.label : newRank}.`);
        if (typeof audioEngine !== 'undefined' && audioEngine.playAlertSound) audioEngine.playAlertSound();
      }
    }
  }

  _refreshJefaturaViews();
  showDBSyncPulse('Agentes actualizados');
}

// ─── 2. RANKS REALTIME HANDLER ───────────────────────────────────────────────
function _handleRanksRealtime(action, row, sender) {
  const rankId = row.id;
  if (!rankId) return;

  const rowData = row.badge_class !== undefined ? row : rankToRow(row);

  if (action === 'DELETE') {
    CACHE.ranks = CACHE.ranks.filter(r => r.id !== rankId);
  } else {
    const idx = CACHE.ranks.findIndex(r => r.id === rankId);
    if (idx >= 0) CACHE.ranks[idx] = { ...CACHE.ranks[idx], ...rowData };
    else CACHE.ranks.push(rowData);
    CACHE.ranks.sort((a, b) => Number(b.level) - Number(a.level));
  }

  try {
    localStorage.setItem('dd_custom_ranks', JSON.stringify(CACHE.ranks.map(rowToRank)));
  } catch(e) {}

  // Si el usuario actual tiene este rango, recalcular permisos
  if (typeof currentDiscordUser !== 'undefined' && currentDiscordUser && currentDiscordUser.rankKey === rankId) {
    const rankObj = rowToRank(rowData);
    currentDiscordUser.role = rankObj.label || currentDiscordUser.role;
    currentDiscordUser.rankLevel = rankObj.level;
    currentDiscordUser.clearance = rankObj.clearance;
    if (typeof hasPermission === 'function') {
      currentDiscordUser.isAuthorizedDetective = hasPermission('view_reports');
      currentDiscordUser.isHighCommand = hasPermission('manage_roster') || hasPermission('manage_ranks') || hasPermission('manage_audit') || rankObj.level >= 4;
    }
    localStorage.setItem('dd_discord_user', JSON.stringify(currentDiscordUser));
    if (typeof updateDiscordAuthUI === 'function') updateDiscordAuthUI();
    if (typeof showToast === 'function') showToast(`🛡️ Permisos del rango "${rankObj.label}" actualizados en vivo.`);
  }

  if (typeof renderDynamicRanks === 'function') renderDynamicRanks();
  _refreshJefaturaViews();
  showDBSyncPulse('Rangos sincronizados');
}

// ─── 3. CASES REALTIME HANDLER ───────────────────────────────────────────────
function _handleCasesRealtime(action, row, sender) {
  const caseId = row.id;
  if (!caseId) return;

  const rowData = row.case_date !== undefined ? row : caseToRow(row);

  if (action === 'DELETE') {
    CACHE.cases = CACHE.cases.filter(c => c.id !== caseId);
  } else {
    const idx = CACHE.cases.findIndex(c => c.id === caseId);
    if (idx >= 0) CACHE.cases[idx] = { ...CACHE.cases[idx], ...rowData };
    else CACHE.cases.unshift(rowData);
  }

  try {
    localStorage.setItem('dd_custom_cases', JSON.stringify(CACHE.cases.map(rowToCase)));
  } catch(e) {}

  if (typeof renderCases === 'function' && typeof getActiveCasesList === 'function') {
    renderCases(getActiveCasesList());
  }

  // Si el modal de caso está abierto
  const caseModal = document.getElementById('case-modal');
  if (caseModal && !caseModal.classList.contains('hidden')) {
    const openCaseId = typeof currentEditingCaseId !== 'undefined' ? currentEditingCaseId : null;
    if (openCaseId === caseId) {
      if (action === 'DELETE') {
        if (typeof closeModal === 'function') closeModal('case-modal');
        if (typeof showToast === 'function') showToast(`⚠️ El expediente ${caseId} ha sido eliminado por otro oficial.`);
      } else {
        if (typeof openCaseModal === 'function') openCaseModal(caseId);
      }
    }
  }

  showDBSyncPulse('Expedientes al día');
}

// ─── 4. REPORTS REALTIME HANDLER ─────────────────────────────────────────────
function _handleReportsRealtime(action, row, sender) {
  const repId = row.id;
  if (!repId) return;

  const rowData = row.report_date !== undefined ? row : reportToRow(row);

  if (action === 'DELETE') {
    CACHE.reports = CACHE.reports.filter(r => r.id !== repId);
  } else {
    const idx = CACHE.reports.findIndex(r => r.id === repId);
    if (idx >= 0) CACHE.reports[idx] = { ...CACHE.reports[idx], ...rowData };
    else CACHE.reports.unshift(rowData);
  }

  try {
    localStorage.setItem('dd_confidential_reports', JSON.stringify(CACHE.reports.map(rowToReport)));
  } catch(e) {}

  if (typeof renderConfidentialReports === 'function' && typeof getActiveConfidentialReports === 'function') {
    renderConfidentialReports(getActiveConfidentialReports());
  }

  const repModal = document.getElementById('confidential-report-modal');
  if (repModal && !repModal.classList.contains('hidden')) {
    const viewingId = typeof currentViewingConfidentialReportId !== 'undefined' ? currentViewingConfidentialReportId : null;
    if (viewingId === repId) {
      if (action === 'DELETE') {
        if (typeof closeModal === 'function') closeModal('confidential-report-modal');
        if (typeof showToast === 'function') showToast(`⚠️ El informe clasificado ${repId} ha sido eliminado.`);
      } else {
        if (typeof window.openConfidentialReport === 'function') window.openConfidentialReport(repId);
      }
    }
  }

  showDBSyncPulse('Informes actualizados');
}

// ─── 5. TIPS REALTIME HANDLER ────────────────────────────────────────────────
function _handleTipsRealtime(action, row, sender) {
  const code = row.code;
  if (!code) return;

  const rowData = row.created_at !== undefined ? row : tipToRow(row);

  if (action === 'DELETE') {
    CACHE.tips = CACHE.tips.filter(t => t.code !== code);
  } else {
    const idx = CACHE.tips.findIndex(t => t.code === code);
    if (idx >= 0) CACHE.tips[idx] = { ...CACHE.tips[idx], ...rowData };
    else CACHE.tips.unshift(rowData);
  }

  try {
    localStorage.setItem('lspd_rp_tips', JSON.stringify(CACHE.tips.map(rowToTip)));
  } catch(e) {}

  if (typeof renderAuthorizedTipsInbox === 'function') {
    renderAuthorizedTipsInbox();
  }

  if (action === 'INSERT') {
    if (typeof hasPermission === 'function' && hasPermission('view_tips')) {
      if (typeof showToast === 'function') showToast(`🔔 NUEVA DENUNCIA CIUDADANA [${code}] recibida.`);
      if (typeof audioEngine !== 'undefined' && audioEngine.playRadioBeep) audioEngine.playRadioBeep();
    }
  }

  showDBSyncPulse('Denuncias sincronizadas');
}

// ─── 6. AUDIT LOGS REALTIME HANDLER ──────────────────────────────────────────
function _handleAuditLogsRealtime(action, row, sender) {
  const rowData = row.created_at !== undefined ? row : {
    id: row.id || ('LOG-' + Date.now()),
    action: row.action || '',
    agent_name: row.agentName || row.agent_name || '',
    discord_tag: row.discordTag || row.discord_tag || '',
    detail: row.detail || '',
    commander: row.commander || 'Sistema',
    created_at: new Date().toISOString()
  };

  if (action === 'CLEAR') {
    CACHE.auditLogs = [];
  } else {
    CACHE.auditLogs.unshift(rowData);
    if (CACHE.auditLogs.length > 200) CACHE.auditLogs.splice(200);
  }

  if (typeof renderAuditLogs === 'function') renderAuditLogs();
  showDBSyncPulse('Auditoría sincronizada');
}

// ─── 7. WANTED (MÁS BUSCADOS) REALTIME HANDLER ───────────────────────────────
function _handleWantedRealtime(action, row, sender) {
  const wantedId = row.id;
  if (!wantedId) return;

  const rowData = row.is_pinned !== undefined ? row : wantedToRow(row);

  if (!CACHE.wanted) CACHE.wanted = [];

  if (action === 'DELETE') {
    CACHE.wanted = CACHE.wanted.filter(w => w.id !== wantedId);
  } else {
    const idx = CACHE.wanted.findIndex(w => w.id === wantedId);
    if (idx >= 0) CACHE.wanted[idx] = { ...CACHE.wanted[idx], ...rowData };
    else CACHE.wanted.unshift(rowData);
  }

  _sortCachedWanted();

  try {
    localStorage.setItem('dd_custom_wanted', JSON.stringify(CACHE.wanted.map(rowToWanted)));
  } catch(e) {}

  if (typeof renderMostWanted === 'function' && typeof getActiveWantedList === 'function') {
    renderMostWanted(getActiveWantedList());
  }

  showDBSyncPulse('Fugitivos sincronizados');
}

// ─── BACKGROUND GENTLE SYNC (FALLBACK CADA 15S) ─────────────────────────────
async function _backgroundSyncAll() {
  if (!db || !navigator.onLine) return;
  try {
    const [ranksRes, agentsRes, casesRes, reportsRes, tipsRes, logsRes, wantedRes] = await Promise.all([
      db.from('ranks').select('*').order('level', { ascending: false }),
      db.from('agents').select('*').order('created_at', { ascending: true }),
      db.from('cases').select('*').order('case_date', { ascending: false }),
      db.from('reports').select('*').order('report_date', { ascending: false }),
      db.from('tips').select('*').order('created_at', { ascending: false }),
      db.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(200),
      db.from('wanted').select('*').order('level', { ascending: false })
    ]);

    let changed = false;

    if (ranksRes.data && JSON.stringify(ranksRes.data) !== JSON.stringify(CACHE.ranks)) {
      CACHE.ranks = ranksRes.data;
      if (typeof renderDynamicRanks === 'function') renderDynamicRanks();
      changed = true;
    }

    if (agentsRes.data && JSON.stringify(agentsRes.data) !== JSON.stringify(CACHE.agents)) {
      CACHE.agents = agentsRes.data;
      if (typeof renderJefaturaRoster === 'function') renderJefaturaRoster(CACHE.agents.map(rowToAgent));
      if (typeof renderJefaturaKPIs === 'function') renderJefaturaKPIs();
      changed = true;
    }

    if (casesRes.data && JSON.stringify(casesRes.data) !== JSON.stringify(CACHE.cases)) {
      CACHE.cases = casesRes.data;
      if (typeof renderCases === 'function' && typeof getActiveCasesList === 'function') {
        renderCases(getActiveCasesList());
      }
      changed = true;
    }

    if (reportsRes.data && JSON.stringify(reportsRes.data) !== JSON.stringify(CACHE.reports)) {
      CACHE.reports = reportsRes.data;
      if (typeof renderConfidentialReports === 'function' && typeof getActiveConfidentialReports === 'function') {
        renderConfidentialReports(getActiveConfidentialReports());
      }
      changed = true;
    }

    if (tipsRes.data && JSON.stringify(tipsRes.data) !== JSON.stringify(CACHE.tips)) {
      CACHE.tips = tipsRes.data;
      if (typeof renderAuthorizedTipsInbox === 'function') renderAuthorizedTipsInbox();
      changed = true;
    }

    if (logsRes.data && JSON.stringify(logsRes.data) !== JSON.stringify(CACHE.auditLogs)) {
      CACHE.auditLogs = logsRes.data;
      if (typeof renderAuditLogs === 'function') renderAuditLogs();
      changed = true;
    }

    if (wantedRes.data && JSON.stringify(wantedRes.data) !== JSON.stringify(CACHE.wanted)) {
      CACHE.wanted = wantedRes.data;
      _sortCachedWanted();
      if (typeof renderMostWanted === 'function' && typeof getActiveWantedList === 'function') {
        renderMostWanted(getActiveWantedList());
      }
      changed = true;
    }

    if (changed) {
      showDBSyncPulse('Sincronizado');
    }
  } catch(e) {
    // Silencioso en fondo
  }
}

function _refreshJefaturaViews() {
  const jefSection = document.getElementById('jefatura');
  if (jefSection && !jefSection.classList.contains('hidden')) {
    if (typeof renderJefaturaRoster === 'function') {
      renderJefaturaRoster(getCachedRoster().map(rowToAgent));
    }
    if (typeof renderJefaturaKPIs === 'function') renderJefaturaKPIs();
    if (typeof renderDynamicRanks === 'function') renderDynamicRanks();
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  RANKS & PERMISSIONS
// ─────────────────────────────────────────────────────────────────────────────

const DEFAULT_RANKS_SEED = [
  {
    id: 'capitan',
    label: 'Capitán de División',
    level: 5,
    clearance: 'NIVEL 5 // COMANDO SUPREMO',
    icon: '👑',
    color: 'amber',
    badgeClass: 'rank-badge-capitan',
    isSystem: true,
    permissions: {
      view_cases: true, create_cases: true, edit_cases: true, delete_cases: true,
      view_reports: true, create_reports: true, edit_reports: true, delete_reports: true,
      view_tips: true, delete_tips: true,
      manage_roster: true, change_ranks: true, kick_agents: true, manage_ranks: true, manage_audit: true
    }
  },
  {
    id: 'teniente',
    label: 'Teniente de División',
    level: 4,
    clearance: 'NIVEL 4 // SUPERVISIÓN OPERATIVA',
    icon: '⭐',
    color: 'blue',
    badgeClass: 'rank-badge-teniente',
    isSystem: false,
    permissions: {
      view_cases: true, create_cases: true, edit_cases: true, delete_cases: true,
      view_reports: true, create_reports: true, edit_reports: true, delete_reports: false,
      view_tips: true, delete_tips: true,
      manage_roster: true, change_ranks: true, kick_agents: true, manage_ranks: false, manage_audit: true
    }
  },
  {
    id: 'sgt',
    label: 'Sargento de Detectives',
    level: 3.5,
    clearance: 'NIVEL 3.5 // MANDO DE TURNO',
    icon: '🔷',
    color: 'cyan',
    badgeClass: 'rank-badge-sgt',
    isSystem: false,
    permissions: {
      view_cases: true, create_cases: true, edit_cases: true, delete_cases: false,
      view_reports: true, create_reports: true, edit_reports: true, delete_reports: false,
      view_tips: true, delete_tips: false,
      manage_roster: true, change_ranks: false, kick_agents: false, manage_ranks: false, manage_audit: false
    }
  },
  {
    id: 'det3',
    label: 'Detective III',
    level: 3,
    clearance: 'NIVEL 3 // ALTO SECRETO',
    icon: '🔵',
    color: 'purple',
    badgeClass: 'rank-badge-det3',
    isSystem: false,
    permissions: {
      view_cases: true, create_cases: true, edit_cases: true, delete_cases: false,
      view_reports: true, create_reports: true, edit_reports: true, delete_reports: false,
      view_tips: true, delete_tips: false,
      manage_roster: false, change_ranks: false, kick_agents: false, manage_ranks: false, manage_audit: false
    }
  },
  {
    id: 'det2',
    label: 'Detective II',
    level: 2,
    clearance: 'NIVEL 2 // CONFIDENCIAL',
    icon: '🟢',
    color: 'emerald',
    badgeClass: 'rank-badge-det2',
    isSystem: false,
    permissions: {
      view_cases: true, create_cases: true, edit_cases: true, delete_cases: false,
      view_reports: true, create_reports: true, edit_reports: false, delete_reports: false,
      view_tips: true, delete_tips: false,
      manage_roster: false, change_ranks: false, kick_agents: false, manage_ranks: false, manage_audit: false
    }
  },
  {
    id: 'det1',
    label: 'Detective I',
    level: 1,
    clearance: 'NIVEL 1 // RESTRINGIDO',
    icon: '⬜',
    color: 'slate',
    badgeClass: 'rank-badge-det1',
    isSystem: false,
    permissions: {
      view_cases: true, create_cases: true, edit_cases: false, delete_cases: false,
      view_reports: true, create_reports: true, edit_reports: false, delete_reports: false,
      view_tips: false, delete_tips: false,
      manage_roster: false, change_ranks: false, kick_agents: false, manage_ranks: false, manage_audit: false
    }
  },
  {
    id: 'aspirante',
    label: 'Aspirante / Sin Asignar',
    level: 0,
    clearance: 'NIVEL 0 // SIN ACCESO',
    icon: '🔴',
    color: 'red',
    badgeClass: 'rank-badge-aspirante',
    isSystem: true,
    permissions: {
      view_cases: true, create_cases: false, edit_cases: false, delete_cases: false,
      view_reports: false, create_reports: false, edit_reports: false, delete_reports: false,
      view_tips: false, delete_tips: false,
      manage_roster: false, change_ranks: false, kick_agents: false, manage_ranks: false, manage_audit: false
    }
  }
];

function _getDefaultRanksRows() {
  return DEFAULT_RANKS_SEED.map(rankToRow);
}

async function _seedDefaultRanksToSupabase() {
  if (!db) return;
  try {
    const rows = _getDefaultRanksRows();
    await db.from('ranks').upsert(rows, { onConflict: 'id' });
  } catch (e) {
    console.warn('[DB] seed default ranks error:', e);
  }
}

function rankToRow(rank) {
  return {
    id:          rank.id,
    label:       rank.label || '',
    level:       Number(rank.level) || 0,
    clearance:   rank.clearance || '',
    icon:        rank.icon || '🛡️',
    color:       rank.color || 'slate',
    badge_class: rank.badgeClass || rank.badge_class || 'rank-badge-det1',
    is_system:   Boolean(rank.isSystem || rank.is_system),
    permissions: typeof rank.permissions === 'string'
      ? rank.permissions
      : JSON.stringify(rank.permissions || {})
  };
}

function rowToRank(row) {
  let perms = {};
  try {
    perms = typeof row.permissions === 'object' && row.permissions !== null
      ? row.permissions
      : JSON.parse(row.permissions || '{}');
  } catch (e) { perms = {}; }

  return {
    id:         row.id,
    label:      row.label || '',
    level:      Number(row.level) || 0,
    clearance:  row.clearance || '',
    icon:       row.icon || '🛡️',
    color:      row.color || 'slate',
    badgeClass: row.badge_class || 'rank-badge-det1',
    isSystem:   Boolean(row.is_system),
    permissions: perms
  };
}

function getCachedRanks() {
  return CACHE.ranks || [];
}

async function dbUpsertRank(rank) {
  const row = rankToRow(rank);
  const idx = CACHE.ranks.findIndex(r => r.id === rank.id);
  if (idx >= 0) CACHE.ranks[idx] = { ...CACHE.ranks[idx], ...row };
  else CACHE.ranks.push(row);

  // Sort by level descending
  CACHE.ranks.sort((a, b) => Number(b.level) - Number(a.level));

  // Fallback to localStorage
  try {
    localStorage.setItem('dd_custom_ranks', JSON.stringify(CACHE.ranks.map(rowToRank)));
  } catch (e) {}

  _broadcastLiveSync('ranks', 'UPSERT', row);

  if (!db) return;
  try {
    const { error } = await db.from('ranks').upsert(row, { onConflict: 'id' });
    if (error) console.warn('[DB] upsert rank error:', error);
  } catch (e) {
    console.warn('[DB] upsert rank exception:', e);
  }
}

async function dbDeleteRank(rankId) {
  CACHE.ranks = CACHE.ranks.filter(r => r.id !== rankId);
  try {
    localStorage.setItem('dd_custom_ranks', JSON.stringify(CACHE.ranks.map(rowToRank)));
  } catch (e) {}

  _broadcastLiveSync('ranks', 'DELETE', { id: rankId });

  if (!db) return;
  try {
    const { error } = await db.from('ranks').delete().eq('id', rankId);
    if (error) console.warn('[DB] delete rank error:', error);
  } catch (e) {
    console.warn('[DB] delete rank exception:', e);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  AGENTS
// ─────────────────────────────────────────────────────────────────────────────

/** camelCase agent → snake_case DB row */
function agentToRow(agent) {
  let awardsArr = [];
  if (Array.isArray(agent.awards)) {
    awardsArr = agent.awards;
  } else if (typeof agent.awards === 'string') {
    try {
      const p = JSON.parse(agent.awards);
      if (Array.isArray(p)) awardsArr = p;
      else if (agent.awards) awardsArr = [agent.awards];
    } catch(e) {
      if (agent.awards) awardsArr = [agent.awards];
    }
  }

  // Empaquetar metadatos (subdivisionRole, faltas) dentro de notes de forma segura
  // para que persistan en la base de datos sin requerir columnas extra inexistentes en Supabase
  let cleanNotes = agent.notes || '';
  let metaPayload = {
    subdivisionRole: agent.subdivisionRole || null,
    faltas: Array.isArray(agent.faltas) ? agent.faltas : (typeof agent.faltas === 'string' ? JSON.parse(agent.faltas || '[]') : [])
  };

  // Si notes ya contenía una cabecera [DD_META:...], extraer el texto original limpio
  const metaMatch = cleanNotes.match(/^\[DD_META:(.*?)\]\s*([\s\S]*)$/);
  if (metaMatch) {
    cleanNotes = metaMatch[2] || '';
  }

  const encodedNotes = `[DD_META:${JSON.stringify(metaPayload)}] ${cleanNotes}`.trim();

  return {
    discord_id:       String(agent.discordId || '').trim(),
    discord_tag:      agent.discordTag || '',
    ic_name:          agent.icName || '',
    badge:            agent.badge || '',
    rank:             agent.rank || 'aspirante',
    division:         agent.division || 'Sin Asignar // En Evaluación',
    status:           ['Activo','Pendiente','Suspendido','Expulsado'].includes(agent.status) ? agent.status : 'Activo',
    awards:           awardsArr,
    notes:            encodedNotes,
    avatar:           agent.avatar || '',
    join_date:        agent.joinDate || ''
  };
}

/** snake_case DB row → camelCase agent */
function rowToAgent(row) {
  let awards = [];
  try { awards = Array.isArray(row.awards) ? row.awards : JSON.parse(row.awards || '[]'); } catch(e) {}
  
  let subdivisionRole = row.subdivision_role || null;
  let faltas = [];
  let userNotes = row.notes || '';

  // Decodificar [DD_META:...] si existe en row.notes
  if (userNotes.startsWith('[DD_META:')) {
    const metaMatch = userNotes.match(/^\[DD_META:(.*?)\]\s*([\s\S]*)$/);
    if (metaMatch) {
      try {
        const meta = JSON.parse(metaMatch[1]);
        if (meta.subdivisionRole) subdivisionRole = meta.subdivisionRole;
        if (Array.isArray(meta.faltas)) faltas = meta.faltas;
      } catch(e) {}
      userNotes = metaMatch[2] || '';
    }
  }

  // Compatibilidad con columnas directas si existieran en el futuro
  if (!subdivisionRole && row.subdivisionRole) subdivisionRole = row.subdivisionRole;
  if (faltas.length === 0 && row.faltas) {
    try { faltas = typeof row.faltas === 'string' ? JSON.parse(row.faltas || '[]') : (row.faltas || []); } catch(e) {}
  }

  return {
    discordId:       row.discord_id,
    discordTag:      row.discord_tag || '',
    icName:          row.ic_name || '',
    badge:           row.badge || '',
    rank:            row.rank || 'aspirante',
    division:        row.division || '',
    status:          row.status || 'Pendiente',
    awards,
    notes:           userNotes,
    avatar:          row.avatar || '',
    joinDate:        row.join_date || '',
    subdivisionRole,
    faltas
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

  _broadcastLiveSync('agents', 'UPSERT', row);

  if (!db) {
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
  _broadcastLiveSync('agents', 'DELETE', { discord_id: discordId });

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

  CACHE.auditLogs.unshift(entry);
  if (CACHE.auditLogs.length > 200) CACHE.auditLogs.splice(200);

  const dbRow = {
    action:      action,
    agent_name:  agentName,
    discord_tag: discordTag,
    detail:      detail,
    commander:   commander || 'Sistema'
  };

  _broadcastLiveSync('audit_logs', 'INSERT', dbRow);

  if (!db) {
    localStorage.setItem('dd_audit_logs', JSON.stringify(CACHE.auditLogs));
    return;
  }
  try {
    const { error } = await db.from('audit_logs').insert(dbRow);
    if (error) console.warn('[DB] insert audit log error:', error);
  } catch (e) {
    console.warn('[DB] insert audit log exception:', e);
    localStorage.setItem('dd_audit_logs', JSON.stringify(CACHE.auditLogs));
  }
}

async function dbClearAuditLogs() {
  CACHE.auditLogs = [];
  _broadcastLiveSync('audit_logs', 'CLEAR', {});

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
  let evidenceArr = [];
  if (Array.isArray(report.evidence)) {
    evidenceArr = report.evidence;
  } else if (typeof report.evidence === 'string') {
    try {
      const p = JSON.parse(report.evidence);
      if (Array.isArray(p)) evidenceArr = p;
      else if (report.evidence) evidenceArr = [report.evidence];
    } catch(e) {
      if (report.evidence) evidenceArr = [report.evidence];
    }
  }

  // Empaquetar authorId dentro de summary si no hay columna author_id en Postgres
  let cleanSummary = report.summary || '';
  if (report.authorId || report.author_id) {
    const authorId = report.authorId || report.author_id;
    if (!cleanSummary.startsWith('[AUTHOR:')) {
      cleanSummary = `[AUTHOR:${authorId}] ${cleanSummary}`.trim();
    }
  }

  return {
    id:              report.id,
    title:           report.title || '',
    category:        report.category || '',
    status:          report.status || '',
    status_type:     report.statusType || '',
    clearance:       report.clearance || '',
    lead_detective:  report.leadDetective || '',
    report_date:     report.date || '',
    summary:         cleanSummary,
    evidence:        evidenceArr
  };
}

function rowToReport(row) {
  let evidence = [];
  try { evidence = Array.isArray(row.evidence) ? row.evidence : JSON.parse(row.evidence || '[]'); } catch(e) {}
  
  let summary = row.summary || '';
  let authorId = row.author_id || null;

  if (summary.startsWith('[AUTHOR:')) {
    const m = summary.match(/^\[AUTHOR:(.*?)\]\s*([\s\S]*)$/);
    if (m) {
      authorId = m[1];
      summary = m[2];
    }
  }

  return {
    id:             row.id,
    title:          row.title || '',
    category:       row.category || '',
    status:         row.status || '',
    statusType:     row.status_type || '',
    clearance:      row.clearance || '',
    leadDetective:  row.lead_detective || '',
    date:           row.report_date || '',
    summary,
    evidence,
    authorId
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

  _broadcastLiveSync('reports', 'UPSERT', row);

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
  _broadcastLiveSync('reports', 'DELETE', { id: reportId });

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
  CACHE.tips.unshift({
    ...row,
    created_at: new Date().toISOString()
  });

  _broadcastLiveSync('tips', 'INSERT', row);

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

async function dbDeleteTip(tipCode) {
  CACHE.tips = CACHE.tips.filter(r => r.code !== tipCode);
  _broadcastLiveSync('tips', 'DELETE', { code: tipCode });

  if (!db) {
    localStorage.setItem('lspd_rp_tips', JSON.stringify(getCachedTips().map(rowToTip)));
    return;
  }
  try {
    const { error } = await db.from('tips').delete().eq('code', tipCode);
    if (error) console.warn('[DB] delete tip error:', error);
  } catch (e) {
    console.warn('[DB] delete tip exception:', e);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  CASES (EXPEDIENTES)
// ─────────────────────────────────────────────────────────────────────────────

function caseToRow(c) {
  let evidenceArr = [];
  if (Array.isArray(c.evidence)) {
    evidenceArr = c.evidence;
  } else if (typeof c.evidence === 'string') {
    try {
      const p = JSON.parse(c.evidence);
      if (Array.isArray(p)) evidenceArr = p;
      else if (c.evidence) evidenceArr = [c.evidence];
    } catch(e) {
      if (c.evidence) evidenceArr = [c.evidence];
    }
  }

  let suspectsArr = [];
  if (Array.isArray(c.suspects)) {
    suspectsArr = c.suspects;
  } else if (typeof c.suspects === 'string') {
    try {
      const p = JSON.parse(c.suspects);
      if (Array.isArray(p)) suspectsArr = p;
      else if (c.suspects) suspectsArr = [c.suspects];
    } catch(e) {
      if (c.suspects) suspectsArr = [c.suspects];
    }
  }

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
    evidence:        evidenceArr,
    suspects:        suspectsArr,
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

  _broadcastLiveSync('cases', 'UPSERT', row);

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
  _broadcastLiveSync('cases', 'DELETE', { id: caseId });

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

// ─────────────────────────────────────────────────────────────────────────────
//  WANTED (FUGITIVOS MÁS BUSCADOS)
// ─────────────────────────────────────────────────────────────────────────────

const DEFAULT_WANTED_SEED = [
  {
    id: "WANTED-001",
    name: "Dante 'Ghost' Moretti",
    alias: "El Fantasma",
    charges: "Homicidio en Primer Grado, Posesión de Armamento Pesado, Conspiración",
    bounty: "$75,000",
    level: 5,
    dangerLevel: "EXTREMO // DISPARAR A LA VISTA",
    dangerColor: "bg-red-500/20 text-red-400 border-red-500",
    lastSeen: "Centro Financiero / Vinewood Hills",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    notes: "Ex-contratista militar privado. Experto en evasión y armamento supreso. Considerado armado y extremadamente letal.",
    isPinned: true,
    status: "Buscado"
  },
  {
    id: "WANTED-002",
    name: "Viktor Kozlov",
    alias: "El Capitán de Murmansk",
    charges: "Tráfico Internacional de Estupefacientes, Lavado de Dinero a Gran Escala",
    bounty: "$50,000",
    level: 4,
    dangerLevel: "ALTO RIESGO // ARMAS PESADAS",
    dangerColor: "bg-orange-500/20 text-orange-400 border-orange-500",
    lastSeen: "Puerto de Los Santos / Muelle 21",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
    notes: "Controla redes logísticas de contrabando marítimo. Suele viajar escoltado por mínimo 3 hombres con chalecos balísticos.",
    isPinned: false,
    status: "Buscado"
  },
  {
    id: "WANTED-003",
    name: "Elena 'Víbora' Delgado",
    alias: "La Reina del Fraude",
    charges: "Ciberataque Bancario, Clonación Masiva de Fondos, Extorsión",
    bounty: "$35,000",
    level: 2,
    dangerLevel: "RIESGO DE FUGA // MODERADO",
    dangerColor: "bg-yellow-500/20 text-yellow-300 border-yellow-500",
    lastSeen: "Aeropuerto Internacional / Pasaporte Falso",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    notes: "Especialista en falsificación de identidades federales y desvío de criptoactivos. No confrontativa pero con red de sobornos.",
    isPinned: false,
    status: "Buscado"
  },
  {
    id: "WANTED-004",
    name: "Jackson 'Reaper' Stone",
    alias: "El Carnicero",
    charges: "Secuestro Agravado, Tortura, Robo con Rehenes",
    bounty: "$60,000",
    level: 5,
    dangerLevel: "EXTREMO // PSICOPATÍA CONFIRMADA",
    dangerColor: "bg-red-500/20 text-red-400 border-red-500",
    lastSeen: "Condado de Blaine / Sandy Shores",
    photo: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=600&q=80",
    notes: "Inestable y violento. Portador de escopeta recortada y explosivos caseros. No negociar.",
    isPinned: true,
    status: "Buscado"
  }
];

function _getDefaultWantedRows() {
  return DEFAULT_WANTED_SEED.map(wantedToRow);
}

async function _seedDefaultWantedToSupabase() {
  if (!db) return;
  try {
    const rows = _getDefaultWantedRows();
    await db.from('wanted').upsert(rows, { onConflict: 'id' });
  } catch (e) {
    console.warn('[DB] seed default wanted error:', e);
  }
}

function _sortCachedWanted() {
  if (!Array.isArray(CACHE.wanted)) return;
  CACHE.wanted.sort((a, b) => {
    // 1. Pinned first
    const pinA = a.is_pinned === true || a.is_pinned === 'true';
    const pinB = b.is_pinned === true || b.is_pinned === 'true';
    if (pinA && !pinB) return -1;
    if (!pinA && pinB) return 1;
    // 2. Higher danger level first
    const lvlA = Number(a.level) || 0;
    const lvlB = Number(b.level) || 0;
    if (lvlB !== lvlA) return lvlB - lvlA;
    // 3. Name alphabetical
    return (a.name || '').localeCompare(b.name || '');
  });
}

function wantedToRow(w) {
  const lvl = Number(w.level) || 3;
  let dLevel = w.dangerLevel;
  let dColor = w.dangerColor;

  if (!dLevel || !dColor) {
    if (lvl >= 5) {
      dLevel = "EXTREMO // DISPARAR A LA VISTA";
      dColor = "bg-red-500/20 text-red-400 border-red-500";
    } else if (lvl === 4) {
      dLevel = "ALTO RIESGO // ARMAS PESADAS";
      dColor = "bg-orange-500/20 text-orange-400 border-orange-500";
    } else if (lvl === 3) {
      dLevel = "PRIORIDAD POLICIAL // VIGILANCIA";
      dColor = "bg-amber-500/20 text-amber-400 border-amber-500";
    } else if (lvl === 2) {
      dLevel = "RIESGO DE FUGA // MODERADO";
      dColor = "bg-yellow-500/20 text-yellow-300 border-yellow-500";
    } else {
      dLevel = "BÚSQUEDA ORDINARIA // TESTIGO";
      dColor = "bg-slate-500/20 text-slate-300 border-slate-500";
    }
  }

  return {
    id:           w.id,
    name:         w.name || '',
    alias:        w.alias || '',
    charges:      w.charges || '',
    bounty:       w.bounty || '$0',
    level:        lvl,
    danger_level: dLevel,
    danger_color: dColor,
    last_seen:    w.lastSeen || w.last_seen || '',
    photo:        w.photo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    notes:        w.notes || '',
    is_pinned:    Boolean(w.isPinned ?? w.is_pinned),
    status:       w.status || 'Buscado'
  };
}

function rowToWanted(row) {
  return {
    id:          row.id,
    name:        row.name || '',
    alias:       row.alias || '',
    charges:     row.charges || '',
    bounty:      row.bounty || '$0',
    level:       Number(row.level) || 3,
    dangerLevel: row.danger_level || 'ALTO RIESGO',
    dangerColor: row.danger_color || 'bg-amber-500/20 text-amber-400 border-amber-500',
    lastSeen:    row.last_seen || '',
    photo:       row.photo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    notes:       row.notes || '',
    isPinned:    Boolean(row.is_pinned),
    status:      row.status || 'Buscado'
  };
}

function getCachedWanted() {
  return CACHE.wanted || [];
}

async function dbUpsertWanted(w) {
  const row = wantedToRow(w);
  if (!CACHE.wanted) CACHE.wanted = [];
  const idx = CACHE.wanted.findIndex(item => item.id === w.id);
  if (idx >= 0) CACHE.wanted[idx] = { ...CACHE.wanted[idx], ...row };
  else CACHE.wanted.unshift(row);

  _sortCachedWanted();

  _broadcastLiveSync('wanted', 'UPSERT', row);

  try {
    localStorage.setItem('dd_custom_wanted', JSON.stringify(CACHE.wanted.map(rowToWanted)));
  } catch (e) {}

  if (!db) return;
  try {
    const { error } = await db.from('wanted').upsert(row, { onConflict: 'id' });
    if (error) console.warn('[DB] upsert wanted error:', error);
  } catch (e) {
    console.warn('[DB] upsert wanted exception:', e);
    try {
      localStorage.setItem('dd_custom_wanted', JSON.stringify(CACHE.wanted.map(rowToWanted)));
    } catch(err) {}
  }
}

async function dbDeleteWanted(wantedId) {
  if (!CACHE.wanted) CACHE.wanted = [];
  CACHE.wanted = CACHE.wanted.filter(w => w.id !== wantedId);
  _broadcastLiveSync('wanted', 'DELETE', { id: wantedId });

  try {
    localStorage.setItem('dd_custom_wanted', JSON.stringify(CACHE.wanted.map(rowToWanted)));
  } catch (e) {}

  if (!db) return;
  try {
    const { error } = await db.from('wanted').delete().eq('id', wantedId);
    if (error) console.warn('[DB] delete wanted error:', error);
  } catch (e) {
    console.warn('[DB] delete wanted exception:', e);
  }
}


// ─── PURGA DE AGENTES DE EJEMPLO Y SIEMBRA DEL FUNDADOR ─────────────────────
// IDs de ejemplo que siempre deben borrarse si existen en la BD
const _EXAMPLE_AGENT_IDS = [
  "101928374650192831",
  "201928374650192832",
  "404928374650192833",
  "512928374650192834",
  "522928374650192835",
  "999928374650192899"
];

const FOUNDER_DISCORD_ID = "760159743616090164";

const _FOUNDER_ROW = {
  discord_id:  FOUNDER_DISCORD_ID,
  discord_tag: "Fundador",
  ic_name:     "Cap. Fundador",
  badge:       "#001-DIV",
  rank:        "capitan",
  division:    "Mando Supremo // Bureau Executive",
  status:      "Activo",
  awards:      ["valor", "servicio", "merito"],
  notes:       "Fundador y Comandante Supremo de la Detective Division.",
  avatar:      "https://cdn.discordapp.com/embed/avatars/0.png",
  join_date:   new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()
};

async function _purgeExampleAgentsAndSeedFounder() {
  // 1. Always clean example IDs from in-memory cache
  CACHE.agents = CACHE.agents.filter(r => !_EXAMPLE_AGENT_IDS.includes(r.discord_id));

  // 2. Solo si la lista de agentes está totalmente vacía, sembrar al fundador
  if (CACHE.agents.length === 0) {
    CACHE.agents.unshift({ ..._FOUNDER_ROW });
  }

  if (!db) return;

  try {
    // Si la tabla de agentes en la BD está vacía, sembrar al fundador
    const { count, error: countErr } = await db.from('agents').select('*', { count: 'exact', head: true });
    if (!countErr && (count === 0 || count === null)) {
      await db.from('agents').upsert(_FOUNDER_ROW, { onConflict: 'discord_id' });
    }
  } catch (e) {
    console.warn('[DB] _purgeExampleAgentsAndSeedFounder error:', e);
  }
}



// ============================================================
// MENSAJES / CHAT JEFATURA ↔ AGENTES
// ============================================================

// Cache for messages (key: agentDiscordId, value: [])
if (!CACHE.messages) CACHE.messages = {};
if (!CACHE.solicitudes) CACHE.solicitudes = [];

/**
 * Send a message from currentUser to 'jefatura' or from jefatura to an agentId
 * @param {string} fromId
 * @param {string} toId - 'jefatura' or a discordId
 * @param {string} content
 */
async function dbSendMessage(fromId, toId, content) {
  const msg = {
    id: 'msg_' + Date.now() + '_' + Math.random().toString(36).slice(2,7),
    from_id: fromId,
    to_id: toId,
    content,
    created_at: new Date().toISOString(),
    read: false
  };

  // Update local cache
  const threadKey = [fromId, toId].sort().join('_');
  if (!CACHE.messages[threadKey]) CACHE.messages[threadKey] = [];
  CACHE.messages[threadKey].push(msg);

  // Always update localStorage
  try {
    const stored = JSON.parse(localStorage.getItem('dd_messages') || '{}');
    if (!stored[threadKey]) stored[threadKey] = [];
    stored[threadKey].push(msg);
    localStorage.setItem('dd_messages', JSON.stringify(stored));
  } catch(e) {}

  // Sync to audit_logs in Supabase for persistence across devices/reloads
  if (db) {
    try {
      await db.from('audit_logs').insert({
        action: 'CHAT_MENSAJE',
        agent_name: fromId,
        discord_tag: toId,
        detail: JSON.stringify(msg),
        commander: fromId === 'jefatura' ? 'Jefatura' : fromId
      });
    } catch(e) {}
  }
  return msg;
}

/**
 * Get messages for a thread (sorted ascending)
 */
function dbGetMessages(idA, idB) {
  const threadKey = [idA, idB].sort().join('_');
  if (CACHE.messages[threadKey] && CACHE.messages[threadKey].length > 0) {
    return [...CACHE.messages[threadKey]].sort((a,b) => new Date(a.created_at) - new Date(b.created_at));
  }
  try {
    const stored = JSON.parse(localStorage.getItem('dd_messages') || '{}');
    return (stored[threadKey] || []).sort((a,b) => new Date(a.created_at) - new Date(b.created_at));
  } catch(e) { return []; }
}

/**
 * Load all messages involving jefatura from DB audit_logs or localStorage
 */
async function dbLoadAllJefaturaMessages() {
  try {
    const stored = JSON.parse(localStorage.getItem('dd_messages') || '{}');
    CACHE.messages = { ...stored };
  } catch(e) {
    CACHE.messages = {};
  }

  if (!db) return;
  try {
    const { data, error } = await db.from('audit_logs')
      .select('*')
      .eq('action', 'CHAT_MENSAJE')
      .order('created_at', { ascending: true });
    
    if (error || !data) return;
    data.forEach(log => {
      try {
        const msg = JSON.parse(log.detail);
        if (msg && msg.from_id && msg.to_id) {
          const threadKey = [msg.from_id, msg.to_id].sort().join('_');
          if (!CACHE.messages[threadKey]) CACHE.messages[threadKey] = [];
          if (!CACHE.messages[threadKey].some(m => m.id === msg.id)) {
            CACHE.messages[threadKey].push(msg);
          }
        }
      } catch(e) {}
    });

    try {
      localStorage.setItem('dd_messages', JSON.stringify(CACHE.messages));
    } catch(e) {}
  } catch(e) {}
}

/**
 * Load messages for a specific agent
 */
async function dbLoadAgentMessages(agentId) {
  await dbLoadAllJefaturaMessages();
}

/**
 * Mark messages in a thread as read
 */
async function dbMarkMessagesRead(fromId, toId) {
  const threadKey = [fromId, toId].sort().join('_');
  if (CACHE.messages[threadKey]) {
    CACHE.messages[threadKey].forEach(m => { if (m.to_id === toId) m.read = true; });
  }
  if (!db) return;
  try {
    await db.from('messages').update({ read: true }).eq('from_id', fromId).eq('to_id', toId).eq('read', false);
  } catch(e) {}
}

// ============================================================
// FALTAS / SANCIONES
// ============================================================

/**
 * Add a falta (sanction) to an agent. Stored safely inside notes metadata and local state.
 * falta: { id, level, type, description, date, commander }
 */
async function dbAddFalta(agentDiscordId, falta) {
  const roster = getCachedRoster().map(rowToAgent);
  const agent = roster.find(a => a.discordId === agentDiscordId);
  if (!agent) return;

  falta.id = falta.id || ('falta_' + Date.now());
  falta.date = falta.date || new Date().toISOString();
  falta.level = falta.level || 'leve';
  
  if (!Array.isArray(agent.faltas)) agent.faltas = [];
  agent.faltas.unshift(falta);

  await dbUpsertAgent(agent);
  return falta;
}

/**
 * Update an existing falta
 */
async function dbUpdateFalta(agentDiscordId, faltaId, updatedData) {
  const roster = getCachedRoster().map(rowToAgent);
  const agent = roster.find(a => a.discordId === agentDiscordId);
  if (!agent || !Array.isArray(agent.faltas)) return;

  const idx = agent.faltas.findIndex(f => f.id === faltaId);
  if (idx === -1) return;
  agent.faltas[idx] = { ...agent.faltas[idx], ...updatedData };

  await dbUpsertAgent(agent);
  return agent.faltas[idx];
}

/**
 * Remove a falta from an agent by falta.id
 */
async function dbRemoveFalta(agentDiscordId, faltaId) {
  const roster = getCachedRoster().map(rowToAgent);
  const agent = roster.find(a => a.discordId === agentDiscordId);
  if (!agent || !Array.isArray(agent.faltas)) return;

  agent.faltas = agent.faltas.filter(f => f.id !== faltaId);
  await dbUpsertAgent(agent);
}

/**
 * Get faltas for an agent
 */
function dbGetFaltas(agentDiscordId) {
  const roster = getCachedRoster().map(rowToAgent);
  const agent = roster.find(a => a.discordId === agentDiscordId);
  if (!agent) return [];
  return Array.isArray(agent.faltas) ? agent.faltas : [];
}

// ============================================================
// SOLICITUDES (Subdivision Chief requests)
// ============================================================

/**
 * Submit a solicitud (add/remove agent request from subdivision chief)
 * solicitud: { id, type: 'alta'|'baja', chiefId, chiefName, subdivision, agentId, agentName, agentData, reason, status: 'pendiente', created_at }
 */
async function dbSubmitSolicitud(solicitud) {
  solicitud.id = 'sol_' + Date.now();
  solicitud.created_at = new Date().toISOString();
  solicitud.status = 'pendiente';

  CACHE.solicitudes.push(solicitud);
  try {
    const stored = JSON.parse(localStorage.getItem('dd_solicitudes') || '[]');
    stored.push(solicitud);
    localStorage.setItem('dd_solicitudes', JSON.stringify(stored));
  } catch(e) {}

  if (db) {
    try {
      await db.from('audit_logs').insert({
        action: 'SOLICITUD_SUBDIVISION',
        agent_name: solicitud.chiefName,
        discord_tag: solicitud.subdivision,
        detail: JSON.stringify(solicitud),
        commander: 'Jefatura'
      });
    } catch(e) {}
  }
  return solicitud;
}

function dbGetSolicitudes() {
  if (CACHE.solicitudes.length > 0) return [...CACHE.solicitudes];
  try {
    return JSON.parse(localStorage.getItem('dd_solicitudes') || '[]');
  } catch(e) { return []; }
}

async function dbUpdateSolicitudStatus(solicitudId, status) {
  CACHE.solicitudes = CACHE.solicitudes.map(s => s.id === solicitudId ? { ...s, status } : s);
  try {
    const stored = JSON.parse(localStorage.getItem('dd_solicitudes') || '[]').map(s => s.id === solicitudId ? { ...s, status } : s);
    localStorage.setItem('dd_solicitudes', JSON.stringify(stored));
  } catch(e) {}
}
