/**
 * DETECTIVE DIVISION // POLICE RP SYSTEM
 * Core Application Engine & Data Simulator
 */

// --- AUDIO SYNTHESIZER (Web Audio API - No external files needed) ---
class DetectiveAudio {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  playRadioBeep() {
    if (!this.enabled) return;
    this.init();
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(1760, now + 0.08);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.12);
    } catch (e) {
      console.warn("Audio error:", e);
    }
  }

  playKeyClick() {
    if (!this.enabled) return;
    this.init();
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.03);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.03);
    } catch (e) { }
  }

  playAlertSound() {
    if (!this.enabled) return;
    this.init();
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.setValueAtTime(660, now + 0.15);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.35);
    } catch (e) { }
  }
}

const audioEngine = new DetectiveAudio();

// --- MOCK DATABASE FOR ROLEPLAY ---
const RP_CASES = [
  {
    id: "CASE-2026-089",
    title: "Operación 'Marea Roja': Narcotráfico en Muelles",
    division: "GND - Narcóticos & Crimen Organizado",
    category: "narcotics",
    status: "BAJO INVESTIGACIÓN",
    statusType: "active",
    priority: "CÓDIGO 3 (ALTA)",
    leadDetective: "Det. III Marcus Cole (#404)",
    date: "28/OCT/2026",
    location: "Terminal Marítima de Carga, Muelle 4",
    summary: "Interceptación de un cargamento de 45kg de sustancias ilícitas camufladas en contenedores pesqueros procedentes de alta mar. Se sospecha la implicación de un cártel internacional con vínculos locales.",
    evidence: [
      "Manifiesto de aduana falsificado con sello de 'Oceanic Imports'",
      "3 radios de frecuencia encriptada recuperadas",
      "Grabaciones de cámaras térmicas a las 03:14 AM",
      "Huellas balísticas coincidentes con armamento de grado militar"
    ],
    suspects: [
      { name: "Viktor 'El Capitán' Kozlov", role: "Coordinador Logístico", status: "Prófugo" },
      { name: "Sujeto Masculino No Identificado", role: "Tirador / Escolta", status: "En búsqueda" }
    ],
    image: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "CASE-2026-104",
    title: "Homicidio en Penthouse Diamond: Ejecución Selectiva",
    division: "RHD - Robos & Homicidios",
    category: "homicide",
    status: "ORDEN DE CAPTURA",
    statusType: "warrant",
    priority: "MÁXIMA PRIORIDAD",
    leadDetective: "Det. II Elena Rostova (#512)",
    date: "01/NOV/2026",
    location: "Rockford Hills, Eclipse Towers Penthouse 3",
    summary: "Hallazgo del cadáver del empresario financiero Julian Vance con 2 impactos de bala de calibre 9mm subsónico. Sin signos de robo forzado; la caja fuerte permanecía intacta. Indicios claros de sicariato profesional.",
    evidence: [
      "2 Casquillos 9x19mm Parabellum con silenciador estriado",
      "Teléfono satelital quemado en triturador de desperdicios",
      "Bitácora de seguridad eliminada manualmente desde el switch central",
      "Fibra sintética de guante táctico hallada en la manija del balcón"
    ],
    suspects: [
      { name: "Dante 'Ghost' Moretti", role: "Sicario Contratado", status: "Buscado Internacionalmente" },
      { name: "Claire Vance", role: "Beneficiaria Póliza Seguros", status: "Interrogatorio Pendiente" }
    ],
    image: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "CASE-2026-077",
    title: "Asalto al Banco Fleeca: Fuga en Motocicletas Tácticas",
    division: "RHD - Robos & Homicidios",
    category: "robbery",
    status: "CERRADO - SENTENCIADO",
    statusType: "solved",
    priority: "RESUELTO",
    leadDetective: "Tte. James 'Hawkeye' Sterling (#201)",
    date: "14/OCT/2026",
    location: "Fleeca Bank, Great Ocean Highway",
    summary: "Atraco a mano armada con rehenes por banda de 4 individuos. Sustracción de $320,000. Tras persecución de 20 minutos y cerco con unidad aérea, se logró la neutralización y captura de los 4 sospechosos.",
    evidence: [
      "2 escopetas tácticas y 4 pistolas decomisadas",
      "Bolsas de tinte de seguridad activadas",
      "Confesión firmada del cabecilla de la banda",
      "Total del botín recuperado en el maletero del vehículo de fuga"
    ],
    suspects: [
      { name: "Mateo 'El Tuerto' Silva", role: "Cabecilla de la banda", status: "Condenado a 25 años en Bolingbroke" },
      { name: "3 cómplices no fichados", role: "Perpetradores", status: "En prisión preventiva" }
    ],
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "CASE-2026-112",
    title: "Desaparición de la Dra. Sofia Chang: Bio-Laboratorios",
    division: "CID - Delitos Graves & Desapariciones",
    category: "missing",
    status: "BAJO INVESTIGACIÓN",
    statusType: "active",
    priority: "CÓDIGO 3 (ALTA)",
    leadDetective: "Det. I Lucas Benítez (#618)",
    date: "02/NOV/2026",
    location: "Complejo de Investigación Humane Labs / Davis",
    summary: "La investigadora jefa no regresó a su domicilio tras concluir su turno nocturno. Su vehículo particular fue hallado abandonado en un callejón industrial con las puertas abiertas y el bolso en el asiento copiloto.",
    evidence: [
      "Teléfono móvil de la víctima apagado a las 23:42 horas",
      "Cámaras de tráfico captan una van negra sin placas siguiendo el coche",
      "Tarjeta de acceso clonada utilizada 10 minutos después de su salida"
    ],
    suspects: [
      { name: "Desconocidos (Grupo Paramilitar)", role: "Secuestradores", status: "En rastreo por satélite" }
    ],
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "CASE-2026-064",
    title: "Auditoría Interna: Filtración de Operativos a Bandas",
    division: "IAD - Asuntos Internos",
    category: "internal",
    status: "BAJO INVESTIGACIÓN",
    statusType: "active",
    priority: "CLASIFICADO // NIVEL 5",
    leadDetective: "Capitán David Vance (#101)",
    date: "19/OCT/2026",
    location: "Comisaría Central - División Despacho",
    summary: "Sospecha fundada de fuga de información de radiofrecuencias tácticas que provocó la evasión de 3 objetivos de alto valor antes de las redadas simultáneas. Auditoría de accesos a base de datos en curso.",
    evidence: [
      "Registros de consulta no autorizada en el sistema CAD a las 02:11 AM",
      "Depósito sospechoso en cuenta offshore no declarada",
      "Intercepción de comunicaciones encriptadas en teléfono desechable"
    ],
    suspects: [
      { name: "[EXPEDIENTE BAJO SELLO JUDICIAL]", role: "Oficial Sospechoso", status: "Suspendido con retención de placa" }
    ],
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "CASE-2026-095",
    title: "Cártel de Los Santos: Tráfico de Armas Pesadas",
    division: "GND - Narcóticos & Armas",
    category: "narcotics",
    status: "ORDEN DE ALLANAMIENTO",
    statusType: "warrant",
    priority: "MÁXIMA PRIORIDAD",
    leadDetective: "Det. III Marcus Cole (#404)",
    date: "25/OCT/2026",
    location: "Zona Industrial de El Burro Heights",
    summary: "Investigación encubierta de 3 meses que confirma el almacenamiento de fusiles de asalto sin serial y explosivos C4 en una nave industrial aparentemente abandonada. Juez aprobó la orden de incursión táctica con SWAT.",
    evidence: [
      "Fotografías de vigilancia de camiones descargando cajas de madera",
      "Interceptación de llamada telefónica con acuerdo de venta de $180,000",
      "Muestra balística de munición perforante de blindaje"
    ],
    suspects: [
      { name: "Mateo 'El Armero' Beltrán", role: "Distribuidor Principal", status: "Bajo Cerco Táctico" }
    ],
    image: "https://images.unsplash.com/photo-1595590424283-b8f17842773f?auto=format&fit=crop&w=800&q=80"
  }
];

const MOST_WANTED = [
  {
    id: "WANTED-001",
    name: "Dante 'Ghost' Moretti",
    alias: "El Fantasma",
    charges: "Homicidio en Primer Grado, Posesión de Armamento Pesado, Conspiración",
    bounty: "$75,000",
    dangerLevel: "EXTREMO // DISPARAR A LA VISTA",
    dangerColor: "bg-red-500/20 text-red-400 border-red-500",
    lastSeen: "Centro Financiero / Vinewood Hills",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    notes: "Ex-contratista militar privado. Experto en evasión y armamento supreso. Considerado armado y extremadamente letal."
  },
  {
    id: "WANTED-002",
    name: "Viktor Kozlov",
    alias: "El Capitán de Murmansk",
    charges: "Tráfico Internacional de Estupefacientes, Lavado de Dinero a Gran Escala",
    bounty: "$50,000",
    dangerLevel: "ALTO RIESGO",
    dangerColor: "bg-amber-500/20 text-amber-400 border-amber-500",
    lastSeen: "Puerto de Los Santos / Muelle 21",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
    notes: "Controla redes logísticas de contrabando marítimo. Suele viajar escoltado por mínimo 3 hombres con chalecos balísticos."
  },
  {
    id: "WANTED-003",
    name: "Elena 'Víbora' Delgado",
    alias: "La Reina del Fraude",
    charges: "Ciberataque Bancario, Clonación Masiva de Fondos, Extorsión",
    bounty: "$35,000",
    dangerLevel: "MODERADO / RIESGO DE FUGA",
    dangerColor: "bg-yellow-500/20 text-yellow-300 border-yellow-500",
    lastSeen: "Aeropuerto Internacional / Pasaporte Falso",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    notes: "Especialista en falsificación de identidades federales y desvío de criptoactivos. No confrontativa pero con red de sobornos."
  },
  {
    id: "WANTED-004",
    name: "Jackson 'Reaper' Stone",
    alias: "El Carnicero",
    charges: "Secuestro Agravado, Tortura, Robo con Rehenes",
    bounty: "$60,000",
    dangerLevel: "EXTREMO // PSICOPATÍA CONFIRMADA",
    dangerColor: "bg-red-500/20 text-red-400 border-red-500",
    lastSeen: "Condado de Blaine / Sandy Shores",
    photo: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=600&q=80",
    notes: "Líder de una célula de moteros ilegales. Cuenta con chaleco antibalas y rifle recortado en todo momento."
  }
];

// --- DISCORD AUTHENTICATION & CASE MANAGEMENT ENGINE ---
let currentDiscordUser = null;
let isDetectiveAuth = false;
let isManualNavigation = false;

function getActiveCasesList() {
  const cached = getCachedCases();
  if (cached.length > 0) return cached.map(rowToCase);
  // fallback: check localStorage
  const custom = localStorage.getItem("dd_custom_cases");
  if (custom) {
    try {
      const parsed = JSON.parse(custom);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch (e) {
      console.warn("Error parsing custom cases:", e);
    }
  }
  return RP_CASES;
}

function saveCasesList(list) {
  try {
    localStorage.setItem("dd_custom_cases", JSON.stringify(list));
  } catch (e) {}
}

// --- APP CONTROLLER ---
document.addEventListener("DOMContentLoaded", async () => {
  await initSupabase();
  await initDiscordAuth();  // await so roster is ready before matching OAuth user
  initClock();
  renderCases(getActiveCasesList());
  renderMostWanted(getActiveWantedList());
  setupCaseFilters();
  setupTipForm();
  setupInformesHub();
  setupAudioControls();
  setupInteractiveModals();
  setupSidebar();
  setupScrollSpy();
  setupReportEditor();
  setupJefaturaSearch();
  renderDynamicRanks();
  renderMandoGrid();
  renderSubdivisionPrivatePanel();
});

// --- DISCORD OAUTH2 AUTHENTICATION & ROLE VERIFICATION ENGINE ---
const DISCORD_CLIENT_ID = "1271954022139691038";

function getDiscordRedirectUri() {
  if (window.location.hostname.includes("vercel.app")) {
    return "https://detectivedivision.vercel.app/";
  }
  return window.location.origin + window.location.pathname;
}

function getDiscordOAuthUrl() {
  const redirectUri = getDiscordRedirectUri();
  return `https://discord.com/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}&scope=identify%20guilds`;
}

window.loginWithDiscordOAuth2 = function() {
  audioEngine.playAlertSound();
  showToast("🔄 Redirigiendo a Discord OAuth2 oficial...");
  window.location.href = getDiscordOAuthUrl();
};

const BOT_PROFILES = {
  capitan: {
    username: "Cap. David Vance",
    tag: "David Vance#0101",
    userId: "101928374650192831",
    badge: "#101-DIV",
    role: "Mando Policial - Capitán",
    rankLevel: 5,
    isAuthorizedDetective: true,
    clearance: "NIVEL 5 // COMANDO SUPREMO",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80"
  },
  teniente: {
    username: "Tte. James Sterling",
    tag: "J_Sterling#0201",
    userId: "201928374650192832",
    badge: "#201-DIV",
    role: "Teniente Supervisor RHD",
    rankLevel: 4,
    isAuthorizedDetective: true,
    clearance: "NIVEL 4 // SUPERVISIÓN RHD",
    avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80"
  },
  det3: {
    username: "Det. III Marcus Cole",
    tag: "Marcus_Cole#0404",
    userId: "404928374650192833",
    badge: "#404-DIV",
    role: "Detective III - Líder GND",
    rankLevel: 3,
    isAuthorizedDetective: true,
    clearance: "NIVEL 3 // ALTO SECRETO",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80"
  },
  det1: {
    username: "Det. I Sarah Connor",
    tag: "S_Connor#0522",
    userId: "522928374650192834",
    badge: "#522-DIV",
    role: "Detective I - Investigador",
    rankLevel: 2,
    isAuthorizedDetective: true,
    clearance: "NIVEL 2 // CONFIDENCIAL",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
  },
  civil: {
    username: "Ciudadano_Anon",
    tag: "Ciudadano_Anon#9999",
    userId: "999928374650192899",
    badge: "SIN PLACA",
    role: "Ciudadano / Sin Rol Policial",
    rankLevel: 0,
    isAuthorizedDetective: false,
    clearance: "NIVEL 0 // ACCESO DENEGADO",
    avatar: "https://cdn.discordapp.com/embed/avatars/1.png"
  }
};

async function initDiscordAuth() {
  // 1) Check if returning from Discord OAuth2 implicit-flow redirect
  const hasToken = await checkDiscordOAuthCallback();
  if (hasToken) return;

  // 2) Restore session from localStorage
  const saved = localStorage.getItem("dd_discord_user");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);

      // Invalidate any leftover demo/example sessions (fake IDs)
      const EXAMPLE_IDS = [
        "101928374650192831","201928374650192832","404928374650192833",
        "512928374650192834","522928374650192835","999928374650192899"
      ];
      if (EXAMPLE_IDS.includes(parsed.id || parsed.userId)) {
        localStorage.removeItem("dd_discord_user");
        localStorage.removeItem("dd_discord_token");
        updateDiscordAuthUI();
        return;
      }

      // Re-sync with the LIVE roster in case rank/division changed since last login
      const roster = getJefaturaRoster();
      const liveAgent = roster.find(a => a.discordId === parsed.id);
      if (liveAgent) {
        const rankMeta = RANK_META[liveAgent.rank] || RANK_META["det1"];
        currentDiscordUser = {
          ...parsed,
          rankKey: liveAgent.rank,
          rankLevel: rankMeta.level,
          role: liveAgent.icName || rankMeta.label,
          clearance: rankMeta.clearance,
          badge: liveAgent.badge || parsed.badge,
          division: liveAgent.division || parsed.division || '',
          subdivisionRole: liveAgent.subdivisionRole || parsed.subdivisionRole || null,
          isAuthorizedDetective: rankMeta.level >= 1,
          isHighCommand: rankMeta.level >= 4,
          rosterAgent: liveAgent
        };
      } else {
        currentDiscordUser = parsed;
      }
      isDetectiveAuth = Boolean(currentDiscordUser && hasPermission('view_reports'));
    } catch (e) {
      currentDiscordUser = null;
      isDetectiveAuth = false;
    }
  }
  updateDiscordAuthUI();
}

async function checkDiscordOAuthCallback() {
  let token = null;

  // Implicit flow puts access_token in the URL hash
  if (window.location.hash && window.location.hash.includes("access_token")) {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    token = hashParams.get("access_token");
  } else if (window.location.search && window.location.search.includes("access_token")) {
    const searchParams = new URLSearchParams(window.location.search);
    token = searchParams.get("access_token");
  }

  if (token) {
    // Clear token from URL immediately so back-nav doesn't re-auth
    try {
      window.history.replaceState({}, document.title, window.location.pathname);
    } catch (e) {}

    localStorage.setItem("dd_discord_token", token);
    await fetchDiscordUserProfile(token);

    // After profile loaded, scroll to informes section
    setTimeout(() => {
      const el = document.getElementById("informes");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 400);
    return true;
  }
  return false;
}

async function fetchDiscordUserProfile(token) {
  try {
    showToast("🔍 Sincronizando perfil con Discord API...");
    const res = await fetch("https://discord.com/api/v10/users/@me", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) {
      throw new Error("Token no válido o expirado");
    }

    const data = await res.json();
    let avatarUrl = "https://cdn.discordapp.com/embed/avatars/0.png";
    if (data.avatar) {
      avatarUrl = `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png?size=256`;
    } else {
      const idx = (BigInt(data.id) >> 22n) % 6n;
      avatarUrl = `https://cdn.discordapp.com/embed/avatars/${idx}.png`;
    }

    const displayName = data.global_name || data.username;
    const fullTag = data.discriminator && data.discriminator !== "0"
      ? `${data.username}#${data.discriminator}`
      : `@${data.username}`;

    const badgeNum = "#" + (data.id.slice(-3) || "404") + "-DIV";

    // Check if this user is already registered in the roster
    const roster = getJefaturaRoster();
    const existingAgent = roster.find(a => a.discordId === data.id);

    if (existingAgent) {
      // User exists in roster — use their registered rank/role
      const rankMeta = RANK_META[existingAgent.rank] || RANK_META["det1"];
      currentDiscordUser = {
        id: data.id,
        username: displayName,
        tag: fullTag,
        userId: data.id,
        badge: existingAgent.badge || badgeNum,
        role: existingAgent.icName || rankMeta.label,
        rankKey: existingAgent.rank,
        rankLevel: rankMeta.level,
        isAuthorizedDetective: hasPermission('view_reports') || rankMeta.level >= 1,
        isHighCommand: hasPermission('manage_roster') || hasPermission('manage_ranks') || rankMeta.level >= 4,
        clearance: rankMeta.clearance,
        avatar: avatarUrl,
        oauthVerified: true,
        rosterAgent: existingAgent,
        authAt: new Date().toLocaleString('es-ES')
      };
      isDetectiveAuth = hasPermission('view_reports');
    } else {
      // New user — assign default Aspirante rank with no access, and auto-register them
      const newAgent = {
        discordId: data.id,
        discordTag: fullTag,
        icName: displayName,
        badge: badgeNum,
        rank: "aspirante",
        division: "Sin Asignar // En Evaluación",
        status: "Pendiente",
        awards: [],
        notes: "",
        avatar: avatarUrl,
        joinDate: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()
      };
      dbUpsertAgent(newAgent);
      addAuditLog("REGISTRO AUTOMÁTICO", displayName, fullTag, "Aspirante Sin Acceso", "Sistema OAuth2 — primer inicio de sesión detectado");

      currentDiscordUser = {
        id: data.id,
        username: displayName,
        tag: fullTag,
        userId: data.id,
        badge: badgeNum,
        role: "Aspirante // Pendiente de Asignación de Rango",
        rankKey: "aspirante",
        rankLevel: 0,
        isAuthorizedDetective: false,
        isHighCommand: false,
        clearance: "NIVEL 0 // SIN ACCESO",
        avatar: avatarUrl,
        oauthVerified: true,
        rosterAgent: newAgent,
        authAt: new Date().toLocaleString('es-ES')
      };
      isDetectiveAuth = false;
    }

    localStorage.setItem("dd_discord_user", JSON.stringify(currentDiscordUser));
    updateDiscordAuthUI();
    renderCases(getActiveCasesList());
    audioEngine.playAlertSound();

    // Welcome toast — show rank badge and division if assigned
    const rankMeta2 = RANK_META[currentDiscordUser.rankKey] || {};
    const divStr = currentDiscordUser.rosterAgent?.division || "";
    const divBadge = divStr && !divStr.includes("Sin Asignar") ? ` • ${divStr.split(" ")[0]}` : "";
    showToast(`✅ ¡Bienvenido ${displayName}! ${rankMeta2.icon || "🔰"} ${rankMeta2.label || "Aspirante"}${divBadge} — Sesión verificada con Discord OAuth2.`);

    // Show "Mi División" panel in Jefatura if applicable
    renderAgentDivisionPanel();
  } catch (err) {
    console.warn("OAuth verification error:", err);
    localStorage.removeItem("dd_discord_token");
    showToast("⚠️ No se pudo obtener el perfil de Discord API.");
  }
}

function updateDiscordAuthUI() {
  const topbarAvatar = document.getElementById("topbar-discord-avatar");
  const topbarName = document.getElementById("topbar-discord-name");
  const restrictedView = document.getElementById("informes-restricted-view");
  const pendingView = document.getElementById("informes-pending-view");
  const authorizedView = document.getElementById("informes-authorized-view");
  const civilDeniedAlert = document.getElementById("informes-civil-denied");
  const civilDeniedText = document.getElementById("informes-civil-denied-text");
  const topbarJefaturaBtn = document.getElementById("topbar-jefatura-btn");

  // Casos (Expedientes) Views (Privados para oficiales con rango)
  const casosRestricted = document.getElementById("casos-restricted-view");
  const casosPending = document.getElementById("casos-pending-view");
  const casosAuthorized = document.getElementById("casos-authorized-view");

  const hasReportsAccess = Boolean(currentDiscordUser && hasPermission('view_reports') && currentDiscordUser.rankKey !== "aspirante");
  const hasCasesAccess = Boolean(currentDiscordUser && hasPermission('view_cases') && currentDiscordUser.rankKey !== "aspirante");

  // 1. GESTIÓN DE EXPEDIENTES (CASOS)
  if (hasCasesAccess) {
    if (casosRestricted) casosRestricted.classList.add("hidden");
    if (casosPending) casosPending.classList.add("hidden");
    if (casosAuthorized) casosAuthorized.classList.remove("hidden");
    renderCases(getActiveCasesList());
  } else if (currentDiscordUser && currentDiscordUser.rankKey === "aspirante") {
    if (casosRestricted) casosRestricted.classList.add("hidden");
    if (casosAuthorized) casosAuthorized.classList.add("hidden");
    if (casosPending) {
      casosPending.classList.remove("hidden");
      const cPendingName = document.getElementById("casos-pending-name");
      const cPendingAvatar = document.getElementById("casos-pending-avatar");
      if (cPendingName) cPendingName.textContent = currentDiscordUser.username || "Oficial";
      if (cPendingAvatar) cPendingAvatar.src = currentDiscordUser.avatar || "https://cdn.discordapp.com/embed/avatars/0.png";
    }
  } else {
    if (casosAuthorized) casosAuthorized.classList.add("hidden");
    if (casosPending) casosPending.classList.add("hidden");
    if (casosRestricted) casosRestricted.classList.remove("hidden");
  }

  // 2. GESTIÓN DE INFORMES CLASIFICADOS
  if (hasReportsAccess) {
    document.body.classList.add("is-detective-auth");
    if (topbarAvatar) topbarAvatar.src = currentDiscordUser.avatar || "https://cdn.discordapp.com/embed/avatars/0.png";
    if (topbarName) topbarName.textContent = currentDiscordUser.username || "Detective Autorizado";

    // Show Jefatura topbar button only for high command
    if (topbarJefaturaBtn) {
      if (currentDiscordUser.isHighCommand) {
        topbarJefaturaBtn.classList.remove("hidden");
        topbarJefaturaBtn.classList.add("flex");
      } else {
        topbarJefaturaBtn.classList.add("hidden");
        topbarJefaturaBtn.classList.remove("flex");
      }
    }

    // Informes Section Views
    if (restrictedView) restrictedView.classList.add("hidden");
    if (pendingView) pendingView.classList.add("hidden");
    if (authorizedView) authorizedView.classList.remove("hidden");
    if (civilDeniedAlert) civilDeniedAlert.classList.add("hidden");

    // Ribbon in Informes section
    const ribbonAvatar = document.getElementById("ribbon-agent-avatar");
    const ribbonName = document.getElementById("ribbon-agent-name");
    const ribbonBadge = document.getElementById("ribbon-agent-badge");
    const ribbonRole = document.getElementById("ribbon-agent-role");
    const ribbonClearance = document.getElementById("ribbon-clearance-text");

    if (ribbonAvatar) ribbonAvatar.src = currentDiscordUser.avatar;
    if (ribbonName) ribbonName.textContent = currentDiscordUser.username;
    if (ribbonBadge) ribbonBadge.textContent = currentDiscordUser.badge;
    if (ribbonRole) ribbonRole.textContent = `ROL: ${currentDiscordUser.role.toUpperCase()}`;
    if (ribbonClearance) ribbonClearance.textContent = currentDiscordUser.clearance;

    renderConfidentialReports(getActiveConfidentialReports());
    renderAuthorizedTipsInbox();
  } else if (currentDiscordUser && currentDiscordUser.rankKey === "aspirante") {
    // Aspirante: logged in but no access yet — show pending view
    document.body.classList.remove("is-detective-auth");
    if (topbarAvatar) topbarAvatar.src = currentDiscordUser.avatar || "https://cdn.discordapp.com/embed/avatars/0.png";
    if (topbarName) topbarName.textContent = currentDiscordUser.username || "Aspirante";
    if (topbarJefaturaBtn) { topbarJefaturaBtn.classList.add("hidden"); topbarJefaturaBtn.classList.remove("flex"); }

    if (restrictedView) restrictedView.classList.add("hidden");
    if (authorizedView) authorizedView.classList.add("hidden");
    if (civilDeniedAlert) civilDeniedAlert.classList.add("hidden");
    if (pendingView) {
      pendingView.classList.remove("hidden");
      const pendingAvatar = document.getElementById("pending-agent-avatar");
      const pendingName = document.getElementById("pending-agent-name");
      const pendingTag = document.getElementById("pending-agent-tag");
      if (pendingAvatar) pendingAvatar.src = currentDiscordUser.avatar;
      if (pendingName) pendingName.textContent = currentDiscordUser.username;
      if (pendingTag) pendingTag.textContent = `@${currentDiscordUser.tag}`;
    }
  } else {
    document.body.classList.remove("is-detective-auth");
    if (topbarAvatar) topbarAvatar.src = "https://cdn.discordapp.com/embed/avatars/0.png";
    if (topbarName) topbarName.textContent = "Acceso Detective";
    if (topbarJefaturaBtn) { topbarJefaturaBtn.classList.add("hidden"); topbarJefaturaBtn.classList.remove("flex"); }

    if (pendingView) pendingView.classList.add("hidden");
    if (restrictedView) restrictedView.classList.remove("hidden");
    if (authorizedView) authorizedView.classList.add("hidden");

    // If user logged in as Civil, show rejection alert
    if (currentDiscordUser && !currentDiscordUser.isAuthorizedDetective && currentDiscordUser.rankKey !== "aspirante") {
      if (civilDeniedAlert) civilDeniedAlert.classList.remove("hidden");
      if (civilDeniedText) {
        civilDeniedText.textContent = `El sistema detectó que la cuenta @${currentDiscordUser.tag} no ostenta un rol de la Detective Division (Capitán a Detective). Los informes clasificados permanecen bloqueados.`;
      }
    } else {
      if (civilDeniedAlert) civilDeniedAlert.classList.add("hidden");
    }
  }

  // Show/Hide granular action buttons throughout the entire interface
  const newCaseBtn = document.querySelector('button[onclick="openReportEditor()"]');
  if (newCaseBtn) newCaseBtn.style.display = hasPermission('create_cases') ? 'inline-flex' : 'none';

  const newConfBtn = document.querySelector('button[onclick="openNewConfidentialReportModal()"]');
  if (newConfBtn) newConfBtn.style.display = hasPermission('create_reports') ? 'inline-flex' : 'none';

  const createRankBtn = document.getElementById('jefatura-create-rank-btn');
  if (createRankBtn) createRankBtn.style.display = hasPermission('manage_ranks') ? 'inline-flex' : 'none';

  const addAgentBtn = document.querySelector('button[onclick="openAddAgentModal()"]');
  if (addAgentBtn) addAgentBtn.style.display = hasPermission('manage_roster') ? 'inline-flex' : 'none';

  const clearAuditBtn = document.querySelector('button[onclick="clearAuditLogs()"]');
  if (clearAuditBtn) clearAuditBtn.style.display = hasPermission('manage_audit') ? 'inline-flex' : 'none';

  // Botón "+ Nuevo Fugitivo" en Más Buscados
  const addWantedBtn = document.getElementById('wanted-add-btn');
  if (addWantedBtn) {
    const canAddWanted = Boolean(currentDiscordUser && (hasPermission('create_cases') || hasPermission('edit_cases') || currentDiscordUser.isHighCommand));
    addWantedBtn.style.display = canAddWanted ? 'inline-flex' : 'none';
  }

  // Re-renderizar Más Buscados con controles adecuados de rango
  renderMostWanted(getActiveWantedList());

  // Update Jefatura section UI
  updateJefaturaUI();
  renderDynamicRanks();

  // Panel "Mi División" para el agente autenticado
  renderAgentDivisionPanel();

  // Panel privado Mi Subdivisión (#unidades) + Cadena de Mando dinámica
  renderSubdivisionPrivatePanel();
  renderMandoGrid();
}

// --- HELPER: map division string → subdivision ID ---
function getSubdivisionIdFromDivision(divisionStr) {
  const d = (divisionStr || '').toUpperCase();
  if (d.includes('RHD') || d.includes('HOMICIDIO') || d.includes('ROBO')) return 'rhd';
  if (d.includes('GND') || d.includes('NARC') || d.includes('PANDILLA')) return 'gnd';
  if (d.includes('AIB') || d.includes('ASUNTOS') || d.includes('INTERNOS') || d.includes('IAD') || d.includes('INTERNO') || d.includes('DISCIPLINA')) return 'iad';
  if (d.includes('CSI') || d.includes('FORENSE') || d.includes('BALÍST') || d.includes('BALISTICA')) return 'csi';
  if (d.includes('SWAT') || d.includes('TACTIC') || d.includes('TÁCTIC') || d.includes('OPERACIONES TACTICAS')) return 'swat';
  if (d.includes('CID') || d.includes('CIBER') || d.includes('FRAUDE')) return 'cid';
  if (d.includes('CCD') || d.includes('FRÍO') || d.includes('DESAPAR') || d.includes('FRIO')) return 'ccd';
  return null;
}

// --- PANEL "MI DIVISIÓN" — visible en Jefatura cuando el agente logueado tiene subdivisión ---
function renderAgentDivisionPanel() {
  const container = document.getElementById('agent-division-panel');
  if (!container) return;

  // Only show if logged in and has an approved rank (not aspirante)
  if (!currentDiscordUser || currentDiscordUser.rankKey === 'aspirante' || !hasPermission('view_reports')) {
    container.classList.add('hidden');
    return;
  }

  const agent = currentDiscordUser.rosterAgent || {};
  const divisionStr = agent.division || currentDiscordUser.role || '';
  const subdivId = getSubdivisionIdFromDivision(divisionStr);

  if (!subdivId) {
    container.classList.add('hidden');
    return;
  }

  container.classList.remove('hidden');
  const subdiv = SUBDIVISIONS_DATA[subdivId] || {};

  // Filter cases & reports for this subdivision
  const allCases = typeof getActiveCasesList === 'function' ? getActiveCasesList() : [];
  const myCases = allCases.filter(c => {
    const div = (c.division || '').toLowerCase();
    const cat = (c.category || '').toLowerCase();
    if (subdivId === 'rhd') return div.includes('rhd') || cat.includes('homicide') || cat.includes('robbery');
    if (subdivId === 'gnd') return div.includes('gnd') || cat.includes('narcotics');
    if (subdivId === 'csi') return div.includes('csi') || div.includes('forense');
    if (subdivId === 'cid') return div.includes('cid') || cat.includes('fraud') || div.includes('ciber');
    if (subdivId === 'iad') return div.includes('iad') || cat.includes('internal');
    if (subdivId === 'ccd') return div.includes('ccd') || cat.includes('missing');
    return false;
  });

  const allReports = typeof getActiveConfidentialReports === 'function' ? getActiveConfidentialReports() : [];
  const myReports = hasPermission('view_reports')
    ? allReports.filter(r => {
        const rt = (r.title || '').toLowerCase() + (r.summary || '').toLowerCase();
        return rt.includes(subdivId) || rt.includes(subdiv.code?.toLowerCase() || '') ||
               (r.author === currentDiscordUser.username);
      })
    : [];

  // Teammates in same subdivision
  const roster = typeof getCachedRoster === 'function' ? getCachedRoster().map(rowToAgent) : [];
  const teammates = roster.filter(a => {
    const d = (a.division || '').toLowerCase();
    return d.includes(subdiv.code?.toLowerCase() || '') && a.discordId !== currentDiscordUser.id;
  });

  // Personal notes from localStorage
  const notesKey = `dd_div_notes_${currentDiscordUser.id}_${subdivId}`;
  const savedNotes = localStorage.getItem(notesKey) || '';

  const badgeColorMap = {
    rhd: 'red', gnd: 'amber', csi: 'blue', cid: 'emerald', iad: 'purple', ccd: 'cyan'
  };
  const bc = badgeColorMap[subdivId] || 'amber';
  const borderColor = `border-${bc}-500/40`;
  const textColor = `text-${bc}-400`;
  const bgColor = `bg-${bc}-500/10`;

  container.innerHTML = `
    <!-- Panel Header -->
    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-7 pb-6 border-b border-slate-800">
      <div class="flex items-center gap-4">
        <div class="relative">
          <img src="${currentDiscordUser.avatar || 'https://cdn.discordapp.com/embed/avatars/0.png'}"
            class="w-16 h-16 rounded-2xl object-cover border-2 border-amber-500/60 shadow-lg shadow-amber-900/40" alt="Avatar">
          <span class="absolute -bottom-1.5 -right-1.5 w-5 h-5 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center">
            <i data-lucide="shield-check" class="w-3 h-3 text-white"></i>
          </span>
        </div>
        <div>
          <div class="flex items-center gap-2 flex-wrap mb-1">
            <span class="px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 font-conthrax text-[10px] font-bold">
              ${RANK_META[currentDiscordUser.rankKey]?.icon || '🔰'} ${(RANK_META[currentDiscordUser.rankKey]?.label || currentDiscordUser.role || 'Detective').toUpperCase()}
            </span>
            <span class="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono text-[10px]">
              ${currentDiscordUser.badge || '#---'}
            </span>
            <span class="px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-conthrax text-[9px] font-bold">
              ● SESIÓN ACTIVA
            </span>
          </div>
          <h3 class="text-xl font-black font-gobold text-white tracking-wide">${currentDiscordUser.username}</h3>
          <p class="text-xs font-conthrax text-slate-400 mt-0.5">${agent.discordTag || currentDiscordUser.tag || ''}</p>
        </div>
      </div>

      <div class="flex flex-wrap gap-3">
        <div class="px-3.5 py-2 rounded-xl bg-slate-950/80 border ${borderColor} text-right">
          <span class="text-[9px] font-conthrax text-slate-400 block">MI SUBDIVISIÓN:</span>
          <span class="text-xs font-conthrax ${textColor} font-bold">${subdiv.code} — ${subdiv.name}</span>
        </div>
        <div class="px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-right">
          <span class="text-[9px] font-conthrax text-slate-400 block">AUTORIZACIÓN:</span>
          <span class="text-xs font-conthrax text-emerald-400 font-bold">${currentDiscordUser.clearance || 'CLASIFICADO'}</span>
        </div>
      </div>
    </div>

    <!-- Stats Row -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-7">
      <div class="glass-panel p-4 rounded-xl border border-slate-800 text-center">
        <p class="text-2xl font-black font-gobold ${textColor}">${myCases.length}</p>
        <p class="text-[10px] font-conthrax text-slate-400 uppercase mt-1">Casos en mi División</p>
      </div>
      <div class="glass-panel p-4 rounded-xl border border-slate-800 text-center">
        <p class="text-2xl font-black font-gobold text-red-400">${myReports.length}</p>
        <p class="text-[10px] font-conthrax text-slate-400 uppercase mt-1">Informes Clasificados</p>
      </div>
      <div class="glass-panel p-4 rounded-xl border border-slate-800 text-center">
        <p class="text-2xl font-black font-gobold text-blue-400">${teammates.length}</p>
        <p class="text-[10px] font-conthrax text-slate-400 uppercase mt-1">Compañeros Activos</p>
      </div>
      <div class="glass-panel p-4 rounded-xl border border-slate-800 text-center">
        <p class="text-2xl font-black font-gobold text-purple-400">${myCases.filter(c => c.statusType === 'active').length}</p>
        <p class="text-[10px] font-conthrax text-slate-400 uppercase mt-1">Expedientes Abiertos</p>
      </div>
    </div>

    <!-- Main Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-7">

      <!-- Col 1-2: Cases & Reports -->
      <div class="lg:col-span-2 space-y-6">

        <!-- Division Cases -->
        <div class="bg-slate-950/80 rounded-xl p-5 border border-slate-800">
          <div class="flex items-center gap-2 mb-4 text-amber-400 font-conthrax text-xs font-bold">
            <i data-lucide="folder-search" class="w-4 h-4"></i>
            <span>EXPEDIENTES DE ${subdiv.code} (${myCases.length})</span>
          </div>
          ${myCases.length > 0 ? `
            <div class="space-y-2 max-h-56 overflow-y-auto custom-scroll pr-1">
              ${myCases.map(c => `
                <div class="flex items-center justify-between gap-3 p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 hover:border-amber-500/30 transition-colors">
                  <div class="overflow-hidden">
                    <div class="flex items-center gap-1.5 mb-0.5">
                      <span class="text-[9px] font-mono font-bold text-amber-400">${c.id}</span>
                      <span class="text-[9px] px-1 py-0.5 rounded ${c.statusType === 'active' ? 'bg-amber-500/20 text-amber-300' : c.statusType === 'warrant' ? 'bg-red-500/20 text-red-300' : 'bg-emerald-500/20 text-emerald-300'} font-mono">${c.status}</span>
                    </div>
                    <p class="text-xs font-bold text-white truncate font-conthrax">${c.title}</p>
                  </div>
                  <button onclick="openCaseModal('${c.id}')"
                    class="px-2 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-black font-conthrax text-[10px] font-bold transition-colors shrink-0 border border-amber-500/30">
                    Ver
                  </button>
                </div>
              `).join('')}
            </div>
          ` : `
            <div class="p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-center font-conthrax text-xs text-slate-500">
              <i data-lucide="folder" class="w-6 h-6 mx-auto mb-2 opacity-30"></i>
              Sin expedientes activos asignados a ${subdiv.code}.
            </div>
          `}
        </div>

        <!-- Division Reports (if permission) -->
        ${hasPermission('view_reports') ? `
        <div class="bg-slate-950/80 rounded-xl p-5 border border-slate-800">
          <div class="flex items-center gap-2 mb-4 text-red-400 font-conthrax text-xs font-bold">
            <i data-lucide="file-lock-2" class="w-4 h-4"></i>
            <span>INFORMES CLASIFICADOS (${myReports.length})</span>
          </div>
          ${myReports.length > 0 ? `
            <div class="space-y-2 max-h-48 overflow-y-auto custom-scroll pr-1">
              ${myReports.map(r => `
                <div class="flex items-center justify-between gap-3 p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 hover:border-red-500/30 transition-colors">
                  <div class="overflow-hidden">
                    <span class="text-[9px] font-mono text-red-400 font-bold">${r.code || 'INF-CONF'}</span>
                    <p class="text-xs font-bold text-white truncate font-conthrax">${r.title}</p>
                    <span class="text-[10px] text-slate-500 font-mono">Por: ${r.author || '—'}</span>
                  </div>
                  <button onclick="viewConfidentialReport('${r.id}')"
                    class="px-2 py-1 rounded-lg bg-red-500/10 hover:bg-red-600 text-red-400 hover:text-white font-conthrax text-[10px] font-bold transition-colors shrink-0 border border-red-500/30">
                    Ver
                  </button>
                </div>
              `).join('')}
            </div>
          ` : `
            <div class="p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-center font-conthrax text-xs text-slate-500">
              <i data-lucide="file-x" class="w-6 h-6 mx-auto mb-2 opacity-30"></i>
              Sin informes clasificados relacionados con ${subdiv.code}.
            </div>
          `}
        </div>
        ` : ''}

      </div>

      <!-- Col 3: Teammates + SOP -->
      <div class="space-y-6">

        <!-- Teammates -->
        <div class="bg-slate-950/80 rounded-xl p-5 border border-slate-800">
          <div class="flex items-center gap-2 mb-4 text-blue-400 font-conthrax text-xs font-bold">
            <i data-lucide="users" class="w-4 h-4"></i>
            <span>COMPAÑEROS EN ${subdiv.code}</span>
          </div>
          ${teammates.length > 0 ? `
            <div class="space-y-2 max-h-48 overflow-y-auto custom-scroll">
              ${teammates.map(t => `
                <div class="flex items-center gap-2.5 p-2 rounded-lg bg-slate-900/50 border border-slate-800">
                  <img src="${t.avatar || 'https://cdn.discordapp.com/embed/avatars/0.png'}"
                    class="w-8 h-8 rounded-lg object-cover border border-slate-700 shrink-0">
                  <div class="overflow-hidden">
                    <span class="font-bold text-white text-xs block truncate font-conthrax">${t.icName}</span>
                    <span class="text-[10px] font-mono text-amber-400">${t.badge || '#---'}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          ` : `
            <p class="text-xs font-conthrax text-slate-500 text-center py-4">Sin otros agentes asignados a esta subdivisión.</p>
          `}
        </div>

        <!-- Division SOP (compact) -->
        <div class="bg-slate-950/80 rounded-xl p-5 border border-slate-800">
          <div class="flex items-center gap-2 mb-3 text-emerald-400 font-conthrax text-xs font-bold">
            <i data-lucide="clipboard-check" class="w-4 h-4"></i>
            <span>SOP RÁPIDO // ${subdiv.code}</span>
          </div>
          <ul class="space-y-1.5">
            ${(subdiv.sopSteps || []).map((step, i) => `
              <li class="flex items-start gap-2 font-conthrax text-[10px] text-slate-300">
                <span class="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 text-[9px] border border-emerald-500/30">0${i+1}</span>
                <span class="leading-relaxed">${step}</span>
              </li>
            `).join('')}
          </ul>
        </div>

      </div>
    </div>

    <!-- Personal Bitácora / Notes -->
    <div class="bg-slate-950/80 rounded-xl p-5 border border-slate-800">
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center gap-2 text-purple-400 font-conthrax text-xs font-bold">
          <i data-lucide="notebook-pen" class="w-4 h-4"></i>
          <span>BITÁCORA PERSONAL // SOLO VISIBLE PARA TI</span>
        </div>
        <button onclick="saveAgentDivisionNotes('${notesKey}')"
          class="px-3 py-1 rounded-lg bg-purple-500/10 hover:bg-purple-600 text-purple-400 hover:text-white font-conthrax text-[10px] font-bold transition-colors border border-purple-500/30 flex items-center gap-1">
          <i data-lucide="save" class="w-3 h-3"></i> Guardar
        </button>
      </div>
      <textarea id="agent-division-notes-area" rows="3"
        placeholder="Notas personales, observaciones de turno, pistas pendientes de verificar..."
        class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-purple-500 transition-colors custom-scroll resize-none"
      >${savedNotes}</textarea>
    </div>
  `;

  lucide.createIcons();
}

window.saveAgentDivisionNotes = function(notesKey) {
  const area = document.getElementById('agent-division-notes-area');
  if (!area) return;
  localStorage.setItem(notesKey, area.value);
  audioEngine.playKeyClick();
  showToast('📝 Bitácora personal guardada localmente.');
};

window.openDiscordAuthModal = function() {
  audioEngine.playRadioBeep();
  const modal = document.getElementById("discord-auth-modal");
  if (modal) {
    modal.classList.remove("hidden");
    lucide.createIcons();
  }
};

window.closeDiscordAuthModal = function() {
  const modal = document.getElementById("discord-auth-modal");
  if (modal) modal.classList.add("hidden");
};

// Autenticación rápida con Rol de Demostración (Sin contraseñas)
window.authenticateWithBotRole = function(roleKey) {
  const profile = BOT_PROFILES[roleKey];
  if (!profile) return;

  audioEngine.playKeyClick();
  currentDiscordUser = {
    ...profile,
    rankKey: roleKey,
    rankLevel: profile.rankLevel,
    isHighCommand: hasPermission('manage_roster') || hasPermission('manage_ranks') || profile.rankLevel >= 4,
    authAt: new Date().toLocaleString('es-ES')
  };
  isDetectiveAuth = hasPermission('view_reports') || profile.isAuthorizedDetective;
  localStorage.setItem("dd_discord_user", JSON.stringify(currentDiscordUser));

  updateDiscordAuthUI();
  closeDiscordAuthModal();
  renderCases(getActiveCasesList());

  if (profile.isAuthorizedDetective) {
    audioEngine.playAlertSound();
    showToast(`✅ Sesión iniciada como [${profile.role}]. Acceso concedido a Informes.`);
  } else {
    audioEngine.playRadioBeep();
    showToast(`⛔ Acceso DENEGADO. La cuenta @${profile.tag} no posee rol de detective.`);
  }
};

window.logoutDiscordAuth = function() {
  audioEngine.playRadioBeep();
  currentDiscordUser = null;
  isDetectiveAuth = false;
  localStorage.removeItem("dd_discord_user");
  localStorage.removeItem("dd_discord_token");
  updateDiscordAuthUI();
  renderCases(getActiveCasesList());
  showToast("Sesión de Discord cerrada. Permisos revocados.");
};

// --- REPORT / CASE EDITOR (MODIFICAR INFORMES POLICIALES) ---
let currentEditingCaseId = null;

function setupReportEditor() {
  const form = document.getElementById("report-editor-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      saveReportChanges();
    });
  }
}

window.openReportEditor = function(caseId = null) {
  if (caseId) {
    if (!hasPermission('edit_cases')) {
      showToast("🔒 No ostentas permiso para modificar expedientes policiales.");
      audioEngine.playRadioBeep();
      return;
    }
  } else {
    if (!hasPermission('create_cases')) {
      showToast("🔒 No ostentas permiso para abrir nuevos expedientes policiales.");
      audioEngine.playRadioBeep();
      return;
    }
  }

  audioEngine.playKeyClick();
  currentEditingCaseId = caseId;
  const modal = document.getElementById("report-editor-modal");
  if (!modal) return;

  const headerTitle = document.getElementById("editor-modal-title");
  const deleteBtn = document.getElementById("editor-delete-btn");

  const cases = getActiveCasesList();
  const c = caseId ? cases.find(item => item.id === caseId) : null;

  if (c) {
    if (headerTitle) headerTitle.textContent = `MODIFICAR INFORME: ${c.id}`;
    if (deleteBtn) {
      if (hasPermission('delete_cases')) {
        deleteBtn.classList.remove("hidden");
      } else {
        deleteBtn.classList.add("hidden");
      }
    }

    document.getElementById("edit-case-id").value = c.id;
    document.getElementById("edit-case-title").value = c.title;
    document.getElementById("edit-case-division").value = c.division;
    document.getElementById("edit-case-category").value = c.category;
    document.getElementById("edit-case-status").value = c.status;
    document.getElementById("edit-case-statustype").value = c.statusType;
    document.getElementById("edit-case-priority").value = c.priority;
    document.getElementById("edit-case-detective").value = c.leadDetective;
    document.getElementById("edit-case-date").value = c.date;
    document.getElementById("edit-case-location").value = c.location;
    document.getElementById("edit-case-image").value = c.image;
    document.getElementById("edit-case-summary").value = c.summary;
    document.getElementById("edit-case-evidence").value = (c.evidence || []).join("\n");
    document.getElementById("edit-case-suspects").value = (c.suspects || []).map(s => `${s.name} | ${s.role} | ${s.status}`).join("\n");
  } else {
    // New case
    if (headerTitle) headerTitle.textContent = "CREAR NUEVO EXPEDIENTE POLICIAL";
    if (deleteBtn) deleteBtn.classList.add("hidden");

    const newId = "CASE-2026-" + Math.floor(100 + Math.random() * 900);
    document.getElementById("edit-case-id").value = newId;
    document.getElementById("edit-case-title").value = "";
    document.getElementById("edit-case-division").value = "RHD - Robos & Homicidios";
    document.getElementById("edit-case-category").value = "homicide";
    document.getElementById("edit-case-status").value = "BAJO INVESTIGACIÓN";
    document.getElementById("edit-case-statustype").value = "active";
    document.getElementById("edit-case-priority").value = "CÓDIGO 3 (ALTA)";
    document.getElementById("edit-case-detective").value = currentDiscordUser ? `${currentDiscordUser.username} (${currentDiscordUser.badge})` : "Det. Asignado";
    document.getElementById("edit-case-date").value = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
    document.getElementById("edit-case-location").value = "Los Santos Metropolitan";
    document.getElementById("edit-case-image").value = "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80";
    document.getElementById("edit-case-summary").value = "";
    document.getElementById("edit-case-evidence").value = "";
    document.getElementById("edit-case-suspects").value = "";
  }

  modal.classList.remove("hidden");
  lucide.createIcons();
};

window.closeReportEditor = function() {
  const modal = document.getElementById("report-editor-modal");
  if (modal) modal.classList.add("hidden");
};

function saveReportChanges() {
  const id = document.getElementById("edit-case-id").value.trim();
  const title = document.getElementById("edit-case-title").value.trim();
  const division = document.getElementById("edit-case-division").value.trim();
  const category = document.getElementById("edit-case-category").value;
  const status = document.getElementById("edit-case-status").value.trim();
  const statusType = document.getElementById("edit-case-statustype").value;
  const priority = document.getElementById("edit-case-priority").value.trim();
  const leadDetective = document.getElementById("edit-case-detective").value.trim();
  const date = document.getElementById("edit-case-date").value.trim();
  const location = document.getElementById("edit-case-location").value.trim();
  const image = document.getElementById("edit-case-image").value.trim();
  const summary = document.getElementById("edit-case-summary").value.trim();
  
  const evidenceRaw = document.getElementById("edit-case-evidence").value.trim();
  const evidence = evidenceRaw ? evidenceRaw.split("\n").map(l => l.trim()).filter(Boolean) : [];

  const suspectsRaw = document.getElementById("edit-case-suspects").value.trim();
  const suspects = suspectsRaw ? suspectsRaw.split("\n").map(l => {
    const parts = l.split("|").map(p => p.trim());
    return {
      name: parts[0] || "Sospechoso No Identificado",
      role: parts[1] || "Persona de Interés",
      status: parts[2] || "Bajo Búsqueda"
    };
  }).filter(s => s.name) : [];

  if (!title || !summary) {
    showToast("⚠️ Ingrese al menos título y sinopsis del informe");
    return;
  }

  const cases = getActiveCasesList();
  const existingIdx = cases.findIndex(item => item.id === id);

  if (existingIdx >= 0) {
    if (!hasPermission('edit_cases')) {
      showToast("⛔ No ostentas permiso para modificar este expediente.");
      return;
    }
  } else {
    if (!hasPermission('create_cases')) {
      showToast("⛔ No ostentas permiso para abrir nuevos expedientes.");
      return;
    }
  }

  const updatedCase = {
    id,
    title,
    division,
    category,
    status,
    statusType,
    priority,
    leadDetective,
    date,
    location,
    summary,
    evidence,
    suspects,
    image: image || "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80"
  };

  if (existingIdx >= 0) {
    cases[existingIdx] = updatedCase;
    showToast(`✅ Expediente ${id} modificado y sincronizado.`);
    addAuditLog("EXPEDIENTE MODIFICADO", id, title, `Expediente actualizado por ${currentDiscordUser ? currentDiscordUser.username : 'Oficial'}`, currentDiscordUser ? currentDiscordUser.username : "Sistema");
  } else {
    cases.unshift(updatedCase);
    showToast(`✅ Nuevo expediente ${id} registrado en el archivo policial.`);
    addAuditLog("EXPEDIENTE CREADO", id, title, `Nueva investigación abierta en ${division}`, currentDiscordUser ? currentDiscordUser.username : "Sistema");
  }

  dbUpsertCase(updatedCase);
  saveCasesList(cases);
  audioEngine.playAlertSound();
  closeReportEditor();
  renderCases(getActiveCasesList());

  // If dossier was open, update it
  const caseModal = document.getElementById("case-modal");
  if (caseModal && !caseModal.classList.contains("hidden")) {
    openCaseModal(id);
  }
}

window.deleteReportCase = function() {
  if (!hasPermission('delete_cases')) {
    showToast("⛔ No ostentas permiso para eliminar expedientes policiales.");
    audioEngine.playRadioBeep();
    return;
  }
  if (!currentEditingCaseId) return;
  if (!confirm(`¿Está seguro de eliminar permanentemente el expediente ${currentEditingCaseId}?`)) return;

  dbDeleteCase(currentEditingCaseId);
  const cases = getActiveCasesList().filter(item => item.id !== currentEditingCaseId);
  saveCasesList(cases);

  addAuditLog("EXPEDIENTE ELIMINADO", currentEditingCaseId, "", "Expediente purgado del archivo judicial", currentDiscordUser ? currentDiscordUser.username : "Sistema");

  audioEngine.playRadioBeep();
  closeReportEditor();
  closeModal("case-modal");
  renderCases(getActiveCasesList());
  showToast(`🗑️ Expediente ${currentEditingCaseId} eliminado del archivo.`);
};

window.deleteCaseFromModal = function(caseId) {
  currentEditingCaseId = caseId;
  deleteReportCase();
};

// --- SIDEBAR DOCK & MOBILE CONTROLS (INSPIRADO EN SAPD PORTAL) ---
function setupSidebar() {
  const sidebar = document.getElementById("sidebar");
  const isDocked = localStorage.getItem("dd_sidebar_docked") === "true";
  
  if (isDocked && sidebar && window.innerWidth > 1024) {
    sidebar.classList.add("docked");
  }

  window.toggleSidebarDock = function() {
    if (!sidebar) return;
    audioEngine.playKeyClick();
    const docked = sidebar.classList.toggle("docked");
    localStorage.setItem("dd_sidebar_docked", docked);
  };

  window.toggleSidebarMobile = function() {
    if (!sidebar) return;
    audioEngine.playKeyClick();
    const backdrop = document.getElementById("sidebar-backdrop");
    const isOpen = sidebar.classList.toggle("mobile-open");
    if (backdrop) {
      backdrop.classList.toggle("active", isOpen);
    }
  };

  // Click on nav links: smoothly set active immediately and lock scrollspy temporarily
  document.querySelectorAll(".sidebar-nav .nav-link, .sidebar-alert-indicator").forEach(link => {
    link.addEventListener("click", (e) => {
      audioEngine.playKeyClick();
      const href = link.getAttribute("href");
      if (href && href.startsWith("#")) {
        isManualNavigation = true;
        document.querySelectorAll(".sidebar-nav .nav-link").forEach(l => l.classList.remove("active"));
        if (link.classList.contains("nav-link")) link.classList.add("active");
        setTimeout(() => { isManualNavigation = false; }, 900);
      }

      if (window.innerWidth <= 1024 && sidebar) {
        sidebar.classList.remove("mobile-open");
        const backdrop = document.getElementById("sidebar-backdrop");
        if (backdrop) backdrop.classList.remove("active");
      }
    });
  });
}

// --- FIXED SCROLL SPY: DYNAMIC & ACCURATE DOM ORDER ---
function setupScrollSpy() {
  const navLinks = document.querySelectorAll(".sidebar-nav .nav-link");

  function onScroll() {
    if (isManualNavigation) return;
    const scrollPos = window.scrollY + 140;
    
    // Read all section elements with IDs directly from the DOM in real order
    const sectionElements = Array.from(document.querySelectorAll("section[id]"));
    
    let currentSectionId = "";
    for (let i = sectionElements.length - 1; i >= 0; i--) {
      const sec = sectionElements[i];
      if (sec.offsetTop <= scrollPos) {
        currentSectionId = sec.id;
        break;
      }
    }
    
    if (currentSectionId) {
      navLinks.forEach(link => {
        const href = link.getAttribute("href");
        if (href === `#${currentSectionId}`) {
          link.classList.add("active");
        } else {
          link.classList.remove("active");
        }
      });
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
}

// --- CLOCK & STATUS SYSTEM ---
function initClock() {
  const timeElems = [document.getElementById("live-time"), document.getElementById("sidebar-live-time")];
  const zuluElems = [document.getElementById("zulu-time"), document.getElementById("sidebar-zulu-time")];

  function update() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('es-ES', { hour12: false });
    const zuluStr = now.toISOString().substring(11, 19) + "Z";

    timeElems.forEach(el => {
      if (el) el.textContent = timeStr;
    });

    zuluElems.forEach(el => {
      if (el) el.textContent = zuluStr;
    });
  }
  update();
  setInterval(update, 1000);
}

// --- RENDER CASES ---
function renderCases(casesToRender) {
  const container = document.getElementById("cases-grid");
  if (!container) return;

  container.innerHTML = "";

  if (casesToRender.length === 0) {
    container.innerHTML = `
      <div class="col-span-full text-center py-12 text-slate-400">
        <i data-lucide="folder-search" class="w-12 h-12 mx-auto mb-3 text-slate-600"></i>
        <p class="text-lg font-mono">No se encontraron expedientes con los filtros aplicados.</p>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  casesToRender.forEach(c => {
    let statusBadge = "";
    if (c.statusType === "active") {
      statusBadge = `<span class="stamp-active text-xs">⚠️ ${c.status}</span>`;
    } else if (c.statusType === "warrant") {
      statusBadge = `<span class="stamp-warrant text-xs">🎯 ${c.status}</span>`;
    } else if (c.statusType === "solved") {
      statusBadge = `<span class="stamp-solved text-xs">✓ ${c.status}</span>`;
    }

    const card = document.createElement("div");
    card.className = "case-folder rounded-xl p-6 border border-slate-800 shadow-xl flex flex-col justify-between cursor-pointer group";
    card.onclick = () => openCaseModal(c.id);

    card.innerHTML = `
      <div>
        <div class="flex items-start justify-between gap-3 mb-4">
          <div>
            <span class="text-xs font-conthrax text-amber-400/90 tracking-wider font-semibold block mb-1">${c.id} // ${c.division}</span>
            <h3 class="text-xl font-bold text-white font-gobold tracking-wide group-hover:text-amber-400 transition-colors">${c.title}</h3>
          </div>
          <div>${statusBadge}</div>
        </div>

        <div class="relative h-44 w-full rounded-lg overflow-hidden mb-4 border border-slate-700/60">
          <img src="${c.image}" alt="${c.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100">
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
          <div class="absolute bottom-2 left-3 text-xs font-mono text-slate-300 flex items-center gap-1.5 bg-black/60 px-2 py-1 rounded backdrop-blur-sm">
            <i data-lucide="map-pin" class="w-3.5 h-3.5 text-red-400"></i>
            <span>${c.location}</span>
          </div>
        </div>

        <p class="text-slate-400 text-sm line-clamp-2 mb-4 leading-relaxed">${c.summary}</p>
      </div>

      <div class="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
        <div class="flex items-center gap-1.5">
          <i data-lucide="shield-alert" class="w-4 h-4 text-amber-500"></i>
          <span>${c.leadDetective}</span>
        </div>
        <div class="flex items-center gap-2">
          ${hasPermission('edit_cases') ? `
            <button onclick="event.stopPropagation(); openReportEditor('${c.id}')" class="px-2.5 py-1 rounded bg-blue-600/30 hover:bg-blue-600 border border-blue-500/50 text-blue-300 hover:text-white font-conthrax text-[10px] transition-colors flex items-center gap-1 shadow">
              <i data-lucide="edit-3" class="w-3 h-3"></i> Editar
            </button>
          ` : ''}
          <button class="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            Expediente <i data-lucide="chevron-right" class="w-4 h-4"></i>
          </button>
        </div>
      </div>
    `;

    container.appendChild(card);
  });

  lucide.createIcons();
}

// --- CASE FILTERS & SEARCH ---
function setupCaseFilters() {
  const filterBtns = document.querySelectorAll(".case-filter-btn");
  const searchInput = document.getElementById("case-search-input");

  let currentCategory = "all";
  let currentQuery = "";

  function applyFilter() {
    const activeCases = getActiveCasesList();
    const filtered = activeCases.filter(c => {
      const matchCategory = currentCategory === "all" || c.category === currentCategory;
      const matchSearch = c.title.toLowerCase().includes(currentQuery.toLowerCase()) ||
        c.id.toLowerCase().includes(currentQuery.toLowerCase()) ||
        c.summary.toLowerCase().includes(currentQuery.toLowerCase()) ||
        c.leadDetective.toLowerCase().includes(currentQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
    renderCases(filtered);
  }

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => {
        b.classList.remove("bg-amber-500", "text-black", "font-bold");
        b.classList.add("bg-slate-800", "text-slate-300");
      });
      btn.classList.remove("bg-slate-800", "text-slate-300");
      btn.classList.add("bg-amber-500", "text-black", "font-bold");

      audioEngine.playKeyClick();
      currentCategory = btn.getAttribute("data-category");
      applyFilter();
    });
  });

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      currentQuery = e.target.value;
      applyFilter();
    });
  }
}

// --- CASE DETAIL MODAL ---
function openCaseModal(caseId) {
  if (!hasPermission('view_cases') || !currentDiscordUser || currentDiscordUser.rankKey === 'aspirante') {
    showToast("⛔ Acceso denegado: los expedientes judiciales son reservados para oficiales con rango.");
    audioEngine.playRadioBeep();
    return;
  }

  const cases = getActiveCasesList();
  const c = cases.find(item => item.id === caseId);
  if (!c) return;

  audioEngine.playRadioBeep();

  const modal = document.getElementById("case-modal");
  const content = document.getElementById("case-modal-content");
  if (!modal || !content) return;

  const evidenceHTML = c.evidence.map(e => `
    <li class="flex items-start gap-2 text-slate-300 text-sm">
      <span class="text-amber-500 font-mono font-bold">»</span>
      <span>${e}</span>
    </li>
  `).join("");

  const suspectsHTML = c.suspects.map(s => `
    <div class="bg-slate-900/80 p-3 rounded-lg border border-slate-800 flex items-center justify-between">
      <div>
        <h5 class="text-white font-semibold text-sm">${s.name}</h5>
        <p class="text-xs text-slate-400 font-mono">${s.role}</p>
      </div>
      <span class="text-xs font-mono px-2 py-0.5 rounded bg-red-950/80 text-red-300 border border-red-800/60">${s.status}</span>
    </div>
  `).join("");

  content.innerHTML = `
    <!-- Top Dossier Header -->
    <div class="bg-gradient-to-r from-amber-950/50 via-slate-900 to-slate-900 p-6 border-b border-amber-500/30">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-3 mb-2">
            <span class="font-conthrax text-xs bg-amber-500/10 text-amber-400 border border-amber-500/40 px-2.5 py-0.5 rounded font-bold">${c.id}</span>
            <span class="font-conthrax text-xs text-slate-400">FECHA APERTURA: ${c.date}</span>
          </div>
          <h2 class="text-2xl lg:text-3xl font-extrabold text-white font-gobold tracking-wide">${c.title}</h2>
          <p class="text-sm font-conthrax text-amber-300/80 mt-1">${c.division}</p>
        </div>
        <div class="text-right">
          <span class="stamp-classified text-sm">DOCUMENTO CLASIFICADO</span>
          <p class="text-xs font-conthrax text-red-400 mt-2 font-semibold">PRIORIDAD: ${c.priority}</p>
        </div>
      </div>
    </div>

    <!-- Body Info -->
    <div class="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800 font-mono text-xs">
        <div>
          <span class="text-slate-500 block">INVESTIGADOR PRINCIPAL</span>
          <span class="text-amber-400 font-bold text-sm">${c.leadDetective}</span>
        </div>
        <div>
          <span class="text-slate-500 block">UBICACIÓN DEL INCIDENTE</span>
          <span class="text-white font-bold text-sm">${c.location}</span>
        </div>
        <div>
          <span class="text-slate-500 block">ESTADO OPERATIVO</span>
          <span class="text-emerald-400 font-bold text-sm">${c.status}</span>
        </div>
      </div>

      <!-- Resumen policial -->
      <div>
        <h4 class="text-sm font-mono uppercase tracking-wider text-amber-400 font-bold mb-2 flex items-center gap-2">
          <i data-lucide="file-text" class="w-4 h-4"></i> Sinopsis del Informe Policial
        </h4>
        <div class="bg-slate-950/50 p-4 rounded-xl border border-slate-800 text-slate-300 leading-relaxed text-sm">
          ${c.summary}
        </div>
      </div>

      <!-- Evidencias & Sospechosos Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Evidencias -->
        <div>
          <h4 class="text-sm font-mono uppercase tracking-wider text-amber-400 font-bold mb-3 flex items-center gap-2">
            <i data-lucide="fingerprint" class="w-4 h-4"></i> Cadena de Custodia / Evidencias
          </h4>
          <ul class="space-y-2.5 bg-slate-950/50 p-4 rounded-xl border border-slate-800">
            ${evidenceHTML}
          </ul>
        </div>

        <!-- Personas de interés -->
        <div>
          <h4 class="text-sm font-mono uppercase tracking-wider text-amber-400 font-bold mb-3 flex items-center gap-2">
            <i data-lucide="users" class="w-4 h-4"></i> Sujetos de Interés / Imputados
          </h4>
          <div class="space-y-2">
            ${suspectsHTML}
          </div>
        </div>
      </div>

      <!-- Foto de la escena -->
      <div class="rounded-xl overflow-hidden border border-slate-800">
        <div class="bg-slate-900 px-4 py-2 border-b border-slate-800 text-xs font-mono text-slate-400 flex items-center justify-between">
          <span>REGISTRO FOTOGRÁFICO DE LA ESCENA // ARCHIVO FORENSE</span>
          <span class="text-amber-500">ANEXO A-1</span>
        </div>
        <img src="${c.image}" class="w-full h-64 object-cover" alt="Escena del crimen">
      </div>
    </div>

    <!-- Modal Footer Actions -->
    <div class="bg-slate-950 p-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
      <div class="text-xs font-mono text-slate-400 flex items-center gap-2">
        <i data-lucide="lock" class="w-3.5 h-3.5 text-amber-400"></i>
        <span>Acceso restringido bajo Ordenanza Penal 10-80</span>
      </div>
      <div class="flex items-center gap-2.5">
        ${hasPermission('edit_cases') ? `
          <button onclick="openReportEditor('${c.id}')" class="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider font-conthrax rounded-lg transition-colors flex items-center gap-1.5 shadow">
            <i data-lucide="edit-3" class="w-3.5 h-3.5"></i> Modificar Informe
          </button>
        ` : ''}
        ${hasPermission('delete_cases') ? `
          <button onclick="deleteCaseFromModal('${c.id}')" class="px-3.5 py-2 bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-700/50 text-xs uppercase tracking-wider font-conthrax rounded-lg transition-colors flex items-center gap-1.5 shadow">
            <i data-lucide="trash-2" class="w-3.5 h-3.5"></i> Eliminar
          </button>
        ` : ''}
        <button onclick="window.print()" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono rounded-lg transition-colors flex items-center gap-1.5">
          <i data-lucide="printer" class="w-3.5 h-3.5"></i> Imprimir
        </button>
        <button onclick="closeModal('case-modal')" class="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase tracking-wider font-mono rounded-lg transition-colors">
          Cerrar
        </button>
      </div>
    </div>
  `;

  modal.classList.remove("hidden");
  lucide.createIcons();
}

// ─────────────────────────────────────────────────────────────────────────────
//  DYNAMIC MOST WANTED ENGINE (CRUD, NIVELES 1-5, PIN / DESTACAR)
// ─────────────────────────────────────────────────────────────────────────────

function getActiveWantedList() {
  const cached = (typeof getCachedWanted === 'function') ? getCachedWanted() : [];
  if (cached.length > 0) return cached.map(rowToWanted);
  const custom = localStorage.getItem("dd_custom_wanted");
  if (custom) {
    try {
      const parsed = JSON.parse(custom);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch(e) {}
  }
  return typeof DEFAULT_WANTED_SEED !== 'undefined' ? DEFAULT_WANTED_SEED : [];
}

let currentWantedFilter = 'all';

window.filterWantedByLevel = function(filterVal) {
  currentWantedFilter = filterVal;
  audioEngine.playKeyClick();

  // Actualizar estilos de los botones de filtro
  document.querySelectorAll(".wanted-filter-btn").forEach(btn => {
    btn.classList.remove("bg-amber-500", "text-black");
    btn.classList.add("bg-slate-800");
  });

  const activeBtn = document.getElementById(`wanted-filter-${filterVal}`);
  if (activeBtn) {
    activeBtn.classList.remove("bg-slate-800");
    activeBtn.classList.add("bg-amber-500", "text-black");
  }

  renderMostWanted(getActiveWantedList());
};

function renderMostWanted(list) {
  const container = document.getElementById("most-wanted-grid");
  if (!container) return;

  const countSpan = document.getElementById("wanted-count-all");
  if (countSpan) countSpan.textContent = list.length;

  // Filtrado según nivel o pin
  let filtered = [...list];
  if (currentWantedFilter === 'pinned') {
    filtered = filtered.filter(w => w.isPinned);
  } else if (currentWantedFilter !== 'all') {
    const lvlNum = Number(currentWantedFilter);
    if (lvlNum === 2) {
      filtered = filtered.filter(w => Number(w.level) <= 2);
    } else {
      filtered = filtered.filter(w => Number(w.level) === lvlNum);
    }
  }

  // Ordenar: Pinned siempre primero, luego nivel descendente
  filtered.sort((a, b) => {
    const pinA = Boolean(a.isPinned);
    const pinB = Boolean(b.isPinned);
    if (pinA && !pinB) return -1;
    if (!pinA && pinB) return 1;
    const lvlA = Number(a.level) || 0;
    const lvlB = Number(b.level) || 0;
    return lvlB - lvlA;
  });

  container.innerHTML = "";

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="col-span-full text-center py-12 glass-panel rounded-xl border border-slate-800">
        <i data-lucide="shield-check" class="w-12 h-12 text-slate-500 mx-auto mb-3"></i>
        <p class="text-sm font-conthrax text-slate-400 uppercase">No hay fugitivos registrados con este filtro de búsqueda</p>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  const canManageWanted = Boolean(currentDiscordUser && (hasPermission('create_cases') || hasPermission('edit_cases') || currentDiscordUser.isHighCommand));

  filtered.forEach(w => {
    const card = document.createElement("div");
    card.className = `glass-panel-gold rounded-xl overflow-hidden border ${w.isPinned ? 'border-amber-500 shadow-xl shadow-amber-500/10' : 'border-slate-800'} flex flex-col justify-between group transition-all`;

    // Danger level meta
    const lvl = Number(w.level) || 3;
    let lvlBadgeColor = "bg-amber-500/20 text-amber-300 border-amber-500/50";
    if (lvl >= 5) lvlBadgeColor = "bg-red-500/20 text-red-400 border-red-500/60";
    else if (lvl === 4) lvlBadgeColor = "bg-orange-500/20 text-orange-400 border-orange-500/60";
    else if (lvl <= 2) lvlBadgeColor = "bg-yellow-500/20 text-yellow-300 border-yellow-500/50";

    card.innerHTML = `
      <div>
        <!-- Photo Container -->
        <div class="relative h-64 w-full overflow-hidden bg-slate-950">
          <img src="${w.photo}" alt="${w.name}" class="w-full h-full object-cover filter grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500">
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
          
          <!-- Top Badges & Quick Action Controls -->
          <div class="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2">
            <div class="flex items-center gap-1.5 flex-wrap">
              <span class="stamp-classified text-[10px]">SE BUSCA</span>
              ${w.isPinned ? `
                <span class="px-2 py-0.5 rounded bg-amber-500 text-black font-conthrax font-extrabold text-[9px] tracking-wider shadow-md flex items-center gap-1">
                  <i data-lucide="pin" class="w-2.5 h-2.5"></i> FIJADO
                </span>
              ` : ''}
            </div>

            ${canManageWanted ? `
              <div class="flex items-center gap-1 bg-black/75 p-1 rounded-lg backdrop-blur-sm border border-slate-700/80">
                <button onclick="toggleWantedPin('${w.id}')" title="${w.isPinned ? 'Desfijar de la cabecera' : 'Fijar en cabecera'}"
                  class="p-1 rounded hover:bg-slate-800 text-amber-400 hover:text-amber-300 transition-colors">
                  <i data-lucide="${w.isPinned ? 'pin-off' : 'pin'}" class="w-3.5 h-3.5"></i>
                </button>
                <button onclick="openWantedEditor('${w.id}')" title="Editar ficha de fugitivo"
                  class="p-1 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors">
                  <i data-lucide="edit-3" class="w-3.5 h-3.5"></i>
                </button>
                <button onclick="deleteWantedTarget('${w.id}')" title="Eliminar del registro judicial"
                  class="p-1 rounded hover:bg-red-950 text-red-400 hover:text-red-300 transition-colors">
                  <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                </button>
              </div>
            ` : ''}
          </div>

          <!-- Danger Level Badge -->
          <div class="absolute top-11 right-2.5 font-conthrax text-[10px] font-extrabold px-2 py-0.5 rounded border ${lvlBadgeColor} backdrop-blur-sm">
            NVL ${lvl} // ${w.dangerLevel || 'BUSCADO'}
          </div>

          <!-- Name & Alias -->
          <div class="absolute bottom-3 left-4 right-4">
            <p class="text-xs font-conthrax text-amber-400 tracking-wider">ALIAS: "${w.alias}"</p>
            <h3 class="text-xl font-black text-white font-gobold tracking-wide leading-tight">${w.name}</h3>
          </div>
        </div>

        <!-- Details Body -->
        <div class="p-4 space-y-3 font-conthrax text-xs">
          <div class="bg-amber-500/10 border border-amber-500/30 rounded-lg p-2.5 flex items-center justify-between">
            <span class="text-[11px] text-slate-300">RECOMPENSA:</span>
            <span class="text-base font-black text-amber-400 font-mono">${w.bounty}</span>
          </div>

          <div>
            <span class="text-[10px] text-slate-400 uppercase block mb-1 font-bold">Cargos Imputados:</span>
            <p class="text-[11px] text-slate-200 font-mono bg-slate-950/70 p-2 rounded border border-slate-800 leading-relaxed">${w.charges}</p>
          </div>

          <div>
            <span class="text-[10px] text-slate-400 uppercase block mb-1 font-bold">Último Avistamiento:</span>
            <p class="text-[11px] text-red-300 font-mono flex items-center gap-1.5">
              <i data-lucide="crosshair" class="w-3.5 h-3.5 text-red-400 shrink-0"></i> ${w.lastSeen || 'Desconocido'}
            </p>
          </div>

          ${w.notes ? `<p class="text-slate-400 text-[11px] italic border-l-2 border-amber-500/40 pl-2 mt-2 leading-relaxed">${w.notes}</p>` : ''}
        </div>
      </div>

      <!-- Action Button -->
      <div class="p-4 pt-0">
        <button onclick="reportWantedTarget('${w.name}', '${w.alias}')" class="w-full py-2.5 bg-red-600/90 hover:bg-red-500 text-white font-conthrax font-bold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-red-950/50">
          <i data-lucide="send" class="w-3.5 h-3.5"></i> Aportar Datos Anónimos
        </button>
      </div>
    `;

    container.appendChild(card);
  });

  lucide.createIcons();
}

window.openWantedEditor = function(wantedId = null) {
  if (!currentDiscordUser || (!hasPermission('create_cases') && !hasPermission('edit_cases') && !currentDiscordUser.isHighCommand)) {
    showToast("⛔ Solo oficiales con rango autorizado pueden gestionar el tablón de Más Buscados.");
    audioEngine.playRadioBeep();
    return;
  }

  audioEngine.playKeyClick();
  const modal = document.getElementById("wanted-editor-modal");
  if (!modal) return;

  const titleElem = document.getElementById("wanted-editor-title");
  const deleteBtn = document.getElementById("wanted-delete-btn");

  if (wantedId) {
    const list = getActiveWantedList();
    const w = list.find(item => item.id === wantedId);
    if (!w) return;

    if (titleElem) titleElem.textContent = `EDITAR FUGITIVO: ${w.alias || w.name}`;
    if (deleteBtn) deleteBtn.classList.remove("hidden");

    document.getElementById("wanted-edit-id").value = w.id;
    document.getElementById("wanted-edit-name").value = w.name || "";
    document.getElementById("wanted-edit-alias").value = w.alias || "";
    document.getElementById("wanted-edit-level").value = String(w.level || 3);
    document.getElementById("wanted-edit-bounty").value = w.bounty || "";
    document.getElementById("wanted-edit-status").value = w.status || "Buscado";
    document.getElementById("wanted-edit-lastseen").value = w.lastSeen || "";
    document.getElementById("wanted-edit-photo").value = w.photo || "";
    document.getElementById("wanted-edit-charges").value = w.charges || "";
    document.getElementById("wanted-edit-notes").value = w.notes || "";
    document.getElementById("wanted-edit-pinned").checked = Boolean(w.isPinned);
  } else {
    if (titleElem) titleElem.textContent = "NUEVA ORDEN DE CAPTURA // FUGITIVO";
    if (deleteBtn) deleteBtn.classList.add("hidden");

    document.getElementById("wanted-edit-id").value = "";
    document.getElementById("wanted-edit-name").value = "";
    document.getElementById("wanted-edit-alias").value = "";
    document.getElementById("wanted-edit-level").value = "3";
    document.getElementById("wanted-edit-bounty").value = "$25,000";
    document.getElementById("wanted-edit-status").value = "Buscado";
    document.getElementById("wanted-edit-lastseen").value = "";
    document.getElementById("wanted-edit-photo").value = "";
    document.getElementById("wanted-edit-charges").value = "";
    document.getElementById("wanted-edit-notes").value = "";
    document.getElementById("wanted-edit-pinned").checked = false;
  }

  modal.classList.remove("hidden");
  lucide.createIcons();
};

window.saveWantedTarget = function(event) {
  if (event) event.preventDefault();

  const id = document.getElementById("wanted-edit-id").value.trim() || `WANTED-${Date.now()}`;
  const name = document.getElementById("wanted-edit-name").value.trim();
  const alias = document.getElementById("wanted-edit-alias").value.trim();
  const level = parseInt(document.getElementById("wanted-edit-level").value) || 3;
  const bounty = document.getElementById("wanted-edit-bounty").value.trim() || "$0";
  const status = document.getElementById("wanted-edit-status").value;
  const lastSeen = document.getElementById("wanted-edit-lastseen").value.trim();
  const photo = document.getElementById("wanted-edit-photo").value.trim() || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80";
  const charges = document.getElementById("wanted-edit-charges").value.trim();
  const notes = document.getElementById("wanted-edit-notes").value.trim();
  const isPinned = document.getElementById("wanted-edit-pinned").checked;

  let dangerLevel = "ALTO RIESGO";
  let dangerColor = "bg-amber-500/20 text-amber-400 border-amber-500";
  if (level >= 5) {
    dangerLevel = "EXTREMO // DISPARAR A LA VISTA";
    dangerColor = "bg-red-500/20 text-red-400 border-red-500";
  } else if (level === 4) {
    dangerLevel = "ALTO RIESGO // ARMAS PESADAS";
    dangerColor = "bg-orange-500/20 text-orange-400 border-orange-500";
  } else if (level === 3) {
    dangerLevel = "PRIORIDAD POLICIAL // VIGILANCIA";
    dangerColor = "bg-amber-500/20 text-amber-400 border-amber-500";
  } else if (level === 2) {
    dangerLevel = "RIESGO DE FUGA // MODERADO";
    dangerColor = "bg-yellow-500/20 text-yellow-300 border-yellow-500";
  } else {
    dangerLevel = "BÚSQUEDA ORDINARIA // COMPARECENCIA";
    dangerColor = "bg-slate-500/20 text-slate-300 border-slate-500";
  }

  const wantedData = {
    id,
    name,
    alias,
    level,
    dangerLevel,
    dangerColor,
    bounty,
    status,
    lastSeen,
    photo,
    charges,
    notes,
    isPinned
  };

  dbUpsertWanted(wantedData);

  audioEngine.playAlertSound();
  closeModal("wanted-editor-modal");
  showToast(`✅ Ficha de fugitivo "${name}" (${alias}) guardada con éxito.`);

  addAuditLog(
    "FUGITIVO ACTUALIZADO",
    name,
    `NVL ${level}`,
    `Ficha de fugitivo judicial ${name} (${alias}) actualizada en el tablón`,
    currentDiscordUser ? currentDiscordUser.username : "Sistema"
  );

  renderMostWanted(getActiveWantedList());
};

window.toggleWantedPin = function(wantedId) {
  const list = getActiveWantedList();
  const w = list.find(item => item.id === wantedId);
  if (!w) return;

  w.isPinned = !w.isPinned;
  dbUpsertWanted(w);
  audioEngine.playKeyClick();
  showToast(w.isPinned ? `📌 Fugitivo ${w.alias} fijado en cabecera.` : `Fugitivo ${w.alias} desfijado de cabecera.`);
  renderMostWanted(getActiveWantedList());
};

window.deleteWantedTarget = function(wantedId) {
  if (!confirm(`¿Está seguro de eliminar definitivamente al fugitivo ${wantedId} del tablón judicial?`)) return;

  dbDeleteWanted(wantedId);
  audioEngine.playRadioBeep();
  showToast(`🗑️ Fugitivo eliminado del archivo judicial.`);

  addAuditLog(
    "FUGITIVO ELIMINADO",
    wantedId,
    "",
    `Fugitivo purgado del tablón judicial por ${currentDiscordUser ? currentDiscordUser.username : 'Oficial'}`,
    currentDiscordUser ? currentDiscordUser.username : "Sistema"
  );

  renderMostWanted(getActiveWantedList());
};

window.deleteWantedTargetFromModal = function() {
  const id = document.getElementById("wanted-edit-id").value;
  if (!id) return;
  closeModal("wanted-editor-modal");
  deleteWantedTarget(id);
};

// ─────────────────────────────────────────────────────────────────────────────
//  APARTADOS DE CADA SUBDIVISIÓN DE LA DB
// ─────────────────────────────────────────────────────────────────────────────

const SUBDIVISIONS_DATA = {
  rhd: {
    id: "rhd",
    code: "RHD",
    name: "Robos y Homicidios",
    fullName: "Robbery-Homicide Division (RHD)",
    badgeColor: "red",
    icon: "skull",
    channel: "RADIO TAC-1 (142.100 MHz)",
    clearance: "NIVEL 2 // CONFIDENCIAL",
    motto: "«Facta Non Verba — Justicia en la Escena»",
    description: "División de élite encargada de esclarecer homicidios calificados, muertes violentas, robos agravados a entidades bancarias y secuestros extorsivos.",
    sopSteps: [
      "Aseguramiento del perímetro y acordonamiento en doble anillo táctico.",
      "Inspección ocular sin alterar indicios biológicos en conjunto con CSI.",
      "Toma de declaraciones inmediatas a testigos y revisión de cámaras de seguridad.",
      "Redacción de auto de diligencias y elevación a la Fiscalía de Distrito."
    ],
    equipment: ["Glock 19 Gen5 con Linterna TLR-1", "Chaleco Balístico Pesado Nivel IIIA", "Kit de Precintado Forense", "Vehículo Encubierto Vapid Stanier / Buffalo"]
  },
  gnd: {
    id: "gnd",
    code: "GND",
    name: "Narcóticos & Pandillas",
    fullName: "Gang and Narcotics Division (GND)",
    badgeColor: "amber",
    icon: "package-search",
    channel: "RADIO TAC-2 (142.250 MHz CIFRADA)",
    clearance: "NIVEL 3 // ALTO SECRETO",
    motto: "«In Umbra Vigilamus — En las sombras desmantelamos»",
    description: "Unidad táctico-investigativa especializada en infiltración de redes de narcotráfico, contrabando de armas de asalto y bandas criminales organizadas.",
    sopSteps: [
      "Vigilancia estática y dinámica encubierta con registro fotográfico.",
      "Interceptación de comunicaciones telefónicas autorizada judicialmente.",
      "Coordinación de incursiones tácticas (breaching) con unidades SWAT.",
      "Pesaje, prueba de reactivo químico y custodia estricta de estupefacientes."
    ],
    equipment: ["Carabina Colt M4A1 Semi / Supresor", "Rastreadores GPS Magnetizados", "Cámara de Vigilancia Larga Distancia", "Flota de Vehículos Civiles Sin Distintivos"]
  },
  csi: {
    id: "csi",
    code: "CSI",
    name: "Forense & Balística",
    fullName: "Crime Scene Investigation & Forensics (CSI)",
    badgeColor: "blue",
    icon: "microscope",
    channel: "RADIO LAB-1 (142.350 MHz)",
    clearance: "NIVEL 2 // TÉCNICO PERICIAL",
    motto: "«Ibi Testis Silet, Materia Loquitur — Donde calla el testigo, habla la materia»",
    description: "Departamento pericial científico de recolección de indicios, cotejo balístico, dactiloscopia forense y reconstrucción informática tridimensional.",
    sopSteps: [
      "Fijación fotográfica métrica de la escena del crimen antes de cualquier intervención.",
      "Levantamiento de vainas, casquillos e indicios biológicos con cadena de custodia.",
      "Revelado de huellas dactilares latentes mediante polvos magnéticos y cianoacrilato.",
      "Emisión de informe pericial técnico vinculante para el juicio penal."
    ],
    equipment: ["Maletín Forense Sirchie Completo", "Luz Forense UV Multiespectral", "Microscopio Balístico Comparador", "Furgón Taller Móvil de Análisis In Situ"]
  },
  cid: {
    id: "cid",
    code: "CID",
    name: "Ciberdelincuencia & Fraude",
    fullName: "Cyber & Financial Crime Division (CID)",
    badgeColor: "emerald",
    icon: "binary",
    channel: "RADIO CYBER-SEC (CANAL DIGITAL SEGURO)",
    clearance: "NIVEL 3 // INTELIGENCIA INFORMÁTICA",
    motto: "«Nullum Vestigium Invisibile — Ningún rastro es invisible en la red»",
    description: "Unidad tecnológica dedicada al rastreo de billeteras de criptoactivos, lavado de capitales corporativo, extorsión digital y ciberdelincuencia organizada.",
    sopSteps: [
      "Preservación de evidencia digital volátil en memoria RAM mediante volcados forenses.",
      "Trazabilidad de transacciones en la blockchain y geolocalización de nodos IP.",
      "Incautación de soportes informáticos con bolsas Faraday anti-inhibición.",
      "Descifrado forense y análisis de metadatos de archivos incriminatorios."
    ],
    equipment: ["Estación Forense Tableau con Bloqueador de Escritura", "Bolsas Faraday para Terminales Móviles", "Software de Trazabilidad Blockchain", "Servidor Cifrado Local"]
  },
  iad: {
    id: "iad",
    code: "IAD",
    name: "Asuntos Internos",
    fullName: "Internal Affairs Division (IAD)",
    badgeColor: "purple",
    icon: "eye",
    channel: "RADIO INTERNA (RESTRINGIDA AL MANDO)",
    clearance: "NIVEL 4 // MANDO SUPREMO",
    motto: "«Quis Custodiet Ipsos Custodes — ¿Quién vigila a los guardianes?»",
    description: "Departamento independiente de auditoría deontológica, investigación confidencial de corrupción, sobornos, negligencia grave y abuso de poder.",
    sopSteps: [
      "Recepción y clasificación confidencial de denuncias contra miembros policiales.",
      "Auditoría cruzada de bitácoras de servicio, armeros y registro de llamadas.",
      "Entrevistas formales de investigación interna bajo apercibimiento.",
      "Elevación de dictamen disciplinario vinculante al Capitán de División."
    ],
    equipment: ["Acreditaciones Especiales de Acceso Irrestricto", "Grabadoras de Audio Digital Homologadas", "Acceso al Registro Central de Armamento", "Despacho Aislado Acústicamente"]
  },
  ccd: {
    id: "ccd",
    code: "CCD",
    name: "Casos Fríos & Desapariciones",
    fullName: "Cold Case & Missing Persons Division (CCD)",
    badgeColor: "cyan",
    icon: "archive",
    channel: "RADIO SEARCH-1 (142.450 MHz)",
    clearance: "NIVEL 2 // RESTRINGIDO",
    motto: "«Memoria Nunquam Perit — La memoria nunca se extingue»",
    description: "Especialistas en reapertura de investigaciones archivadas mediante nuevas técnicas periciales de ADN, búsqueda de personas desaparecidas y fosas clandestinas.",
    sopSteps: [
      "Revisión integral de sumarios judiciales antiguos y cotejo con bases de datos modernas.",
      "Búsqueda georreferenciada sobre el terreno con unidades caninas de rastreo.",
      "Re-entrevista a allegados y testigos tras prescripción de presiones delictivas.",
      "Confirmación genética de restos óseos o biológicos mediante ADN mitocondrial."
    ],
    equipment: ["Kits de Extracción de ADN en Huesos y Tejidos Secos", "Drones Térmicos de Búsqueda Rural", "Acceso a Microfilms y Archivos Históricos", "Vehículo Todo Terreno 4x4"]
  },
  swat: {
    id: "swat",
    code: "SWAT",
    name: "Operaciones Tácticas",
    fullName: "Special Weapons and Tactics (SWAT)",
    badgeColor: "emerald",
    icon: "crosshair",
    channel: "RADIO TAC-SWAT (142.900 MHz CIFRADA)",
    clearance: "NIVEL 4 // ASALTO TÁCTICO",
    motto: "«Semper Paratus — Entrada contundente y resolución crítica»",
    description: "Equipo de asalto y respuesta armada para rescate de rehenes, neutralización de tiradores activos e incursiones de alto riesgo.",
    sopSteps: [
      "Establecimiento del puesto de mando táctico perimetral y despliegue de francotiradores.",
      "Breaching táctico con explosivos controlados o ariete hidráulico.",
      "Despeje dinámico habitación por habitación asegurando rehenes e incomunicando sospechosos.",
      "Custodia estricta del escenario y entrega del inmueble a los detectives de homicidios/narcóticos."
    ],
    equipment: ["Subfusil HK MP5A3 / Carabina Colt M4A1", "Ariete Hidráulico de Breaching", "Escudo Balístico con Ventana Nivel IV", "Vehículo Blindado Lenco BearCat"]
  }
};

let currentActiveSubdivision = 'rhd';

// ─── SECCIÓN "MI SUBDIVISIÓN" PRIVADA ────────────────────────────────────────
// Renderiza el panel privado de subdivisión en la sección #unidades
function renderSubdivisionPrivatePanel() {
  const deniedView = document.getElementById('subdivision-denied-view');
  const authorizedView = document.getElementById('subdivision-authorized-view');
  const deniedMsg = document.getElementById('subdivision-denied-msg');
  const navBadge = document.getElementById('nav-subdiv-badge');

  if (!deniedView || !authorizedView) return;

  // Determinar si el usuario tiene subdivisión asignada
  if (!currentDiscordUser || currentDiscordUser.rankKey === 'aspirante' || !hasPermission('view_reports')) {
    // No logueado o sin rango
    deniedView.classList.remove('hidden');
    authorizedView.classList.add('hidden');
    if (navBadge) navBadge.classList.add('hidden');
    if (deniedMsg && !currentDiscordUser) {
      deniedMsg.textContent = 'Este apartado es de acceso privado. Inicia sesión con Discord y espera a que Jefatura te asigne una subdivisión.';
    } else if (deniedMsg && currentDiscordUser?.rankKey === 'aspirante') {
      deniedMsg.textContent = `Hola ${currentDiscordUser.username}. Tu cuenta está en proceso de evaluación como Aspirante. Jefatura te asignará una subdivisión cuando apruebes el período de prueba.`;
    }
    return;
  }

  const agent = currentDiscordUser.rosterAgent || {};
  const divisionStr = agent.division || currentDiscordUser.role || '';
  const subdivId = getSubdivisionIdFromDivision(divisionStr);

  if (!subdivId) {
    // Logueado pero sin subdivisión asignada
    deniedView.classList.remove('hidden');
    authorizedView.classList.add('hidden');
    if (navBadge) navBadge.classList.add('hidden');
    if (deniedMsg) {
      deniedMsg.textContent = `Hola ${currentDiscordUser.username}. Tienes rango activo pero aún no se te ha asignado ninguna subdivisión. Contacta con Jefatura para que te asignen una rama operativa.`;
    }
    return;
  }

  // Tiene subdivisión — mostrar panel privado
  deniedView.classList.add('hidden');
  authorizedView.classList.remove('hidden');

  // Badge en nav
  if (navBadge) {
    navBadge.classList.remove('hidden');
    const subdiv = SUBDIVISIONS_DATA[subdivId] || {};
    navBadge.textContent = subdiv.code || subdivId.toUpperCase();
  }

  // Reusar renderAgentDivisionPanel pero inyectando en authorized-view
  const subdiv = SUBDIVISIONS_DATA[subdivId] || {};
  const allCases = typeof getActiveCasesList === 'function' ? getActiveCasesList() : [];
  const myCases = allCases.filter(c => {
    const div = (c.division || '').toLowerCase();
    const cat = (c.category || '').toLowerCase();
    if (subdivId === 'rhd') return div.includes('rhd') || cat.includes('homicide') || cat.includes('robbery');
    if (subdivId === 'gnd') return div.includes('gnd') || cat.includes('narcotics');
    if (subdivId === 'csi') return div.includes('csi') || div.includes('forense');
    if (subdivId === 'cid') return div.includes('cid') || cat.includes('fraud') || div.includes('ciber');
    if (subdivId === 'iad') return div.includes('iad') || cat.includes('internal');
    if (subdivId === 'ccd') return div.includes('ccd') || cat.includes('missing');
    return false;
  });

  const allReports = typeof getActiveConfidentialReports === 'function' ? getActiveConfidentialReports() : [];
  const myReports = hasPermission('view_reports')
    ? allReports.filter(r => {
        const rt = (r.title || '').toLowerCase() + (r.summary || '').toLowerCase();
        return rt.includes(subdivId) || rt.includes((subdiv.code || '').toLowerCase()) || (r.author === currentDiscordUser.username);
      })
    : [];

  const roster = typeof getCachedRoster === 'function' ? getCachedRoster().map(rowToAgent) : [];
  const teammates = roster.filter(a => {
    const d = (a.division || '').toLowerCase();
    return d.includes((subdiv.code || '').toLowerCase()) && a.discordId !== currentDiscordUser.id;
  });

  const notesKey = `dd_div_notes_${currentDiscordUser.id}_${subdivId}`;
  const savedNotes = localStorage.getItem(notesKey) || '';

  const colorMap = { rhd:'red', gnd:'amber', csi:'blue', cid:'emerald', iad:'purple', ccd:'cyan' };
  const bc = colorMap[subdivId] || 'amber';

  authorizedView.innerHTML = `
    <!-- Panel Header -->
    <div class="glass-panel-gold rounded-2xl border border-${bc}-500/40 p-6 sm:p-10 shadow-2xl relative overflow-hidden mb-8">
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 pb-6 border-b border-${bc}-500/20">
        <div class="flex items-center gap-4">
          <div class="w-16 h-16 rounded-2xl bg-${bc}-500/10 border-2 border-${bc}-500/40 flex items-center justify-center text-${bc}-400 shrink-0 shadow-lg">
            <i data-lucide="${subdiv.icon}" class="w-8 h-8"></i>
          </div>
          <div>
            <div class="flex items-center gap-2 flex-wrap mb-1">
              <span class="px-2.5 py-0.5 rounded bg-${bc}-500/20 border border-${bc}-500/40 text-${bc}-300 font-conthrax text-[10px] font-bold">
                ${subdiv.code} // ${subdiv.name?.toUpperCase()}
              </span>
              <span class="px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-conthrax text-[9px] font-bold">● ACCESO VERIFICADO</span>
            </div>
            <h3 class="text-2xl sm:text-3xl font-black font-gobold text-white tracking-wide">${subdiv.fullName}</h3>
            <p class="text-xs font-conthrax text-${bc}-400/90 italic mt-0.5">${subdiv.motto}</p>
          </div>
        </div>
        <div class="flex items-center gap-4">
          <img src="${currentDiscordUser.avatar || 'https://cdn.discordapp.com/embed/avatars/0.png'}"
            class="w-14 h-14 rounded-2xl object-cover border-2 border-${bc}-500/60 shadow-lg" alt="Avatar">
          <div>
            <p class="text-xs font-conthrax text-slate-400">AGENTE ACTIVO</p>
            <p class="text-base font-black font-gobold text-white">${currentDiscordUser.username}</p>
            <p class="text-xs font-mono text-${bc}-400">${currentDiscordUser.badge || '#---'} • ${(RANK_META[currentDiscordUser.rankKey]?.label || 'Detective').toUpperCase()}</p>
          </div>
        </div>
      </div>

      <!-- KPIs -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div class="bg-slate-950/80 p-4 rounded-xl border border-slate-800 text-center">
          <p class="text-2xl font-black font-gobold text-${bc}-400">${myCases.length}</p>
          <p class="text-[10px] font-conthrax text-slate-400 uppercase mt-1">Expedientes</p>
        </div>
        <div class="bg-slate-950/80 p-4 rounded-xl border border-slate-800 text-center">
          <p class="text-2xl font-black font-gobold text-red-400">${myReports.length}</p>
          <p class="text-[10px] font-conthrax text-slate-400 uppercase mt-1">Informes</p>
        </div>
        <div class="bg-slate-950/80 p-4 rounded-xl border border-slate-800 text-center">
          <p class="text-2xl font-black font-gobold text-blue-400">${teammates.length}</p>
          <p class="text-[10px] font-conthrax text-slate-400 uppercase mt-1">Compañeros</p>
        </div>
        <div class="bg-slate-950/80 p-4 rounded-xl border border-slate-800 text-center">
          <p class="text-2xl font-black font-gobold text-purple-400">${myCases.filter(c=>c.statusType==='active').length}</p>
          <p class="text-[10px] font-conthrax text-slate-400 uppercase mt-1">En Activo</p>
        </div>
      </div>

      <!-- Main Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <!-- Cases + Reports -->
        <div class="lg:col-span-2 space-y-5">
          <div class="bg-slate-950/80 rounded-xl p-5 border border-slate-800">
            <div class="flex items-center gap-2 mb-4 text-amber-400 font-conthrax text-xs font-bold">
              <i data-lucide="folder-search" class="w-4 h-4"></i>
              <span>EXPEDIENTES DE ${subdiv.code} (${myCases.length})</span>
            </div>
            ${myCases.length > 0 ? `
              <div class="space-y-2 max-h-56 overflow-y-auto custom-scroll pr-1">
                ${myCases.map(c => `
                  <div class="flex items-center justify-between gap-3 p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 hover:border-${bc}-500/30 transition-colors">
                    <div class="overflow-hidden">
                      <div class="flex items-center gap-1.5 mb-0.5">
                        <span class="text-[9px] font-mono font-bold text-amber-400">${c.id}</span>
                        <span class="text-[9px] px-1 py-0.5 rounded ${c.statusType==='active'?'bg-amber-500/20 text-amber-300':c.statusType==='warrant'?'bg-red-500/20 text-red-300':'bg-emerald-500/20 text-emerald-300'} font-mono">${c.status}</span>
                      </div>
                      <p class="text-xs font-bold text-white truncate font-conthrax">${c.title}</p>
                    </div>
                    <button onclick="openCaseModal('${c.id}')" class="px-2 py-1 rounded-lg bg-${bc}-500/10 hover:bg-${bc}-500 text-${bc}-400 hover:text-black font-conthrax text-[10px] font-bold transition-colors shrink-0 border border-${bc}-500/30">Ver</button>
                  </div>`).join('')}
              </div>` : `<p class="text-xs font-conthrax text-slate-500 text-center py-6">Sin expedientes activos en ${subdiv.code}.</p>`}
          </div>
          ${hasPermission('view_reports') ? `
          <div class="bg-slate-950/80 rounded-xl p-5 border border-slate-800">
            <div class="flex items-center gap-2 mb-4 text-red-400 font-conthrax text-xs font-bold">
              <i data-lucide="file-lock-2" class="w-4 h-4"></i>
              <span>INFORMES CLASIFICADOS (${myReports.length})</span>
            </div>
            ${myReports.length > 0 ? `
              <div class="space-y-2 max-h-44 overflow-y-auto custom-scroll pr-1">
                ${myReports.map(r => `
                  <div class="flex items-center justify-between gap-3 p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 hover:border-red-500/30 transition-colors">
                    <div class="overflow-hidden">
                      <span class="text-[9px] font-mono text-red-400 font-bold">${r.code||'INF-CONF'}</span>
                      <p class="text-xs font-bold text-white truncate font-conthrax">${r.title}</p>
                    </div>
                    <button onclick="viewConfidentialReport('${r.id}')" class="px-2 py-1 rounded-lg bg-red-500/10 hover:bg-red-600 text-red-400 hover:text-white font-conthrax text-[10px] font-bold transition-colors shrink-0 border border-red-500/30">Ver</button>
                  </div>`).join('')}
              </div>` : `<p class="text-xs font-conthrax text-slate-500 text-center py-4">Sin informes clasificados en ${subdiv.code}.</p>`}
          </div>` : ''}
        </div>

        <!-- Teammates + SOP -->
        <div class="space-y-5">
          <div class="bg-slate-950/80 rounded-xl p-5 border border-slate-800">
            <div class="flex items-center gap-2 mb-4 text-blue-400 font-conthrax text-xs font-bold">
              <i data-lucide="users" class="w-4 h-4"></i>
              <span>COMPAÑEROS EN ${subdiv.code}</span>
            </div>
            ${teammates.length > 0 ? `
              <div class="space-y-2 max-h-44 overflow-y-auto custom-scroll">
                ${teammates.map(t => `
                  <div class="flex items-center gap-2.5 p-2 rounded-lg bg-slate-900/50 border border-slate-800">
                    <img src="${t.avatar||'https://cdn.discordapp.com/embed/avatars/0.png'}" class="w-8 h-8 rounded-lg object-cover border border-slate-700 shrink-0">
                    <div class="overflow-hidden">
                      <span class="font-bold text-white text-xs block truncate font-conthrax">${t.icName}</span>
                      <span class="text-[10px] font-mono text-${bc}-400">${t.badge||'#---'}</span>
                    </div>
                  </div>`).join('')}
              </div>` : `<p class="text-xs font-conthrax text-slate-500 text-center py-4">Solo tú en esta subdivisión.</p>`}
          </div>
          <div class="bg-slate-950/80 rounded-xl p-5 border border-slate-800">
            <div class="flex items-center gap-2 mb-3 text-emerald-400 font-conthrax text-xs font-bold">
              <i data-lucide="clipboard-check" class="w-4 h-4"></i>
              <span>SOP // ${subdiv.code}</span>
            </div>
            <ul class="space-y-1.5">
              ${(subdiv.sopSteps||[]).map((s,i) => `
                <li class="flex items-start gap-2 font-conthrax text-[10px] text-slate-300">
                  <span class="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 text-[9px] border border-emerald-500/30">0${i+1}</span>
                  <span class="leading-relaxed">${s}</span>
                </li>`).join('')}
            </ul>
          </div>
        </div>
      </div>

      <!-- Bitácora personal -->
      <div class="bg-slate-950/80 rounded-xl p-5 border border-slate-800">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2 text-purple-400 font-conthrax text-xs font-bold">
            <i data-lucide="notebook-pen" class="w-4 h-4"></i>
            <span>BITÁCORA PERSONAL // SOLO VISIBLE PARA TI</span>
          </div>
          <button onclick="saveAgentDivisionNotes('${notesKey}')"
            class="px-3 py-1 rounded-lg bg-purple-500/10 hover:bg-purple-600 text-purple-400 hover:text-white font-conthrax text-[10px] font-bold transition-colors border border-purple-500/30 flex items-center gap-1">
            <i data-lucide="save" class="w-3 h-3"></i> Guardar
          </button>
        </div>
        <textarea id="agent-division-notes-area" rows="3"
          placeholder="Notas personales, observaciones de turno, pistas pendientes..."
          class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-purple-500 transition-colors custom-scroll resize-none"
        >${savedNotes}</textarea>
      </div>
    </div>
  `;

  lucide.createIcons();
}

// ─── CADENA DE MANDO DINÁMICA ────────────────────────────────────────────────
function renderMandoGrid() {
  const grid = document.getElementById('mando-officers-grid');
  if (!grid) return;

  const roster = getJefaturaRoster();
  // Show only active officers (not aspirante), sorted by rank level desc
  const officers = roster
    .filter(a => a.rank !== 'aspirante' && a.status === 'Activo')
    .sort((a, b) => {
      const la = RANK_META[a.rank]?.level || 0;
      const lb = RANK_META[b.rank]?.level || 0;
      return lb - la;
    })
    .slice(0, 8); // show max 8 in the grid

  if (officers.length === 0) {
    grid.innerHTML = `
      <div class="col-span-4 glass-panel rounded-xl p-10 border border-slate-800 text-center font-conthrax text-xs text-slate-500">
        <i data-lucide="users" class="w-10 h-10 mx-auto mb-3 opacity-20"></i>
        <p>No hay oficiales activos registrados en el Bureau.</p>
      </div>`;
    lucide.createIcons();
    return;
  }

  const rankColors = {
    capitan: 'amber', teniente: 'blue', det3: 'purple',
    det2: 'emerald', det1: 'slate', aspirante: 'slate'
  };

  grid.innerHTML = officers.map((agent, i) => {
    const rankMeta = RANK_META[agent.rank] || {};
    const color = rankColors[agent.rank] || 'slate';
    const borderClass = i === 0 ? `border-${color}-500/50` : 'border-slate-800';
    return `
      <div class="glass-panel rounded-xl p-5 border ${borderClass} text-center group hover:border-${color}-500/40 transition-all">
        <div class="w-20 h-20 rounded-full mx-auto mb-3 overflow-hidden border-2 border-${color}-400">
          <img src="${agent.avatar || 'https://cdn.discordapp.com/embed/avatars/0.png'}"
            alt="${agent.icName}" class="w-full h-full object-cover">
        </div>
        <span class="text-${color}-400 font-conthrax font-bold block text-[11px] uppercase">
          ${rankMeta.icon || '🔰'} ${(rankMeta.label || agent.rank).toUpperCase()} // ${agent.badge || '---'}
        </span>
        <h4 class="text-white text-base font-black font-gobold tracking-wide mt-1">${agent.icName}</h4>
        <p class="text-slate-400 text-[11px] mt-1 font-conthrax">${agent.division || 'Sin División Asignada'}</p>
        <div class="mt-3 pt-3 border-t border-slate-800 flex justify-between text-slate-500 font-conthrax text-[10px]">
          <span>Desde: ${agent.joinDate || '—'}</span>
          <span class="${agent.status === 'Activo' ? 'text-emerald-400' : 'text-amber-400'}">${agent.status}</span>
        </div>
      </div>`;
  }).join('');

  lucide.createIcons();
}

window.selectSubdivision = function(subdivId) {
  if (!SUBDIVISIONS_DATA[subdivId]) return;
  currentActiveSubdivision = subdivId;
  audioEngine.playKeyClick();

  // Actualizar estilos de los botones de pestañas
  document.querySelectorAll(".subdiv-nav-btn").forEach(btn => {
    btn.classList.remove("bg-red-600", "bg-amber-600", "bg-blue-600", "bg-emerald-600", "bg-purple-600", "bg-cyan-600", "text-white", "border-red-500", "border-amber-500");
    btn.classList.add("bg-slate-900", "text-slate-300", "border-slate-800");
  });

  const activeBtn = document.getElementById(`subdiv-btn-${subdivId}`);
  if (activeBtn) {
    activeBtn.classList.remove("bg-slate-900", "text-slate-300", "border-slate-800");
    activeBtn.classList.add("bg-amber-500", "text-black", "font-bold", "border-amber-400");
  }

  renderSubdivisionPane(subdivId);
};

function renderCurrentSubdivision() {
  renderSubdivisionPane(currentActiveSubdivision);
}

function renderSubdivisionPane(subdivId) {
  const container = document.getElementById("subdivision-active-pane");
  if (!container) return;

  const subdiv = SUBDIVISIONS_DATA[subdivId] || SUBDIVISIONS_DATA.rhd;

  // Filtrar agentes de la BD asignados a esta subdivisión
  const roster = (typeof getCachedRoster === 'function') ? getCachedRoster().map(rowToAgent) : [];
  const assignedAgents = roster.filter(a => {
    const div = (a.division || '').toLowerCase();
    const rank = (a.rank || '').toLowerCase();
    return div.includes(subdiv.code.toLowerCase()) || div.includes(subdiv.name.toLowerCase()) || (subdivId === 'rhd' && div.includes('homicidios')) || (subdivId === 'gnd' && div.includes('narc'));
  });

  // Filtrar casos de la BD asignados a esta subdivisión
  const allCases = typeof getActiveCasesList === 'function' ? getActiveCasesList() : [];
  const relatedCases = allCases.filter(c => {
    const div = (c.division || '').toLowerCase();
    const cat = (c.category || '').toLowerCase();
    if (subdivId === 'rhd') return div.includes('rhd') || cat.includes('homicide') || cat.includes('robbery');
    if (subdivId === 'gnd') return div.includes('gnd') || cat.includes('narcotics');
    if (subdivId === 'csi') return div.includes('csi') || div.includes('forense');
    if (subdivId === 'cid') return div.includes('cid') || cat.includes('fraud') || div.includes('ciber');
    if (subdivId === 'iad') return div.includes('iad') || cat.includes('internal');
    if (subdivId === 'ccd') return div.includes('ccd') || cat.includes('missing');
    return false;
  });

  container.innerHTML = `
    <!-- Top Header of the Subdivision Dossier -->
    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-amber-500/20 mb-8">
      <div class="flex items-start gap-4">
        <div class="w-16 h-16 rounded-2xl bg-amber-500/10 border-2 border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 shadow-lg">
          <i data-lucide="${subdiv.icon}" class="w-8 h-8"></i>
        </div>
        <div>
          <div class="flex items-center gap-2 mb-1 flex-wrap">
            <span class="px-2.5 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 font-conthrax text-[10px] font-bold">
              SUBDIVISIÓN OFICIAL // ${subdiv.code}
            </span>
            <span class="text-xs font-mono text-slate-400">ENLACE TÁCTICO: <strong class="text-white">${subdiv.channel}</strong></span>
          </div>
          <h3 class="text-2xl sm:text-3xl font-black font-gobold text-white tracking-wide">${subdiv.fullName}</h3>
          <p class="text-xs font-conthrax text-amber-400/90 italic mt-0.5">${subdiv.motto}</p>
        </div>
      </div>

      <div class="flex flex-wrap items-center gap-3">
        <div class="px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-right">
          <span class="text-[9px] font-conthrax text-slate-400 block">NIVEL AUTORIZACIÓN:</span>
          <span class="text-xs font-conthrax text-emerald-400 font-bold">${subdiv.clearance}</span>
        </div>
        <div class="px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-right">
          <span class="text-[9px] font-conthrax text-slate-400 block">DETECTIVES ACTIVOS:</span>
          <span class="text-xs font-conthrax text-amber-400 font-bold">${assignedAgents.length} Asignados</span>
        </div>
      </div>
    </div>

    <!-- Description & Mission -->
    <div class="mb-8 p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-300 text-xs font-conthrax leading-relaxed">
      ${subdiv.description}
    </div>

    <!-- Grid: SOP & Equipment -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      
      <!-- SOP Protocols -->
      <div class="bg-slate-950/80 rounded-xl p-5 border border-slate-800">
        <div class="flex items-center gap-2 mb-4 pb-2 border-b border-slate-800 text-amber-400 font-conthrax text-xs font-bold">
          <i data-lucide="clipboard-check" class="w-4 h-4"></i>
          <span>PROTOCOLO OPERATIVO ESTÁNDAR (SOP)</span>
        </div>
        <ul class="space-y-2.5 font-conthrax text-xs text-slate-300">
          ${subdiv.sopSteps.map((step, idx) => `
            <li class="flex items-start gap-2.5 bg-slate-900/50 p-2.5 rounded-lg border border-slate-800/60">
              <span class="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center shrink-0 text-[10px] border border-amber-500/30">0${idx+1}</span>
              <span class="leading-relaxed">${step}</span>
            </li>
          `).join('')}
        </ul>
      </div>

      <!-- Equipment & Resources -->
      <div class="bg-slate-950/80 rounded-xl p-5 border border-slate-800">
        <div class="flex items-center gap-2 mb-4 pb-2 border-b border-slate-800 text-emerald-400 font-conthrax text-xs font-bold">
          <i data-lucide="shield" class="w-4 h-4"></i>
          <span>EQUIPAMIENTO & RECURSOS ASIGNADOS</span>
        </div>
        <ul class="space-y-2.5 font-conthrax text-xs text-slate-300">
          ${subdiv.equipment.map(eq => `
            <li class="flex items-center gap-2.5 bg-slate-900/50 p-2.5 rounded-lg border border-slate-800/60">
              <i data-lucide="check-circle-2" class="w-4 h-4 text-emerald-400 shrink-0"></i>
              <span class="font-mono text-white">${eq}</span>
            </li>
          `).join('')}
        </ul>
      </div>

    </div>

    <!-- Personnel & Linked Cases Sections -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6 border-t border-slate-800">
      
      <!-- Assigned Personnel from DB -->
      <div>
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2 text-white font-conthrax text-xs font-bold">
            <i data-lucide="users" class="w-4 h-4 text-blue-400"></i>
            <span>PERSONAL ASIGNADO EN CENSO (${assignedAgents.length})</span>
          </div>
          <span class="text-[10px] font-mono text-slate-500">Actualizado en tiempo real</span>
        </div>

        ${assignedAgents.length > 0 ? `
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            ${assignedAgents.map(a => `
              <div class="glass-panel p-3 rounded-xl border border-slate-800 flex items-center gap-3">
                <img src="${a.avatar || 'https://cdn.discordapp.com/embed/avatars/0.png'}" alt="${a.icName}"
                  class="w-10 h-10 rounded-lg object-cover border border-slate-700">
                <div class="overflow-hidden">
                  <span class="font-bold text-white text-xs block truncate font-conthrax">${a.icName}</span>
                  <div class="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
                    <span class="text-amber-400">${a.badge || '#DIV'}</span>
                    <span>•</span>
                    <span class="capitalize text-slate-300">${a.rank}</span>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        ` : `
          <div class="p-6 rounded-xl bg-slate-950/60 border border-slate-800 text-center font-conthrax text-xs text-slate-400">
            <i data-lucide="user-x" class="w-8 h-8 mx-auto mb-2 text-slate-600"></i>
            <span>Sin detectives específicamente catalogados en esta rama. Jefatura puede asignarlos desde el panel de Personal.</span>
          </div>
        `}
      </div>

      <!-- Linked Cases from DB -->
      <div>
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2 text-white font-conthrax text-xs font-bold">
            <i data-lucide="folder-search" class="w-4 h-4 text-amber-400"></i>
            <span>EXPEDIENTES VINCULADOS (${relatedCases.length})</span>
          </div>
          <span class="text-[10px] font-mono text-slate-500">Archivo policial</span>
        </div>

        ${relatedCases.length > 0 ? `
          <div class="space-y-2.5 max-h-72 overflow-y-auto custom-scroll pr-1">
            ${relatedCases.map(c => `
              <div class="glass-panel p-3 rounded-xl border border-slate-800 flex items-center justify-between gap-3 hover:border-amber-500/40 transition-colors">
                <div class="overflow-hidden">
                  <div class="flex items-center gap-2 mb-0.5">
                    <span class="text-[9px] font-mono font-bold text-amber-400">${c.id}</span>
                    <span class="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-mono">${c.status}</span>
                  </div>
                  <h4 class="font-bold text-white text-xs truncate font-conthrax">${c.title}</h4>
                  <p class="text-[10px] text-slate-400 font-mono truncate">Det: ${c.leadDetective}</p>
                </div>
                <button onclick="openCaseModal('${c.id}')"
                  class="px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-black font-conthrax text-[10px] font-bold uppercase transition-colors shrink-0 flex items-center gap-1 border border-amber-500/30">
                  <i data-lucide="external-link" class="w-3 h-3"></i>
                  <span>Ver Caso</span>
                </button>
              </div>
            `).join('')}
          </div>
        ` : `
          <div class="p-6 rounded-xl bg-slate-950/60 border border-slate-800 text-center font-conthrax text-xs text-slate-400">
            <i data-lucide="folder" class="w-8 h-8 mx-auto mb-2 text-slate-600"></i>
            <span>No constan expedientes abiertos vinculados a esta subdivisión en el registro actual.</span>
          </div>
        `}
      </div>

    </div>
  `;

  lucide.createIcons();
}

// Function to link Most Wanted to the Tip Form
function reportWantedTarget(name, alias) {
  audioEngine.playAlertSound();
  const descField = document.getElementById("tip-description");
  const catSelect = document.getElementById("tip-category");
  const tipSection = document.getElementById("denuncias");

  if (catSelect) catSelect.value = "fugitivo";
  if (descField) {
    descField.value = `[AVISTAMIENTO DE FUGITIVO: ${name} (${alias})]\nUbicación exacta vista: \nHora del avistamiento: \nVestimenta y vehículos implicados: `;
    descField.focus();
  }

  if (tipSection) {
    tipSection.scrollIntoView({ behavior: 'smooth' });
  }

  showToast(`Formulario rellenado con datos de: ${name}. Ingrese los detalles de su avistamiento.`);
}

// --- ANONYMOUS CRIME TIP FORM ---
function setupTipForm() {
  const form = document.getElementById("anonymous-tip-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    audioEngine.playKeyClick();

    const category = document.getElementById("tip-category").value;
    const location = document.getElementById("tip-location").value;
    const desc = document.getElementById("tip-description").value;
    const priority = document.getElementById("tip-priority").value;
    const contact = document.getElementById("tip-contact").value || "ANÓNIMO PROTEGIDO";

    // Generate simulated tracking code
    const randomCode = "TIP-" + Math.floor(100000 + Math.random() * 900000);
    const dateStr = new Date().toLocaleString('es-ES');

    const tipData = {
      code: randomCode,
      category,
      location,
      desc,
      priority,
      contact,
      date: dateStr,
      status: "RECIBIDA // EN REVISIÓN POR ANALISTA FORENSE"
    };

    // Store in Supabase (fire-and-forget)
    dbInsertTip(tipData);

    // Show confirmation modal
    showTipReceiptModal(tipData);
    form.reset();
  });
}

function showTipReceiptModal(tip) {
  audioEngine.playAlertSound();
  const modal = document.getElementById("receipt-modal");
  const content = document.getElementById("receipt-modal-content");
  if (!modal || !content) return;

  content.innerHTML = `
    <div class="text-center mb-6">
      <div class="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-3 border border-emerald-500/40">
        <i data-lucide="shield-check" class="w-8 h-8"></i>
      </div>
      <span class="stamp-solved text-xs mb-2">REMISIÓN CONFIDENCIAL SEGURA</span>
      <h3 class="text-2xl font-black text-white font-gobold tracking-wide mt-2">Pista Recibida por la División</h3>
      <p class="text-slate-400 text-xs font-conthrax mt-1">Cifrado de extremo a extremo activo. Su identidad civil está blindada.</p>
    </div>

    <div class="bg-slate-950 p-5 rounded-xl border border-slate-800 font-conthrax text-xs space-y-3">
      <div class="flex items-center justify-between border-b border-slate-800 pb-2">
        <span class="text-slate-500">CÓDIGO DE SEGUIMIENTO:</span>
        <span class="text-amber-400 font-bold text-sm tracking-widest">${tip.code}</span>
      </div>
      <div class="flex items-center justify-between border-b border-slate-800 pb-2">
        <span class="text-slate-500">FECHA Y HORA:</span>
        <span class="text-slate-200">${tip.date}</span>
      </div>
      <div class="flex items-center justify-between border-b border-slate-800 pb-2">
        <span class="text-slate-500">CATEGORÍA:</span>
        <span class="text-slate-200 uppercase">${tip.category}</span>
      </div>
      <div class="flex items-center justify-between border-b border-slate-800 pb-2">
        <span class="text-slate-500">UBICACIÓN:</span>
        <span class="text-slate-200">${tip.location}</span>
      </div>
      <div>
        <span class="text-slate-500 block mb-1">ESTADO ACTUAL:</span>
        <span class="text-emerald-400 font-bold">${tip.status}</span>
      </div>
    </div>

    <p class="text-xs text-slate-400 italic text-center mt-4">
      Guarde su código de seguimiento. Los detectives de turno comenzarán la verificación de indicios inmediatamente.
    </p>

    <div class="mt-6">
      <button onclick="closeModal('receipt-modal')" class="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold font-mono text-xs uppercase tracking-wider rounded-lg transition-colors">
        Entendido y Cerrar
      </button>
    </div>
  `;

  modal.classList.remove("hidden");
  lucide.createIcons();
}

// --- INFORMES POLICIALES CONFIDENCIALES & NORMATIVA ENGINE ---
const DEFAULT_CONFIDENTIAL_REPORTS = [
  {
    id: "INF-CONF-2026-01",
    title: "Minuta de Intervención Telefónica // Red de Tráfico Kozlov",
    category: "vigilancia",
    status: "ORDEN JUDICIAL ACTIVA",
    statusType: "warrant",
    clearance: "NIVEL 3 (ALTO SECRETO)",
    leadDetective: "Det. III Marcus Cole (#404)",
    date: "02/NOV/2026",
    summary: "Se interceptaron 14 comunicaciones cifradas a través del repetidor sur de Cypress Flats. Los sospechosos hacen alusión a una entrega de 50 fusiles de asalto militares en los muelles de Terminal Island durante la madrugada del 05/NOV. Se ha fijado geolocalización pasiva sin que los investigados sospechen.\n\nCoordenadas trianguladas: Polígono Industrial 4, Nave 8B. Se recomienda apoyo encubierto de GND y grupo de asalto SWAT en reserva.",
    evidence: [
      "14 Archivos de audio WAV de llamadas encriptadas intervenidas",
      "Triangulación de antenas repetidoras en Cypress Flats y Terminal Island",
      "Fotografías de vigilancia de una furgoneta negra Speedo rondando el perímetro"
    ]
  },
  {
    id: "INF-CONF-2026-02",
    title: "Acta de Inspección Ocular y Balística // Homicidio Julian Vance",
    category: "allanamiento",
    status: "ELEVADO A FISCALÍA",
    statusType: "trial",
    clearance: "NIVEL 2 (CONFIDENCIAL)",
    leadDetective: "Det. II Elena Rostova (#512)",
    date: "01/NOV/2026",
    summary: "Peritaje balístico en Penthouse 3 de Eclipse Towers. El proyectil recuperado presenta estriado dextrógiro de 6 estrías, compatible con cañón suprimido de Glock 19 de uso táctico. Las huellas dactilares levantadas en el cristal exterior fueron cotejadas con la base AFIS arrojando coincidencia preliminar con Dante Moretti.\n\nLa cerradura no fue forzada. Se presume acceso mediante duplicado de tarjeta magnética provista por personal interno.",
    evidence: [
      "2 Casquillos 9x19mm Luger con marca de percutor rectilínea",
      "Informe forense de autopsia #C-904 (Ángulo de disparo descendente 15°)",
      "Copia de seguridad del circuito cerrado de televisión del ascensor privado"
    ]
  },
  {
    id: "INF-CONF-2026-03",
    title: "Solicitud de Orden de Allanamiento Táctico // Almacén 4B Puerto",
    category: "allanamiento",
    status: "ORDEN JUDICIAL ACTIVA",
    statusType: "warrant",
    clearance: "NIVEL 4 (SUPERVISIÓN)",
    leadDetective: "Tte. James Sterling (#201)",
    date: "31/OCT/2026",
    summary: "Solicitud formal elevada al Honorable Juez R. Harrison para la entrada y registro en el Almacén 4B de Puerto de Los Santos bajo modalidad 'No-Knock'. Existen sospechas fundadas de almacenamiento de explosivos C4 y armamento antiaéreo portátil destinado a carteles internacionales.\n\nPlazo de ejecución: 48 horas tras firma judicial. Se requiere presencia de perito CSI y negociador de rehenes.",
    evidence: [
      "Informe de confidente 'Garganta Profunda' validado con prueba poligráfica",
      "Vigilancia térmica aérea nocturna que revela presencia de 6 guardias armados",
      "Manifiesto de carga falsificado con origen en Vladivostok"
    ]
  },
  {
    id: "INF-CONF-2026-04",
    title: "Informe de Infiltración Encubierta // Compra Controlada GND",
    category: "vigilancia",
    status: "OPERACIÓN EN CURSO",
    statusType: "active",
    clearance: "NIVEL 3 (ALTO SECRETO)",
    leadDetective: "Det. III Marcus Cole (#404)",
    date: "28/OCT/2026",
    summary: "Agente encubierto bajo identidad 'Niko V.' ejecutó compra simulada de 5 paquetes de estupefacientes purificados y 2 submáquinas Micro SMG. La transacción fue grabada con microcámara de botón autorizada por el Teniente Sterling. Se preservan números de serie del dinero marcado para futuro allanamiento.",
    evidence: [
      "$45,000 en billetes marcados con tinta reactiva ultravioleta",
      "Grabación de video en alta definición de la transacción en taller de Strawberry",
      "Muestras de laboratorio químico confirmando pureza del 94.2%"
    ]
  },
  {
    id: "INF-CONF-2026-05",
    title: "Acta de Decomiso y Depósito Balístico #884 // Fábrica Murrieta",
    category: "decomiso",
    status: "SENTENCIADO",
    statusType: "solved",
    clearance: "NIVEL 2 (CONFIDENCIAL)",
    leadDetective: "Det. I Sarah Connor (#522)",
    date: "25/OCT/2026",
    summary: "Intervención de emergencia tras llamada ciudadana al 911 reportando disparos en fábrica textil abandonada en Murrieta Heights. Localización de arsenal oculto en doble fondo de hormigón. Armas precintadas con sellos CSI #0981 al #0988 y puestas a disposición de la sala de custodia judicial.",
    evidence: [
      "8 Rifles de asalto Carabina MK II sin número de serie visible",
      "1,400 Cartuchos calibre 5.56x45mm NATO en cajas metálicas selladas",
      "3 Chalecos antibalas de nivel balístico IV con blindaje cerámico"
    ]
  }
];

function getActiveConfidentialReports() {
  const cached = getCachedReports();
  if (cached.length > 0) return cached.map(rowToReport);
  // fallback: localStorage, then hardcoded defaults
  const custom = localStorage.getItem("dd_confidential_reports");
  if (custom) {
    try {
      const parsed = JSON.parse(custom);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch (e) {
      console.warn("Error parsing confidential reports:", e);
    }
  }
  return DEFAULT_CONFIDENTIAL_REPORTS;
}

function saveConfidentialReports(list) {
  try {
    localStorage.setItem("dd_confidential_reports", JSON.stringify(list));
  } catch (e) {}
}

function setupInformesHub() {
  const searchInput = document.getElementById("confidential-search-input");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const q = e.target.value.toLowerCase().trim();
      const all = getActiveConfidentialReports();
      if (!q) {
        renderConfidentialReports(all);
        return;
      }
      const filtered = all.filter(r => 
        r.id.toLowerCase().includes(q) ||
        r.title.toLowerCase().includes(q) ||
        r.summary.toLowerCase().includes(q) ||
        r.leadDetective.toLowerCase().includes(q)
      );
      renderConfidentialReports(filtered);
    });
  }
}

window.switchInformesTab = function(tabName) {
  audioEngine.playKeyClick();
  const tabs = ["informes", "normativa", "pistas"];
  tabs.forEach(t => {
    const btn = document.getElementById(`tab-btn-${t}`);
    const content = document.getElementById(`tab-content-${t}`);
    if (btn) btn.classList.toggle("active", t === tabName);
    if (content) content.classList.toggle("hidden", t !== tabName);
  });
  lucide.createIcons();
};

window.filterConfidentialReports = function(category) {
  audioEngine.playKeyClick();
  const allBtns = document.querySelectorAll(".conf-filter-btn");
  allBtns.forEach(b => {
    b.classList.remove("bg-amber-500", "text-black");
    b.classList.add("bg-slate-800", "text-slate-300");
  });

  if (event && event.target) {
    event.target.classList.add("bg-amber-500", "text-black");
    event.target.classList.remove("bg-slate-800", "text-slate-300");
  }

  const all = getActiveConfidentialReports();
  if (category === "all") {
    renderConfidentialReports(all);
  } else {
    renderConfidentialReports(all.filter(r => r.category === category));
  }
};

function renderConfidentialReports(reports) {
  const container = document.getElementById("confidential-reports-grid");
  const countSpan = document.getElementById("confidential-reports-count");
  if (countSpan) countSpan.textContent = reports.length;
  if (!container) return;

  if (reports.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-12 text-center text-slate-500 font-conthrax text-xs">
        <i data-lucide="folder-search" class="w-8 h-8 mx-auto mb-2 opacity-40"></i>
        No se encontraron informes confidenciales con ese criterio.
      </div>
    `;
    lucide.createIcons();
    return;
  }

  container.innerHTML = reports.map(r => {
    let badgeClass = "bg-amber-500/10 text-amber-400 border-amber-500/30";
    if (r.statusType === "warrant") badgeClass = "bg-red-500/10 text-red-400 border-red-500/30";
    if (r.statusType === "solved") badgeClass = "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
    if (r.statusType === "trial") badgeClass = "bg-purple-500/10 text-purple-400 border-purple-500/30";

    return `
      <div class="glass-panel p-5 rounded-xl border border-slate-800 hover:border-amber-500/40 transition-all group flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between gap-2 mb-2">
            <span class="text-[10px] font-conthrax text-red-400 font-bold">${r.id}</span>
            <span class="px-2 py-0.5 rounded text-[9px] font-conthrax font-bold border ${badgeClass}">
              ${r.status}
            </span>
          </div>

          <h4 class="text-white font-bold font-gobold text-base tracking-wide group-hover:text-amber-400 transition-colors mb-2">
            ${r.title}
          </h4>

          <p class="text-slate-400 font-mono text-xs line-clamp-3 leading-relaxed mb-4">
            ${r.summary}
          </p>
        </div>

        <div class="pt-3 border-t border-slate-800/80 space-y-3 font-conthrax text-[11px]">
          <div class="flex items-center justify-between text-slate-500">
            <span>Redactor: <strong class="text-slate-300 font-normal">${r.leadDetective}</strong></span>
            <span>${r.date}</span>
          </div>

          <button 
            onclick="openConfidentialReport('${r.id}')" 
            class="w-full py-2 rounded-lg bg-slate-900 hover:bg-amber-500 text-slate-300 hover:text-black font-bold uppercase transition-all border border-slate-700/60 hover:border-amber-500 flex items-center justify-center gap-1.5 text-[10px]"
          >
            <i data-lucide="eye" class="w-3.5 h-3.5"></i>
            <span>Ver Informe Completo</span>
          </button>
        </div>
      </div>
    `;
  }).join("");

  lucide.createIcons();
}

let currentViewingConfidentialReportId = null;

window.openConfidentialReport = function(reportId) {
  if (!hasPermission('view_reports') || !currentDiscordUser || currentDiscordUser.rankKey === 'aspirante') {
    showToast("⛔ Acceso denegado: este informe requiere credencial de Detective con rango activo.");
    audioEngine.playRadioBeep();
    return;
  }
  audioEngine.playKeyClick();
  const all = getActiveConfidentialReports();
  const report = all.find(r => r.id === reportId);
  if (!report) return;

  currentViewingConfidentialReportId = reportId;
  const modal = document.getElementById("confidential-report-modal");
  if (!modal) return;

  document.getElementById("view-conf-code").textContent = report.id;
  document.getElementById("view-conf-title").textContent = report.title;
  document.getElementById("view-conf-status").textContent = report.status;
  document.getElementById("view-conf-clearance").textContent = report.clearance;
  document.getElementById("view-conf-author").textContent = report.leadDetective;
  document.getElementById("view-conf-date").textContent = report.date;
  document.getElementById("view-conf-summary").textContent = report.summary;

  const editBtn = document.getElementById("view-conf-edit-btn");
  const deleteBtn = document.getElementById("view-conf-delete-btn");
  if (editBtn) editBtn.classList.toggle("hidden", !hasPermission('edit_reports'));
  if (deleteBtn) deleteBtn.classList.toggle("hidden", !hasPermission('delete_reports'));

  const evidenceContainer = document.getElementById("view-conf-evidence");
  if (evidenceContainer) {
    if (report.evidence && report.evidence.length > 0) {
      evidenceContainer.innerHTML = report.evidence.map(e => `
        <div class="p-2 rounded bg-slate-900/80 border border-slate-800 flex items-center gap-2 text-slate-300">
          <i data-lucide="check-circle" class="w-3.5 h-3.5 text-amber-400 shrink-0"></i>
          <span>${e}</span>
        </div>
      `).join("");
    } else {
      evidenceContainer.innerHTML = `<span class="text-slate-500 italic">No se adjuntaron anexos materiales.</span>`;
    }
  }

  modal.classList.remove("hidden");
  lucide.createIcons();
};

window.openNewConfidentialReportModal = function() {
  if (!hasPermission('create_reports')) {
    showToast("🔒 No ostentas permiso para redactar informes clasificados.");
    audioEngine.playRadioBeep();
    return;
  }
  audioEngine.playKeyClick();
  const modal = document.getElementById("new-confidential-report-modal");
  if (modal) {
    // Reset to create mode
    const editIdInput = document.getElementById("edit-conf-id");
    if (editIdInput) editIdInput.value = "";
    document.getElementById("new-conf-title").value = "";
    document.getElementById("new-conf-summary").value = "";
    document.getElementById("new-conf-evidence").value = "";
    const titleHeader = document.querySelector("#new-confidential-report-modal h3");
    if (titleHeader) titleHeader.textContent = "REDACTAR INFORME CLASIFICADO";

    modal.classList.remove("hidden");
    lucide.createIcons();
  }
};

window.openEditConfidentialReportModal = function() {
  if (!hasPermission('edit_reports')) {
    showToast("⛔ No tienes permiso para modificar informes clasificados.");
    audioEngine.playRadioBeep();
    return;
  }
  if (!currentViewingConfidentialReportId) return;
  const all = getActiveConfidentialReports();
  const report = all.find(r => r.id === currentViewingConfidentialReportId);
  if (!report) return;

  closeModal("confidential-report-modal");
  const modal = document.getElementById("new-confidential-report-modal");
  if (!modal) return;

  const editIdInput = document.getElementById("edit-conf-id");
  if (editIdInput) editIdInput.value = report.id;

  document.getElementById("new-conf-title").value = report.title || "";
  document.getElementById("new-conf-category").value = report.category || "vigilancia";
  document.getElementById("new-conf-summary").value = report.summary || "";
  document.getElementById("new-conf-evidence").value = (report.evidence || []).join("\n");

  const titleHeader = document.querySelector("#new-confidential-report-modal h3");
  if (titleHeader) titleHeader.textContent = `MODIFICAR INFORME: ${report.id}`;

  modal.classList.remove("hidden");
  lucide.createIcons();
};

window.deleteConfidentialReport = function() {
  if (!hasPermission('delete_reports')) {
    showToast("⛔ No ostentas permiso para eliminar informes clasificados.");
    audioEngine.playRadioBeep();
    return;
  }
  if (!currentViewingConfidentialReportId) return;
  if (!confirm(`¿Está seguro de destruir y eliminar permanentemente el informe ${currentViewingConfidentialReportId}?`)) return;

  dbDeleteReport(currentViewingConfidentialReportId);
  const reports = getActiveConfidentialReports().filter(r => r.id !== currentViewingConfidentialReportId);
  saveConfidentialReports(reports);

  addAuditLog(
    "INFORME ELIMINADO",
    currentViewingConfidentialReportId,
    "",
    "Informe clasificado destruido del archivo",
    currentDiscordUser ? currentDiscordUser.username : "Sistema"
  );

  audioEngine.playRadioBeep();
  closeModal("confidential-report-modal");
  renderConfidentialReports(getActiveConfidentialReports());
  showToast(`🗑️ Informe clasificado ${currentViewingConfidentialReportId} eliminado del archivo.`);
};

window.saveNewConfidentialReport = function(event) {
  if (event) event.preventDefault();
  const editId = document.getElementById("edit-conf-id")?.value.trim();
  const reports = getActiveConfidentialReports();
  const existingReport = editId ? reports.find(r => r.id === editId) : null;

  if (editId) {
    const isOwner = Boolean(currentDiscordUser && existingReport && (existingReport.authorId === currentDiscordUser.id || existingReport.author_id === currentDiscordUser.id));
    if (!hasPermission('edit_reports') && !isOwner) {
      showToast("⛔ No ostentas permiso para modificar informes clasificados de otros agentes.");
      return;
    }
  } else {
    if (!hasPermission('create_reports') && !currentDiscordUser) {
      showToast("⛔ No ostentas permiso para redactar informes clasificados.");
      return;
    }
  }

  const title = document.getElementById("new-conf-title")?.value.trim();
  const category = document.getElementById("new-conf-category")?.value || "vigilancia";
  const summary = document.getElementById("new-conf-summary")?.value.trim();
  const evidenceRaw = document.getElementById("new-conf-evidence")?.value.trim();

  if (!title || !summary) {
    showToast("⚠️ Ingrese al menos título y sumario de los hechos.");
    return;
  }

  const evidence = evidenceRaw ? evidenceRaw.split("\n").map(l => l.trim()).filter(Boolean) : [];

  if (editId) {
    const existingIdx = reports.findIndex(r => r.id === editId);
    if (existingIdx >= 0) {
      reports[existingIdx] = {
        ...reports[existingIdx],
        title,
        category,
        summary,
        evidence
      };
      dbUpsertReport(reports[existingIdx]);
      addAuditLog("INFORME MODIFICADO", editId, title, "Informe clasificado modificado y actualizado", currentDiscordUser ? currentDiscordUser.username : "Sistema");
      showToast(`✅ Informe confidencial ${editId} actualizado con éxito.`);
    }
  } else {
    const newId = "INF-CONF-2026-" + String(reports.length + 1).padStart(2, '0');
    const newReport = {
      id: newId,
      title,
      category,
      status: "REGISTRADO // EN REVISIÓN",
      statusType: "active",
      clearance: currentDiscordUser ? currentDiscordUser.clearance : "NIVEL 2 (CONFIDENCIAL)",
      leadDetective: currentDiscordUser ? `${currentDiscordUser.username} (${currentDiscordUser.badge})` : "Det. Asignado",
      authorId: currentDiscordUser ? currentDiscordUser.id : null,
      date: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase(),
      summary,
      evidence
    };
    reports.unshift(newReport);
    dbUpsertReport(newReport);
    addAuditLog("INFORME CREADO", newId, title, "Nuevo informe clasificado archivado", currentDiscordUser ? currentDiscordUser.username : "Sistema");
    showToast(`✅ Informe confidencial ${newId} archivado con éxito.`);
  }

  saveConfidentialReports(reports);
  audioEngine.playAlertSound();
  closeModal("new-confidential-report-modal");
  renderConfidentialReports(getActiveConfidentialReports());
  if (typeof renderPerfilMisInformes === 'function') renderPerfilMisInformes();
};

function renderAuthorizedTipsInbox() {
  const container = document.getElementById("authorized-tips-inbox");
  if (!container) return;

  const tips = getCachedTips().map(rowToTip);

  if (tips.length === 0) {
    container.innerHTML = `
      <div class="text-slate-500 font-conthrax text-xs text-center py-8">
        <i data-lucide="inbox" class="w-8 h-8 mx-auto mb-2 opacity-40"></i>
        No hay denuncias anónimas pendientes de revisión en este momento.
      </div>
    `;
    lucide.createIcons();
    return;
  }

  container.innerHTML = tips.map(t => `
    <div class="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono space-y-2">
      <div class="flex items-center justify-between">
        <span class="text-red-400 font-conthrax font-bold">${t.code}</span>
        <div class="flex items-center gap-2">
          <span class="text-slate-400">${t.date}</span>
          ${hasPermission('delete_tips') ? `
            <button onclick="deleteTip('${t.code}')" class="p-1 rounded hover:bg-red-950/60 text-slate-500 hover:text-red-400 transition-colors" title="Descartar / Eliminar Pista">
              <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
            </button>
          ` : ''}
        </div>
      </div>
      <p class="text-white font-semibold text-sm">${t.location} <span class="text-amber-400 font-conthrax text-xs">(${t.category.toUpperCase()})</span></p>
      <p class="text-slate-300 bg-slate-900 p-3 rounded-lg leading-relaxed">${t.desc}</p>
      <div class="flex items-center justify-between text-[11px] text-slate-400 pt-1">
        <span>Prioridad: <strong class="text-red-400 uppercase">${t.priority}</strong></span>
        <span>Contacto: ${t.contact || 'ANÓNIMO ABSOLUTO'}</span>
      </div>
    </div>
  `).join("");

  lucide.createIcons();
}

window.deleteTip = function(tipCode) {
  if (!hasPermission('delete_tips')) {
    showToast("⛔ No ostentas permiso para eliminar pistas ciudadanas.");
    audioEngine.playRadioBeep();
    return;
  }
  if (!confirm(`¿Eliminar o descartar la pista ${tipCode}?`)) return;

  dbDeleteTip(tipCode);
  audioEngine.playRadioBeep();
  renderAuthorizedTipsInbox();
  showToast(`🗑️ Pista ${tipCode} descartada y eliminada.`);
};

// --- AUDIO UI TOGGLE ---
function setupAudioControls() {
  const toggleBtns = document.querySelectorAll(".audio-toggle-btn, #audio-toggle-btn");
  const audioStatusTexts = document.querySelectorAll(".audio-status-text, #audio-status-text");

  toggleBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const isEnabled = audioEngine.toggle();
      audioStatusTexts.forEach(txt => {
        txt.textContent = isEnabled ? "AUDIO ON" : "AUDIO MUTED";
      });
      toggleBtns.forEach(b => {
        b.classList.toggle("text-amber-400", isEnabled);
        b.classList.toggle("text-slate-500", !isEnabled);
      });

      if (isEnabled) audioEngine.playRadioBeep();
      showToast(isEnabled ? "Efectos de radio y terminal activados." : "Efectos de audio silenciados.");
    });
  });
}

// --- MODAL UTILITIES ---
function setupInteractiveModals() {
  window.closeModal = function (modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add("hidden");
  };

  // Close modals on clicking outside or Esc key
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      document.querySelectorAll(".rp-modal").forEach(m => m.classList.add("hidden"));
    }
  });
}

// --- TOAST NOTIFICATION ---
function showToast(message) {
  let toastContainer = document.getElementById("toast-container");
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.id = "toast-container";
    toastContainer.className = "fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none";
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement("div");
  toast.className = "glass-panel-gold px-4 py-3 rounded-lg border border-amber-500/40 text-xs font-mono text-white shadow-2xl flex items-center gap-3 animate-fade-in pointer-events-auto";
  toast.innerHTML = `
    <i data-lucide="radio" class="w-4 h-4 text-amber-400 animate-pulse"></i>
    <span>${message}</span>
  `;

  toastContainer.appendChild(toast);
  lucide.createIcons();

  setTimeout(() => {
    toast.style.transition = "opacity 0.4s ease, transform 0.4s ease";
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
    setTimeout(() => toast.remove(), 400);
  }, 4000);
}


// =============================================================================
// --- JEFATURA DE DIVISIÓN // RANGOS DINÁMICOS & MATRIZ DE PERMISOS ---
// =============================================================================

// --- DEFAULT RANKS DEFINITION (con matriz completa de 15 permisos) ---
const DEFAULT_RANKS = {
  capitan: {
    id: "capitan",
    label: "Capitán de División",
    level: 5,
    clearance: "NIVEL 5 // COMANDO SUPREMO",
    cssClass: "rank-badge-capitan",
    icon: "👑",
    color: "amber",
    isSystem: true,
    permissions: {
      view_cases: true, create_cases: true, edit_cases: true, delete_cases: true,
      view_reports: true, create_reports: true, edit_reports: true, delete_reports: true,
      view_tips: true, delete_tips: true,
      manage_roster: true, change_ranks: true, kick_agents: true, manage_ranks: true, manage_audit: true
    }
  },
  teniente: {
    id: "teniente",
    label: "Teniente de División",
    level: 4,
    clearance: "NIVEL 4 // SUPERVISIÓN OPERATIVA",
    cssClass: "rank-badge-teniente",
    icon: "⭐",
    color: "blue",
    isSystem: false,
    permissions: {
      view_cases: true, create_cases: true, edit_cases: true, delete_cases: true,
      view_reports: true, create_reports: true, edit_reports: true, delete_reports: false,
      view_tips: true, delete_tips: true,
      manage_roster: true, change_ranks: true, kick_agents: true, manage_ranks: false, manage_audit: true
    }
  },
  sgt: {
    id: "sgt",
    label: "Sargento de Detectives",
    level: 3.5,
    clearance: "NIVEL 3.5 // MANDO DE TURNO",
    cssClass: "rank-badge-sgt",
    icon: "🔷",
    color: "cyan",
    isSystem: false,
    permissions: {
      view_cases: true, create_cases: true, edit_cases: true, delete_cases: false,
      view_reports: true, create_reports: true, edit_reports: true, delete_reports: false,
      view_tips: true, delete_tips: false,
      manage_roster: true, change_ranks: false, kick_agents: false, manage_ranks: false, manage_audit: false
    }
  },
  det3: {
    id: "det3",
    label: "Detective III",
    level: 3,
    clearance: "NIVEL 3 // ALTO SECRETO",
    cssClass: "rank-badge-det3",
    icon: "🔵",
    color: "purple",
    isSystem: false,
    permissions: {
      view_cases: true, create_cases: true, edit_cases: true, delete_cases: false,
      view_reports: true, create_reports: true, edit_reports: true, delete_reports: false,
      view_tips: true, delete_tips: false,
      manage_roster: false, change_ranks: false, kick_agents: false, manage_ranks: false, manage_audit: false
    }
  },
  det2: {
    id: "det2",
    label: "Detective II",
    level: 2,
    clearance: "NIVEL 2 // CONFIDENCIAL",
    cssClass: "rank-badge-det2",
    icon: "🟢",
    color: "emerald",
    isSystem: false,
    permissions: {
      view_cases: true, create_cases: true, edit_cases: true, delete_cases: false,
      view_reports: true, create_reports: true, edit_reports: false, delete_reports: false,
      view_tips: true, delete_tips: false,
      manage_roster: false, change_ranks: false, kick_agents: false, manage_ranks: false, manage_audit: false
    }
  },
  det1: {
    id: "det1",
    label: "Detective I",
    level: 1,
    clearance: "NIVEL 1 // RESTRINGIDO",
    cssClass: "rank-badge-det1",
    icon: "⬜",
    color: "slate",
    isSystem: false,
    permissions: {
      view_cases: true, create_cases: true, edit_cases: false, delete_cases: false,
      view_reports: true, create_reports: true, edit_reports: false, delete_reports: false,
      view_tips: false, delete_tips: false,
      manage_roster: false, change_ranks: false, kick_agents: false, manage_ranks: false, manage_audit: false
    }
  },
  aspirante: {
    id: "aspirante",
    label: "Aspirante / Sin Asignar",
    level: 0,
    clearance: "NIVEL 0 // SIN ACCESO",
    cssClass: "rank-badge-aspirante",
    icon: "🔴",
    color: "red",
    isSystem: true,
    permissions: {
      view_cases: true, create_cases: false, edit_cases: false, delete_cases: false,
      view_reports: false, create_reports: false, edit_reports: false, delete_reports: false,
      view_tips: false, delete_tips: false,
      manage_roster: false, change_ranks: false, kick_agents: false, manage_ranks: false, manage_audit: false
    }
  }
};

function getDynamicRanks() {
  const cached = (typeof getCachedRanks === 'function') ? getCachedRanks() : [];
  if (cached && cached.length > 0) {
    const map = {};
    cached.forEach(row => {
      const rank = (typeof rowToRank === 'function') ? rowToRank(row) : row;
      map[rank.id] = {
        ...rank,
        cssClass: rank.badgeClass || rank.badge_class || 'rank-badge-det1'
      };
    });
    return map;
  }
  const local = localStorage.getItem("dd_custom_ranks");
  if (local) {
    try {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const map = {};
        parsed.forEach(r => { map[r.id] = { ...r, cssClass: r.badgeClass || r.cssClass || 'rank-badge-det1' }; });
        return map;
      }
    } catch(e) {}
  }
  return JSON.parse(JSON.stringify(DEFAULT_RANKS));
}

function getRankList() {
  const map = getDynamicRanks();
  return Object.values(map).sort((a, b) => Number(b.level) - Number(a.level));
}

// Proxy dinámico para compatibilidad total con cualquier RANK_META[clave]
const RANK_META = new Proxy({}, {
  get(target, prop) {
    const ranks = getDynamicRanks();
    return ranks[prop] || ranks["aspirante"] || DEFAULT_RANKS["aspirante"];
  },
  has(target, prop) {
    return prop in getDynamicRanks();
  },
  ownKeys(target) {
    return Object.keys(getDynamicRanks());
  },
  getOwnPropertyDescriptor(target, prop) {
    return {
      value: getDynamicRanks()[prop],
      enumerable: true,
      configurable: true
    };
  }
});

// Verificador universal de permisos granulares
function hasPermission(permKey) {
  if (!currentDiscordUser) return false;
  // Capitán de División o Nivel 5 ostenta permiso total absoluto
  if (currentDiscordUser.rankKey === 'capitan' || (currentDiscordUser.rankLevel !== undefined && currentDiscordUser.rankLevel >= 5)) {
    return true;
  }
  const ranks = getDynamicRanks();
  const rank = ranks[currentDiscordUser.rankKey];
  if (!rank || !rank.permissions) return false;
  return Boolean(rank.permissions[permKey]);
}

function populateRankSelect(selectId, selectedRankId) {
  const sel = document.getElementById(selectId);
  if (!sel) return;
  const ranks = getRankList();
  sel.innerHTML = ranks.map(r => `
    <option value="${r.id}" ${r.id === selectedRankId ? 'selected' : ''}>
      ${r.icon || '🛡️'} ${r.label} (Nivel ${r.level})
    </option>
  `).join("");
}

// Status CSS helper
function getStatusBadge(status) {
  const map = {
    "Activo":      "status-badge-activo",
    "Pendiente":   "status-badge-pendiente",
    "Suspendido":  "status-badge-suspendido",
    "Expulsado":   "status-badge-expulsado"
  };
  return map[status] || "status-badge-pendiente";
}

// --- ROSTER STORAGE ---
const DEFAULT_ROSTER = [
  {
    discordId:   "760159743616090164",
    discordTag:  "Fundador#0001",
    icName:      "Cap. Fundador",
    badge:       "#001-DIV",
    rank:        "capitan",
    division:    "Mando Supremo // Bureau Executive",
    status:      "Activo",
    awards:      ["valor", "servicio", "merito"],
    notes:       "Fundador y Comandante Supremo de la Detective Division.",
    avatar:      "https://cdn.discordapp.com/embed/avatars/0.png",
    joinDate:    new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()
  }
];

function getJefaturaRoster() {
  const cached = getCachedRoster();
  if (cached.length > 0) return cached.map(rowToAgent);
  // Fallback: localStorage, then defaults
  try {
    const saved = localStorage.getItem("dd_jefatura_roster");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) { console.warn("Error parsing roster:", e); }
  return JSON.parse(JSON.stringify(DEFAULT_ROSTER));
}

function saveJefaturaRoster(list) {
  try {
    localStorage.setItem("dd_jefatura_roster", JSON.stringify(list));
  } catch (e) {}
}

// --- AUDIT LOG STORAGE ---
function getAuditLogs() {
  const cached = getCachedAuditLogs();
  if (cached.length > 0) return cached.map(rowToAuditLog);
  // Fallback: localStorage
  try {
    const saved = localStorage.getItem("dd_audit_logs");
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return [];
}

function saveAuditLogs(logs) {
  localStorage.setItem("dd_audit_logs", JSON.stringify(logs));
}

function addAuditLog(action, agentName, discordTag, detail, commander) {
  // Async fire-and-forget — updates CACHE and DB
  dbInsertAuditLog({
    action,
    agentName,
    discordTag,
    detail,
    commander: commander || (currentDiscordUser ? currentDiscordUser.username : "Sistema")
  });
}

// --- KPI & UI UPDATER ---
function updateJefaturaUI() {
  const canAccessJefatura = hasPermission('manage_roster') || hasPermission('manage_ranks') || hasPermission('manage_audit') || (currentDiscordUser && currentDiscordUser.rankLevel >= 4);
  const deniedView = document.getElementById("jefatura-denied-view");
  const authorizedView = document.getElementById("jefatura-authorized-view");

  if (!deniedView || !authorizedView) return;

  if (canAccessJefatura) {
    deniedView.classList.add("hidden");
    authorizedView.classList.remove("hidden");

    // Commander Ribbon
    const cmdAvatar = document.getElementById("jefatura-commander-avatar");
    const cmdName   = document.getElementById("jefatura-commander-name");
    const cmdBadge  = document.getElementById("jefatura-commander-badge");
    const cmdRole   = document.getElementById("jefatura-commander-role");

    if (cmdAvatar) cmdAvatar.src = currentDiscordUser.avatar || "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80";
    if (cmdName)   cmdName.textContent   = currentDiscordUser.username;
    if (cmdBadge)  cmdBadge.textContent  = currentDiscordUser.badge;
    if (cmdRole)   cmdRole.textContent   = currentDiscordUser.role.toUpperCase();

    // Render KPIs and roster
    renderJefaturaKPIs();
    renderJefaturaRoster(getJefaturaRoster());
    renderAuditLogs();
    renderDynamicRanks();
    renderAgentDivisionPanel();
  } else {
    deniedView.classList.remove("hidden");
    authorizedView.classList.add("hidden");

    // Show "Reclamar Mando" button only if user is logged in
    const claimBtn = document.getElementById("jefatura-claim-mando-btn");
    if (claimBtn) {
      claimBtn.style.display = currentDiscordUser ? "flex" : "none";
    }
    // Still show Mi División panel even without high-command access
    renderAgentDivisionPanel();
    // Actualizar panel Mi Subdivisión y Mando
    renderSubdivisionPrivatePanel();
    renderMandoGrid();
  }
}

function renderJefaturaKPIs() {
  const roster = getJefaturaRoster();
  const total   = roster.length;
  const activos = roster.filter(a => a.status === "Activo" && a.rank !== "aspirante").length;
  const pending = roster.filter(a => a.status === "Pendiente" || a.rank === "aspirante").length;
  const suspended = roster.filter(a => a.status === "Suspendido" || a.status === "Expulsado").length;

  const el = (id, v) => { const e = document.getElementById(id); if (e) e.textContent = v; };
  el("kpi-total-roster",       total);
  el("kpi-active-detectives",  activos);
  el("kpi-pending-aspirants",  pending);
  el("kpi-suspended-count",    suspended);
  el("filter-pending-count",   pending);
}

// --- JEFATURA TABS ---
window.switchJefaturaTab = function(tabName) {
  audioEngine.playKeyClick();
  const tabs = ["censo", "audit", "escalafon"];
  tabs.forEach(t => {
    const btn     = document.getElementById(`tab-btn-jefatura-${t}`);
    const content = document.getElementById(`tab-content-jefatura-${t}`);
    if (btn)     btn.classList.toggle("active", t === tabName);
    if (content) content.classList.toggle("hidden", t !== tabName);
  });
  if (tabName === "audit") renderAuditLogs();
  if (tabName === "escalafon") renderDynamicRanks();
  lucide.createIcons();
};

// --- DYNAMIC RANKS ENGINE (ESCALAFÓN & MATRIZ DE PERMISOS) ---
function renderDynamicRanks() {
  const container = document.getElementById("jefatura-ranks-grid");
  if (!container) return;

  const ranks = getRankList();
  const roster = getJefaturaRoster();

  const permLabels = {
    view_cases: "Ver Casos",
    create_cases: "Abrir Casos",
    edit_cases: "Modif. Casos",
    delete_cases: "Borrar Casos",
    view_reports: "Ver Informes",
    create_reports: "Redactar Inf.",
    edit_reports: "Modif. Inf.",
    delete_reports: "Borrar Inf.",
    view_tips: "Ver Pistas",
    delete_tips: "Borrar Pistas",
    manage_roster: "Censo",
    change_ranks: "Ascensos",
    kick_agents: "Expulsar",
    manage_ranks: "Matriz Rangos",
    manage_audit: "Auditoría"
  };

  const canManageRanks = hasPermission('manage_ranks');

  container.innerHTML = ranks.map(rank => {
    const officersCount = roster.filter(a => a.rank === rank.id).length;
    const perms = rank.permissions || {};
    const activePermKeys = Object.keys(perms).filter(k => perms[k] === true);

    const permBadges = activePermKeys.map(k => {
      const isDangerous = k.includes('delete') || k === 'kick_agents';
      const isHigh = k.startsWith('manage_') || k === 'change_ranks';
      let pillClass = "bg-slate-800 text-slate-300 border-slate-700";
      if (isDangerous) pillClass = "bg-red-950/40 text-red-300 border-red-800/40";
      else if (isHigh) pillClass = "bg-amber-500/10 text-amber-300 border-amber-500/30";
      else if (k.startsWith('create') || k.startsWith('edit')) pillClass = "bg-blue-950/40 text-blue-300 border-blue-800/40";

      return `<span class="px-1.5 py-0.5 rounded text-[9px] font-mono border ${pillClass}">${permLabels[k] || k}</span>`;
    }).join("");

    return `
      <div class="glass-panel p-5 rounded-xl border border-slate-800 hover:border-amber-500/40 transition-all group flex flex-col justify-between gap-4">
        <div>
          <!-- Header -->
          <div class="flex items-start justify-between gap-2 mb-2">
            <div class="flex items-center gap-2.5">
              <span class="text-2xl">${rank.icon || '🛡️'}</span>
              <div>
                <h4 class="text-base font-black font-gobold text-white tracking-wide">${rank.label}</h4>
                <span class="text-[10px] font-mono text-slate-400">ID: <code class="text-amber-400">${rank.id}</code></span>
              </div>
            </div>
            <span class="px-2 py-0.5 rounded ${rank.badgeClass || rank.cssClass || 'rank-badge-det1'} font-conthrax text-[10px] font-bold">
              NVL ${rank.level}
            </span>
          </div>

          <div class="space-y-1 my-2.5 font-conthrax text-[10px]">
            <p class="text-slate-400 truncate"><span class="text-slate-500">Acreditación:</span> ${rank.clearance || 'NIVEL 1'}</p>
            <p class="text-slate-400"><span class="text-slate-500">Agentes Asignados:</span> <strong class="text-white">${officersCount}</strong> oficial(es)</p>
          </div>

          <!-- Permissions Cloud -->
          <div class="pt-2 border-t border-slate-800/70">
            <span class="text-[9px] text-slate-500 uppercase tracking-wider font-conthrax block mb-1.5">
              Permisos Habilitados (${activePermKeys.length}/15):
            </span>
            <div class="flex flex-wrap gap-1">
              ${permBadges || '<span class="text-[10px] text-slate-600 italic font-mono">Sin permisos especiales asignados</span>'}
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 font-conthrax text-[10px]">
          <span class="text-slate-500">${rank.isSystem ? '🔒 Rango del Sistema' : '⚙️ Rango Personalizado'}</span>
          <div class="flex items-center gap-1.5">
            ${canManageRanks ? `
              <button 
                onclick="openRankEditor('${rank.id}')" 
                class="px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/30 text-amber-300 hover:text-amber-200 border border-amber-500/30 transition-all font-bold uppercase flex items-center gap-1"
                title="Editar Rango y Matriz de Permisos"
              >
                <i data-lucide="sliders" class="w-3 h-3"></i>
                Permisos
              </button>
            ` : ''}
            ${(!rank.isSystem && canManageRanks) ? `
              <button 
                onclick="deleteRank('${rank.id}', '${rank.label.replace(/'/g, "\\'")}', ${officersCount})" 
                class="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-800/40 transition-all"
                title="Eliminar Rango Definitivamente"
              >
                <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
              </button>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  }).join("");

  lucide.createIcons();
}

window.openRankEditor = function(rankId = null) {
  if (!hasPermission('manage_ranks')) {
    showToast("⛔ Solo el Mando con permiso de Gestión de Rangos puede configurar rangos.");
    return;
  }
  audioEngine.playKeyClick();
  const modal = document.getElementById("rank-editor-modal");
  if (!modal) return;

  const ranks = getDynamicRanks();
  const isNew = !rankId || !ranks[rankId];
  const rank = !isNew ? ranks[rankId] : {
    id: "",
    label: "",
    level: 1,
    clearance: "NIVEL 1 // RESTRINGIDO",
    icon: "🛡️",
    badgeClass: "rank-badge-det1",
    isSystem: false,
    permissions: {
      view_cases: true, create_cases: true, edit_cases: false, delete_cases: false,
      view_reports: true, create_reports: true, edit_reports: false, delete_reports: false,
      view_tips: false, delete_tips: false,
      manage_roster: false, change_ranks: false, kick_agents: false, manage_ranks: false, manage_audit: false
    }
  };

  document.getElementById("rank-edit-is-new").value = isNew ? "true" : "false";
  document.getElementById("rank-edit-is-system").value = rank.isSystem ? "true" : "false";

  const idField = document.getElementById("rank-edit-id");
  idField.value = rank.id;
  idField.disabled = !isNew; // Slug cannot be changed once created

  document.getElementById("rank-edit-label").value = rank.label;
  document.getElementById("rank-edit-level").value = rank.level;
  document.getElementById("rank-edit-icon").value = rank.icon || "🛡️";
  document.getElementById("rank-edit-clearance").value = rank.clearance || "";
  document.getElementById("rank-edit-badgeclass").value = rank.badgeClass || rank.cssClass || "rank-badge-det1";

  const sysBadge = document.getElementById("rank-editor-system-badge");
  const modalTitle = document.getElementById("rank-editor-modal-title");
  const headerIcon = document.getElementById("rank-editor-header-icon");
  const deleteBtn = document.getElementById("rank-editor-delete-btn");

  if (sysBadge) sysBadge.classList.toggle("hidden", !rank.isSystem);
  if (modalTitle) modalTitle.textContent = isNew ? "CREAR NUEVO RANGO POLICIAL" : `CONFIGURAR RANGO: ${rank.label.toUpperCase()}`;
  if (headerIcon) headerIcon.textContent = rank.icon || "🛡️";
  if (deleteBtn) deleteBtn.classList.toggle("hidden", rank.isSystem || isNew);

  const permKeys = [
    "view_cases", "create_cases", "edit_cases", "delete_cases",
    "view_reports", "create_reports", "edit_reports", "delete_reports",
    "view_tips", "delete_tips",
    "manage_roster", "change_ranks", "kick_agents", "manage_ranks", "manage_audit"
  ];

  permKeys.forEach(k => {
    const chk = document.getElementById(`perm-${k}`);
    if (chk) chk.checked = Boolean(rank.permissions && rank.permissions[k]);
  });

  modal.classList.remove("hidden");
  lucide.createIcons();
};

window.saveRankEditor = function(event) {
  if (event) event.preventDefault();
  if (!hasPermission('manage_ranks')) {
    showToast("⛔ No tienes permiso para guardar cambios en los rangos.");
    return;
  }

  const isNew = document.getElementById("rank-edit-is-new").value === "true";
  const isSystem = document.getElementById("rank-edit-is-system").value === "true";
  let id = document.getElementById("rank-edit-id").value.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "_");
  const label = document.getElementById("rank-edit-label").value.trim();
  const level = parseFloat(document.getElementById("rank-edit-level").value) || 0;
  const icon = document.getElementById("rank-edit-icon").value.trim() || "🛡️";
  const badgeClass = document.getElementById("rank-edit-badgeclass").value;
  const clearance = document.getElementById("rank-edit-clearance").value.trim() || `NIVEL ${level}`;

  if (!id || !label) {
    showToast("⚠️ El identificador y el nombre del rango son obligatorios.");
    return;
  }

  const permKeys = [
    "view_cases", "create_cases", "edit_cases", "delete_cases",
    "view_reports", "create_reports", "edit_reports", "delete_reports",
    "view_tips", "delete_tips",
    "manage_roster", "change_ranks", "kick_agents", "manage_ranks", "manage_audit"
  ];
  const permissions = {};
  permKeys.forEach(k => {
    const chk = document.getElementById(`perm-${k}`);
    permissions[k] = Boolean(chk && chk.checked);
  });

  // El rango Capitán siempre conserva todos los permisos
  if (id === 'capitan') {
    permKeys.forEach(k => { permissions[k] = true; });
  }

  const rankData = {
    id,
    label,
    level,
    clearance,
    icon,
    badgeClass,
    isSystem,
    permissions
  };

  dbUpsertRank(rankData);
  addAuditLog(
    isNew ? "RANGO CREADO" : "PERMISOS ACTUALIZADOS",
    label,
    `NVL ${level}`,
    `Rango ${label} (${id}) configurado con ${Object.values(permissions).filter(Boolean).length} permisos activos`,
    currentDiscordUser ? currentDiscordUser.username : "Sistema"
  );

  // Actualizar sesión actual si el usuario posee este rango
  if (currentDiscordUser && currentDiscordUser.rankKey === id) {
    currentDiscordUser.role = label;
    currentDiscordUser.rankLevel = level;
    currentDiscordUser.clearance = clearance;
    currentDiscordUser.isAuthorizedDetective = hasPermission('view_reports');
    currentDiscordUser.isHighCommand = hasPermission('manage_roster') || hasPermission('manage_ranks') || hasPermission('manage_audit') || level >= 4;
    localStorage.setItem("dd_discord_user", JSON.stringify(currentDiscordUser));
  }

  closeModal("rank-editor-modal");
  audioEngine.playAlertSound();
  showToast(`✅ Rango "${label}" y matriz de permisos guardados con éxito.`);

  renderDynamicRanks();
  renderJefaturaRoster(getJefaturaRoster());
  updateDiscordAuthUI();
};

window.deleteRank = function(rankId, rankLabel, officersCount = 0) {
  if (!hasPermission('manage_ranks')) {
    showToast("⛔ No tienes permiso para eliminar rangos.");
    return;
  }
  const ranks = getDynamicRanks();
  const rank = ranks[rankId];
  if (!rank) return;
  if (rank.isSystem) {
    showToast("⛔ Los rangos del sistema protegidos no pueden ser eliminados.");
    return;
  }

  let warning = `¿Está seguro de eliminar definitivamente el rango "${rankLabel || rankId}"?`;
  if (officersCount > 0) {
    warning += `\n\n⚠️ ATENCIÓN: Hay ${officersCount} oficial(es) asignados a este rango. Serán transferidos automáticamente al rango "Aspirante" sin acceso.`;
  }

  if (!confirm(warning)) return;

  const roster = getJefaturaRoster();
  let reassigned = 0;
  roster.forEach(agent => {
    if (agent.rank === rankId) {
      agent.rank = "aspirante";
      agent.division = "Sin Asignar // Reasignado por Eliminación de Rango";
      dbUpsertAgent(agent);
      reassigned++;
    }
  });

  dbDeleteRank(rankId);
  addAuditLog(
    "RANGO ELIMINADO",
    rankLabel || rankId,
    `ID: ${rankId}`,
    `Rango eliminado. ${reassigned} oficial(es) reasignados a Aspirante.`,
    currentDiscordUser ? currentDiscordUser.username : "Sistema"
  );

  audioEngine.playRadioBeep();
  showToast(`🗑️ Rango "${rankLabel || rankId}" eliminado. ${reassigned} oficial(es) reasignados.`);
  renderDynamicRanks();
  renderJefaturaRoster(getJefaturaRoster());
  renderJefaturaKPIs();
  updateDiscordAuthUI();
};

window.deleteRankFromModal = function() {
  const rankId = document.getElementById("rank-edit-id")?.value;
  const label = document.getElementById("rank-edit-label")?.value || rankId;
  const roster = getJefaturaRoster();
  const officersCount = roster.filter(a => a.rank === rankId).length;
  closeModal("rank-editor-modal");
  deleteRank(rankId, label, officersCount);
};

window.setRankPermissionsAll = function(enabled) {
  audioEngine.playKeyClick();
  const permKeys = [
    "view_cases", "create_cases", "edit_cases", "delete_cases",
    "view_reports", "create_reports", "edit_reports", "delete_reports",
    "view_tips", "delete_tips",
    "manage_roster", "change_ranks", "kick_agents", "manage_ranks", "manage_audit"
  ];
  permKeys.forEach(k => {
    const chk = document.getElementById(`perm-${k}`);
    if (chk) chk.checked = enabled;
  });
};

window.setRankPermissionsDetectivePreset = function() {
  audioEngine.playKeyClick();
  const preset = {
    view_cases: true, create_cases: true, edit_cases: true, delete_cases: false,
    view_reports: true, create_reports: true, edit_reports: true, delete_reports: false,
    view_tips: true, delete_tips: false,
    manage_roster: false, change_ranks: false, kick_agents: false, manage_ranks: false, manage_audit: false
  };
  Object.keys(preset).forEach(k => {
    const chk = document.getElementById(`perm-${k}`);
    if (chk) chk.checked = preset[k];
  });
};

// --- ROSTER RENDERING ---
function renderJefaturaRoster(agents) {
  const grid = document.getElementById("jefatura-roster-grid");
  if (!grid) return;

  if (agents.length === 0) {
    grid.innerHTML = `
      <div class="col-span-full py-14 text-center text-slate-500 font-conthrax text-xs">
        <i data-lucide="users" class="w-10 h-10 mx-auto mb-3 opacity-30"></i>
        No se encontraron agentes con ese criterio de búsqueda.
      </div>
    `;
    lucide.createIcons();
    return;
  }

  const canEditRoster = hasPermission('manage_roster');
  const canKick = hasPermission('kick_agents');

  grid.innerHTML = agents.map(agent => {
    const rank   = RANK_META[agent.rank] || RANK_META["aspirante"];
    const statBadge = getStatusBadge(agent.status);

    const awardIcons = [];
    if (agent.awards && agent.awards.includes("valor"))    awardIcons.push('<span title="Medalla al Valor" class="text-amber-400">🎖️</span>');
    if (agent.awards && agent.awards.includes("servicio")) awardIcons.push('<span title="Cruz por Servicios" class="text-blue-400">✚</span>');
    if (agent.awards && agent.awards.includes("tirador"))  awardIcons.push('<span title="Tirador Táctico" class="text-emerald-400">🎯</span>');
    if (agent.awards && agent.awards.includes("merito"))   awardIcons.push('<span title="Estrella al Mérito" class="text-purple-400">⭐</span>');

    const avatarSrc = agent.avatar || "https://cdn.discordapp.com/embed/avatars/0.png";

    return `
      <div class="glass-panel rounded-xl p-5 border border-slate-800 hover:border-amber-500/40 transition-all group flex flex-col gap-4">
        <!-- Agent Header -->
        <div class="flex items-center gap-3">
          <div class="relative shrink-0">
            <img src="${avatarSrc}" alt="Avatar" class="w-12 h-12 rounded-xl object-cover border-2 border-slate-700 group-hover:border-amber-500/50 transition-colors"
              onerror="this.src='https://cdn.discordapp.com/embed/avatars/0.png'">
            <span class="absolute -bottom-1 -right-1 text-[10px] leading-none">${rank.icon}</span>
          </div>
          <div class="min-w-0 flex-1">
            <h4 class="text-sm font-black font-gobold text-white tracking-wide truncate">${agent.icName}</h4>
            <span class="font-conthrax text-[9px] text-slate-400 truncate block">@${agent.discordTag}</span>
            <span class="font-conthrax text-[10px] text-amber-400 font-bold">${agent.badge}</span>
          </div>
        </div>

        <!-- Rank & Division -->
        <div class="space-y-1.5 font-conthrax text-[11px]">
          <div class="flex items-center justify-between">
            <span class="px-2 py-0.5 rounded ${rank.cssClass} font-bold text-[10px]">${rank.label}</span>
            <span class="px-2 py-0.5 rounded ${statBadge} font-bold text-[10px]">${agent.status}</span>
          </div>
          <p class="text-slate-400 text-[10px] font-mono truncate">${agent.division}</p>
        </div>

        <!-- Awards Row -->
        ${awardIcons.length > 0 ? `<div class="flex items-center gap-1.5 text-base">${awardIcons.join("")}</div>` : ''}

        <!-- Notes (truncated) -->
        ${agent.notes ? `
          <p class="text-[10px] text-slate-500 font-mono italic leading-relaxed line-clamp-2">${agent.notes}</p>
        ` : ''}

        <!-- Footer: Date & Actions -->
        <div class="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 font-conthrax text-[10px]">
          <span class="text-slate-500">Ingreso: ${agent.joinDate || "—"}</span>
          <div class="flex items-center gap-1.5">
            ${canEditRoster ? `
              <button 
                onclick="openAgentEditor('${agent.discordId}')" 
                class="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/30 text-amber-300 hover:text-amber-200 border border-amber-500/30 transition-all font-bold uppercase flex items-center gap-1"
                title="Editar Ficha del Agente"
              >
                <i data-lucide="edit-3" class="w-3 h-3"></i>
                Editar
              </button>
            ` : ''}
            ${canKick ? `
              <button 
                onclick="quickKickAgent('${agent.discordId}', '${agent.icName.replace(/'/g, "\\'")}')" 
                class="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-800/40 transition-all"
                title="Expulsar del Cuerpo"
              >
                <i data-lucide="user-x" class="w-3.5 h-3.5"></i>
              </button>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  }).join("");

  lucide.createIcons();
}

// --- ROSTER FILTER & SEARCH ---
window.filterJefaturaRoster = function(filterKey) {
  audioEngine.playKeyClick();

  // Update button styles
  document.querySelectorAll(".jef-filter-btn").forEach(b => {
    b.classList.remove("bg-amber-500", "text-black");
    b.classList.add("bg-slate-800", "text-slate-300");
  });
  if (event && event.target) {
    event.target.classList.add("bg-amber-500", "text-black");
    event.target.classList.remove("bg-slate-800", "text-slate-300");
  }

  const all = getJefaturaRoster();
  let filtered = all;

  if (filterKey === "pending") {
    filtered = all.filter(a => a.status === "Pendiente" || a.rank === "aspirante");
  } else if (filterKey === "active") {
    filtered = all.filter(a => a.status === "Activo");
  } else if (filterKey === "command") {
    filtered = all.filter(a => (RANK_META[a.rank] || {}).level >= 4);
  } else if (filterKey === "suspended") {
    filtered = all.filter(a => a.status === "Suspendido" || a.status === "Expulsado");
  }

  renderJefaturaRoster(filtered);
};

function setupJefaturaSearch() {
  const input = document.getElementById("jefatura-search-input");
  if (!input) return;
  input.addEventListener("input", (e) => {
    const q = e.target.value.toLowerCase().trim();
    const all = getJefaturaRoster();
    if (!q) { renderJefaturaRoster(all); return; }
    const filtered = all.filter(a =>
      (a.icName || "").toLowerCase().includes(q) ||
      (a.discordTag || "").toLowerCase().includes(q) ||
      (a.badge || "").toLowerCase().includes(q) ||
      (a.division || "").toLowerCase().includes(q) ||
      (a.discordId || "").includes(q)
    );
    renderJefaturaRoster(filtered);
  });
}

// --- AGENT EDITOR MODAL ---
let currentEditingAgentId = null;

window.openAgentEditor = function(discordId) {
  if (!hasPermission('manage_roster')) {
    showToast("⛔ Solo oficiales con permiso de Gestión de Censo pueden editar fichas de agentes.");
    return;
  }
  audioEngine.playKeyClick();

  const roster = getJefaturaRoster();
  const agent = roster.find(a => a.discordId === discordId);
  if (!agent) return;

  currentEditingAgentId = discordId;

  const modal = document.getElementById("agent-editor-modal");
  if (!modal) return;

  // Populate dynamic ranks into rank dropdown
  populateRankSelect("edit-agent-rank", agent.rank || "aspirante");

  const rankSelect = document.getElementById("edit-agent-rank");
  if (rankSelect) {
    const canChangeRanks = hasPermission('change_ranks');
    rankSelect.disabled = !canChangeRanks;
    rankSelect.title = canChangeRanks ? "" : "No tienes permiso para ascender o degradar oficiales.";
  }

  // Populate form fields
  document.getElementById("edit-agent-user-id").value        = agent.discordId;
  document.getElementById("edit-agent-icname").value         = agent.icName || "";
  document.getElementById("edit-agent-badge").value          = agent.badge || "";
  document.getElementById("edit-agent-division").value       = agent.division || "Sin Asignar // En Evaluación";
  document.getElementById("edit-agent-status").value         = agent.status || "Pendiente";
  document.getElementById("edit-agent-discord-tag").value    = agent.discordTag || "";
  document.getElementById("edit-agent-notes").value          = agent.notes || "";
  document.getElementById("edit-agent-discord-sub").textContent = `Discord ID: ${agent.discordId}`;

  // Avatar / Foto
  const avatarInput = document.getElementById("edit-agent-avatar");
  const avatarPreview = document.getElementById("edit-agent-avatar-preview");
  if (avatarInput) avatarInput.value = agent.avatar || "";
  if (avatarPreview) avatarPreview.src = agent.avatar || "https://cdn.discordapp.com/embed/avatars/0.png";

  // Awards
  document.getElementById("award-valor").checked    = (agent.awards || []).includes("valor");
  document.getElementById("award-servicio").checked = (agent.awards || []).includes("servicio");
  document.getElementById("award-tirador").checked  = (agent.awards || []).includes("tirador");
  document.getElementById("award-merito").checked   = (agent.awards || []).includes("merito");

  // Header status badge
  const statusBadge = document.getElementById("edit-agent-header-status");
  if (statusBadge) {
    statusBadge.textContent = agent.status;
    statusBadge.className = `px-2 py-0.5 rounded text-[10px] font-conthrax font-bold ${getStatusBadge(agent.status)}`;
  }

  // Delete/Kick button inside modal
  const modalKickBtn = document.querySelector("#agent-editor-modal button[onclick*='kickAgentFromModal']");
  if (modalKickBtn) {
    modalKickBtn.style.display = hasPermission('kick_agents') ? 'inline-flex' : 'none';
  }

  modal.classList.remove("hidden");
  lucide.createIcons();
};

window.saveAgentEditor = function(event) {
  if (event) event.preventDefault();
  if (!hasPermission('manage_roster')) {
    showToast("⛔ No ostentas permiso para modificar fichas del censo.");
    return;
  }

  const userId = document.getElementById("edit-agent-user-id").value;
  const roster = getJefaturaRoster();
  const idx = roster.findIndex(a => a.discordId === userId);
  if (idx === -1) return;

  const oldAgent = roster[idx];
  const oldRank  = oldAgent.rank;

  const newRank   = document.getElementById("edit-agent-rank").value;
  const newStatus = document.getElementById("edit-agent-status").value;
  const newIcName = document.getElementById("edit-agent-icname").value.trim();
  const newBadge  = document.getElementById("edit-agent-badge").value.trim();
  const newDiv    = document.getElementById("edit-agent-division").value;
  const newNotes  = document.getElementById("edit-agent-notes").value.trim();
  const newAvatar = document.getElementById("edit-agent-avatar")?.value.trim() || oldAgent.avatar;

  if (oldRank !== newRank && !hasPermission('change_ranks')) {
    showToast("⛔ No tienes permiso para ascender o degradar oficiales de rango.");
    return;
  }

  const awards = [];
  if (document.getElementById("award-valor").checked)    awards.push("valor");
  if (document.getElementById("award-servicio").checked) awards.push("servicio");
  if (document.getElementById("award-tirador").checked)  awards.push("tirador");
  if (document.getElementById("award-merito").checked)   awards.push("merito");

  roster[idx] = {
    ...oldAgent,
    icName:   newIcName,
    badge:    newBadge,
    rank:     newRank,
    division: newDiv,
    status:   newStatus,
    notes:    newNotes,
    avatar:   newAvatar,
    awards
  };

  saveJefaturaRoster(roster);
  dbUpsertAgent(roster[idx]);

  // Audit log entry
  const rankLabel = (RANK_META[newRank] || {}).label || newRank;
  if (oldRank !== newRank) {
    addAuditLog("CAMBIO DE RANGO", newIcName, oldAgent.discordTag, `${(RANK_META[oldRank]||{}).label||oldRank} → ${rankLabel}`, currentDiscordUser.username);
  }
  if (oldAgent.status !== newStatus) {
    addAuditLog("CAMBIO DE ESTADO", newIcName, oldAgent.discordTag, `${oldAgent.status} → ${newStatus}`, currentDiscordUser.username);
  }
  if (oldAgent.icName !== newIcName) {
    addAuditLog("CAMBIO DE NOMBRE IC", newIcName, oldAgent.discordTag, `"${oldAgent.icName}" → "${newIcName}"`, currentDiscordUser.username);
  }
  if (oldAgent.badge !== newBadge) {
    addAuditLog("CAMBIO DE PLACA", newIcName, oldAgent.discordTag, `${oldAgent.badge} → ${newBadge}`, currentDiscordUser.username);
  }

  // If editing the logged-in user, refresh their session
  if (currentDiscordUser && currentDiscordUser.id === userId) {
    const rankData = RANK_META[newRank] || RANK_META["aspirante"];
    currentDiscordUser = {
      ...currentDiscordUser,
      badge:               newBadge,
      role:                newIcName,
      rankKey:             newRank,
      rankLevel:           rankData.level,
      isAuthorizedDetective: hasPermission('view_reports'),
      isHighCommand:       hasPermission('manage_roster') || hasPermission('manage_ranks') || hasPermission('manage_audit') || rankData.level >= 4,
      clearance:           rankData.clearance
    };
    isDetectiveAuth = hasPermission('view_reports');
    localStorage.setItem("dd_discord_user", JSON.stringify(currentDiscordUser));
  }

  closeModal("agent-editor-modal");
  audioEngine.playAlertSound();
  showToast(`✅ Ficha de ${newIcName} actualizada con éxito.`);
  renderJefaturaKPIs();
  renderJefaturaRoster(getJefaturaRoster());
  updateDiscordAuthUI();
};

// --- KICK AGENT ---
window.kickAgentFromModal = function() {
  const userId = document.getElementById("edit-agent-user-id")?.value;
  if (!userId) return;
  const icName = document.getElementById("edit-agent-icname")?.value || userId;
  quickKickAgent(userId, icName);
  closeModal("agent-editor-modal");
};

window.quickKickAgent = function(discordId, icName) {
  if (!hasPermission('kick_agents')) {
    showToast("⛔ Solo oficiales con permiso de Expulsión pueden dar de baja a miembros.");
    return;
  }
  audioEngine.playAlertSound();

  const roster = getJefaturaRoster();
  const idx = roster.findIndex(a => a.discordId === discordId);
  if (idx === -1) return;

  roster[idx].status = "Expulsado";
  roster[idx].rank   = "aspirante"; // Revoke all access

  saveJefaturaRoster(roster);
  dbUpsertAgent(roster[idx]);
  addAuditLog("EXPULSIÓN DEL CUERPO", icName, roster[idx].discordTag, "Baja definitiva. Acceso revocado.", currentDiscordUser.username);

  showToast(`🚨 ${icName} ha sido expulsado/a de la Detective Division.`);
  renderJefaturaKPIs();
  renderJefaturaRoster(getJefaturaRoster());
  renderMandoGrid();
  renderSubdivisionPrivatePanel();
};

// --- ADD AGENT MODAL ---
window.openAddAgentModal = function() {
  if (!hasPermission('manage_roster')) {
    showToast("⛔ Solo oficiales con permiso de Gestión de Censo pueden incorporar nuevos agentes.");
    return;
  }
  audioEngine.playKeyClick();
  const modal = document.getElementById("add-agent-modal");
  if (modal) {
    // Populate dynamic ranks into rank dropdown
    populateRankSelect("new-agent-rank", "det1");

    const form = document.getElementById("add-agent-form");
    if (form) form.reset();
    modal.classList.remove("hidden");
    lucide.createIcons();
  }
};

window.saveNewAgent = function(event) {
  if (event) event.preventDefault();
  if (!hasPermission('manage_roster')) {
    showToast("⛔ No tienes permiso para incorporar nuevos agentes.");
    return;
  }

  const discordId  = document.getElementById("new-agent-discord-id")?.value.trim();
  const discordTag = document.getElementById("new-agent-discord-tag")?.value.trim();
  const icName     = document.getElementById("new-agent-icname")?.value.trim();
  const badge      = document.getElementById("new-agent-badge")?.value.trim();
  const rank       = document.getElementById("new-agent-rank")?.value || "det1";
  const division   = document.getElementById("new-agent-division")?.value || "Sin Asignar // En Evaluación";

  if (!discordId || !icName || !badge) {
    showToast("⚠️ Discord ID, Nombre IC y Placa son obligatorios.");
    return;
  }

  const roster = getJefaturaRoster();
  if (roster.find(a => a.discordId === discordId)) {
    showToast("⚠️ Ya existe un agente con ese Discord ID en el censo.");
    return;
  }

  const rankData = RANK_META[rank] || RANK_META["det1"];

  const newAgent = {
    discordId,
    discordTag,
    icName,
    badge,
    rank,
    division,
    status:   "Activo",
    awards:   [],
    notes:    "",
    avatar:   `https://cdn.discordapp.com/embed/avatars/${Math.floor(Math.random()*6)}.png`,
    joinDate: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()
  };

  roster.push(newAgent);
  saveJefaturaRoster(roster);
  dbUpsertAgent(newAgent);
  addAuditLog("INCORPORACIÓN AL CENSO", icName, discordTag, `Rango: ${rankData.label} // División: ${division}`, currentDiscordUser.username);

  closeModal("add-agent-modal");
  audioEngine.playAlertSound();
  showToast(`✅ ${icName} (${badge}) incorporado/a al censo de la División.`);
  renderJefaturaKPIs();
  renderJefaturaRoster(getJefaturaRoster());
  renderMandoGrid();
  renderSubdivisionPrivatePanel();
};

// --- CLAIM HIGH COMMAND (founder/setup mode) ---
window.claimHighCommandForCurrentAccount = function() {
  if (!currentDiscordUser) {
    showToast("⚠️ Debes iniciar sesión con Discord primero.");
    openDiscordAuthModal();
    return;
  }

  audioEngine.playAlertSound();
  const roster = getJefaturaRoster();
  const existing = roster.find(a => a.discordId === currentDiscordUser.id);

  if (existing) {
    // Promote existing user to Capitán
    existing.rank   = "capitan";
    existing.status = "Activo";
    existing.division = "Mando Supremo // Bureau Executive";
    dbUpsertAgent(existing);
  } else {
    // Add as Capitán
    const newCap = {
      discordId:   currentDiscordUser.id,
      discordTag:  currentDiscordUser.tag,
      icName:      currentDiscordUser.username,
      badge:       currentDiscordUser.badge,
      rank:        "capitan",
      division:    "Mando Supremo // Bureau Executive",
      status:      "Activo",
      awards:      ["valor", "servicio"],
      notes:       "Fundador/a de la División. Acceso reclamado como Capitán de Mando.",
      avatar:      currentDiscordUser.avatar || "https://cdn.discordapp.com/embed/avatars/0.png",
      joinDate:    new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()
    };
    roster.unshift(newCap);
    dbUpsertAgent(newCap);
  }

  saveJefaturaRoster(roster);
  addAuditLog("MANDO RECLAMADO", currentDiscordUser.username, currentDiscordUser.tag, "Capitán de División por reclamación de Fundador", "Sistema");

  // Update session
  currentDiscordUser = {
    ...currentDiscordUser,
    role:                "Capitán de División",
    rankKey:             "capitan",
    rankLevel:           5,
    isAuthorizedDetective: true,
    isHighCommand:       true,
    clearance:           "NIVEL 5 // COMANDO SUPREMO"
  };
  isDetectiveAuth = true;
  localStorage.setItem("dd_discord_user", JSON.stringify(currentDiscordUser));

  updateDiscordAuthUI();
  showToast(`👑 ¡Mando reclamado! Bienvenido/a al Despacho de Jefatura, ${currentDiscordUser.username}.`);
};

// --- AUDIT LOG RENDERER ---
function renderAuditLogs() {
  const container = document.getElementById("jefatura-audit-list");
  if (!container) return;

  const logs = getAuditLogs();
  if (logs.length === 0) {
    container.innerHTML = `
      <div class="text-center py-10 text-slate-500 font-conthrax text-xs">
        <i data-lucide="clipboard-list" class="w-8 h-8 mx-auto mb-2 opacity-30"></i>
        No hay entradas de auditoría registradas todavía.
      </div>
    `;
    lucide.createIcons();
    return;
  }

  const actionColors = {
    "CAMBIO DE RANGO":         "text-amber-400 border-amber-500/30 bg-amber-500/5",
    "CAMBIO DE ESTADO":        "text-blue-400  border-blue-500/30  bg-blue-500/5",
    "CAMBIO DE NOMBRE IC":     "text-cyan-400  border-cyan-500/30  bg-cyan-500/5",
    "CAMBIO DE PLACA":         "text-purple-400 border-purple-500/30 bg-purple-500/5",
    "INCORPORACIÓN AL CENSO":  "text-emerald-400 border-emerald-500/30 bg-emerald-500/5",
    "EXPULSIÓN DEL CUERPO":    "text-red-400   border-red-500/30   bg-red-500/5",
    "MANDO RECLAMADO":         "text-amber-400 border-amber-500/30 bg-amber-500/10",
    "REGISTRO AUTOMÁTICO":     "text-slate-400 border-slate-600/30 bg-slate-800/30",
    "RANGO CREADO":            "text-amber-400 border-amber-500/30 bg-amber-500/10",
    "PERMISOS ACTUALIZADOS":   "text-cyan-400  border-cyan-500/30  bg-cyan-500/10",
    "RANGO ELIMINADO":         "text-red-400   border-red-500/30   bg-red-500/10",
    "EXPEDIENTE CREADO":       "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
    "EXPEDIENTE MODIFICADO":   "text-blue-400  border-blue-500/30  bg-blue-500/10",
    "EXPEDIENTE ELIMINADO":    "text-red-400   border-red-500/30   bg-red-500/10",
    "INFORME CREADO":          "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
    "INFORME MODIFICADO":      "text-blue-400  border-blue-500/30  bg-blue-500/10",
    "INFORME ELIMINADO":       "text-red-400   border-red-500/30   bg-red-500/10"
  };

  container.innerHTML = logs.map(log => {
    const colors = actionColors[log.action] || "text-slate-300 border-slate-700/30 bg-slate-800/20";
    return `
      <div class="p-3 rounded-lg border ${colors} flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div class="flex flex-col gap-0.5">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="font-bold uppercase text-[10px] font-conthrax">${log.action}</span>
            <span class="text-white font-semibold">${log.agentName}</span>
            <span class="text-slate-400 text-[10px]">@${log.discordTag}</span>
          </div>
          <span class="text-slate-300 text-[11px]">${log.detail}</span>
          <span class="text-slate-500 text-[10px]">Ordenado por: <strong class="text-slate-300">${log.commander}</strong></span>
        </div>
        <span class="text-[10px] text-slate-500 whitespace-nowrap shrink-0">${log.timestamp}</span>
      </div>
    `;
  }).join("");

  lucide.createIcons();
}

window.clearAuditLogs = function() {
  if (!hasPermission('manage_audit')) {
    showToast("⛔ Solo oficiales con permiso de Auditoría pueden limpiar el historial.");
    return;
  }
  dbClearAuditLogs();
  renderAuditLogs();
  showToast("🗑️ Historial de auditoría limpiado.");
};

// --- EXPORT ROSTER ---
window.exportRosterToClipboard = function() {
  const roster = getJefaturaRoster();
  const lines = ["📋 **CENSO OFICIAL // DETECTIVE DIVISION**\n"];
  const groups = {};
  roster.forEach(a => {
    const rankKey = a.rank || "aspirante";
    if (!groups[rankKey]) groups[rankKey] = [];
    groups[rankKey].push(a);
  });

  const order = getRankList().map(r => r.id);
  order.forEach(key => {
    if (!groups[key] || groups[key].length === 0) return;
    const meta = RANK_META[key] || {};
    lines.push(`\n**${meta.icon || "—"} ${meta.label || key}**`);
    groups[key].forEach(a => {
      lines.push(`• ${a.icName} ${a.badge} | ${a.discordTag} | ${a.division} | Estado: ${a.status}`);
    });
  });

  lines.push(`\n_Actualizado: ${new Date().toLocaleString('es-ES')}_`);
  const text = lines.join("\n");

  navigator.clipboard.writeText(text).then(() => {
    audioEngine.playKeyClick();
    showToast("📋 Censo exportado al portapapeles (formato Discord).");
  }).catch(() => {
    showToast("⚠️ No se pudo copiar al portapapeles. Permiso denegado.");
  });
};

// --- RESET ROSTER ---
window.resetRosterToDefault = function() {
  if (!hasPermission('manage_roster')) {
    showToast("⛔ Solo oficiales con permiso de Gestión de Censo pueden restablecer el censo.");
    return;
  }
  const defaultRoster = JSON.parse(JSON.stringify(DEFAULT_ROSTER));
  saveJefaturaRoster(defaultRoster);
  defaultRoster.forEach(agent => dbUpsertAgent(agent));
  addAuditLog("RESTABLECIMIENTO DEL CENSO", "Sistema", "Sistema", "Censo restablecido a valores predeterminados de ejemplo", currentDiscordUser.username);
  audioEngine.playAlertSound();
  showToast("🔄 Censo restablecido a los datos de ejemplo.");
  renderJefaturaKPIs();
  renderJefaturaRoster(getJefaturaRoster());
  renderMandoGrid();
  renderSubdivisionPrivatePanel();
};




// ============================================================
// JEFATURA — NUEVOS TABS: switchJefaturaTab extendido
// ============================================================

// Extend switchJefaturaTab to handle new tabs
const _origSwitchJefaturaTab = window.switchJefaturaTab || function(){};
window.switchJefaturaTab = function(tab) {
  const allTabs = ['censo','audit','escalafon','subdivisions','solicitudes','mensajes','faltas'];
  allTabs.forEach(t => {
    const btn = document.getElementById(`tab-btn-jefatura-${t}`);
    const content = document.getElementById(`tab-content-jefatura-${t}`);
    if (btn) btn.classList.toggle('active', t === tab);
    if (content) content.classList.toggle('hidden', t !== tab);
  });
  if (tab === 'subdivisions') renderJefaturaSubdivisionsTab();
  if (tab === 'solicitudes') renderSolicitudesList();
  if (tab === 'mensajes') { renderJefaturaMensajes(); }
  if (tab === 'faltas') { renderJefaturaFaltasTab(); }
  if (tab === 'censo') { renderJefaturaRoster(getJefaturaRoster()); }
  if (tab === 'audit') { renderAuditLogs(); }
  if (tab === 'escalafon') { renderDynamicRanks(); }
  if (window.lucide) window.lucide.createIcons();
};

// ============================================================
// SUBDIVISION MANAGEMENT
// ============================================================

const SUBDIVISION_META = {
  'RHD':  { label: 'RHD — Homicidios y Robos',       color: 'red',     icon: '🔴', bg: 'bg-red-900/30',    border: 'border-red-500/40'    },
  'GND':  { label: 'GND — Narcóticos y Pandillas',    color: 'purple',  icon: '🟣', bg: 'bg-purple-900/30', border: 'border-purple-500/40' },
  'AIB':  { label: 'AIB — Asuntos Internos',          color: 'amber',   icon: '🟡', bg: 'bg-amber-900/30',  border: 'border-amber-500/40'  },
  'CSI':  { label: 'CSI — Escena del Crimen',         color: 'cyan',    icon: '🔵', bg: 'bg-cyan-900/30',   border: 'border-cyan-500/40'   },
  'SWAT': { label: 'SWAT — Operaciones Tácticas',     color: 'emerald', icon: '🟢', bg: 'bg-emerald-900/30',border: 'border-emerald-500/40' },
};

function renderJefaturaSubdivisionsTab() {
  const grid = document.getElementById('jef-subdivisions-grid');
  if (!grid) return;
  const roster = getJefaturaRoster();
  grid.innerHTML = Object.entries(SUBDIVISION_META).map(([key, meta]) => {
    const members = roster.filter(a => {
      const div = (a.division || '').toUpperCase();
      return div.includes(key);
    });
    const chief = members.find(a => a.subdivisionRole === 'jefe');
    const memberRows = members.map(a => `
      <div class="flex items-center justify-between py-1.5 border-b border-slate-800/50 last:border-0">
        <div class="flex items-center gap-2">
          <img src="${a.avatar || 'https://cdn.discordapp.com/embed/avatars/0.png'}" class="w-6 h-6 rounded-full object-cover" alt="">
          <div>
            <span class="text-white text-xs font-bold">${a.icName}</span>
            ${a.subdivisionRole === 'jefe' ? '<span class="ml-1 px-1 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[9px] font-bold">JEFE</span>' : ''}
          </div>
        </div>
        <span class="text-[10px] font-conthrax text-slate-500">${a.badge}</span>
      </div>
    `).join('');
    return `
      <div class="glass-panel p-5 rounded-xl ${meta.border} border ${meta.bg} space-y-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="text-xl">${meta.icon}</span>
            <div>
              <h6 class="font-black font-gobold text-white text-sm">${key}</h6>
              <p class="text-[10px] font-conthrax text-slate-400">${meta.label.split('—')[1].trim()}</p>
            </div>
          </div>
          <span class="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-conthrax text-[10px] font-bold">${members.length} efectivos</span>
        </div>
        ${chief ? `<p class="text-[10px] font-conthrax text-slate-400">Jefe: <span class="text-blue-300 font-bold">${chief.icName}</span></p>` : '<p class="text-[10px] font-conthrax text-amber-400/70">Sin jefe asignado</p>'}
        <div class="space-y-0 max-h-40 overflow-y-auto">
          ${memberRows || '<p class="text-xs font-conthrax text-slate-600 py-2">Sin miembros asignados</p>'}
        </div>
      </div>
    `;
  }).join('');

  // Setup agent search autocomplete
  _setupSubdivAgentSearch();
}

let _assignSubdivSelectedAgent = null;
function _setupSubdivAgentSearch() {
  const inp = document.getElementById('assign-subdiv-agent-search');
  const results = document.getElementById('assign-subdiv-agent-results');
  if (!inp || !results) return;
  inp.oninput = () => {
    const q = inp.value.toLowerCase().trim();
    if (!q) { results.classList.add('hidden'); return; }
    const roster = getJefaturaRoster();
    const matches = roster.filter(a =>
      a.icName.toLowerCase().includes(q) ||
      (a.discordTag||'').toLowerCase().includes(q) ||
      a.discordId.includes(q)
    ).slice(0, 5);
    if (!matches.length) { results.classList.add('hidden'); return; }
    results.classList.remove('hidden');
    results.innerHTML = matches.map(a => `
      <div class="px-3 py-2 hover:bg-slate-800 cursor-pointer border-b border-slate-800 last:border-0 flex items-center gap-2"
           onclick="window._selectSubdivAgent('${a.discordId}', '${a.icName.replace(/'/g,"\\'")}')">
        <img src="${a.avatar||'https://cdn.discordapp.com/embed/avatars/0.png'}" class="w-6 h-6 rounded-full">
        <div>
          <p class="text-white font-bold text-xs">${a.icName}</p>
          <p class="text-slate-500 text-[10px]">${a.badge} • ${a.discordId}</p>
        </div>
      </div>
    `).join('');
  };
}

window._selectSubdivAgent = function(id, name) {
  _assignSubdivSelectedAgent = id;
  const inp = document.getElementById('assign-subdiv-agent-search');
  const results = document.getElementById('assign-subdiv-agent-results');
  if (inp) inp.value = name;
  if (results) results.classList.add('hidden');
};

window.assignSubdivisionToAgent = async function() {
  if (!hasPermission('manage_roster')) { showToast('⛔ Sin permiso.'); return; }
  const agentId = _assignSubdivSelectedAgent;
  const subdiv  = document.getElementById('assign-subdiv-select')?.value;
  const role    = document.getElementById('assign-subdiv-role')?.value || 'miembro';
  const statusEl = document.getElementById('assign-subdiv-status');

  if (!agentId) { showToast('⚠️ Selecciona un agente de la lista.'); return; }

  const roster = getJefaturaRoster();
  const agent = roster.find(a => a.discordId === agentId);
  if (!agent) { showToast('⚠️ Agente no encontrado.'); return; }

  const divLabel = subdiv ? `${SUBDIVISION_META[subdiv]?.label || subdiv}` : 'Sin Asignar // En Evaluación';
  agent.division = divLabel;
  agent.subdivisionRole = subdiv ? role : null;

  saveJefaturaRoster(roster);
  await dbUpsertAgent(agent);

  // Si el agente asignado es el usuario que tiene sesión iniciada, actualizar inmediatamente su sesión
  if (currentDiscordUser && currentDiscordUser.id === agentId) {
    currentDiscordUser = {
      ...currentDiscordUser,
      rosterAgent: { ...agent },
      division: divLabel,
      subdivisionRole: agent.subdivisionRole
    };
    try {
      localStorage.setItem("dd_discord_user", JSON.stringify(currentDiscordUser));
    } catch(e) {}
  }

  addAuditLog('ASIGNACIÓN SUBDIVISIÓN', agent.icName, agent.discordTag,
    `Subdivisión: ${subdiv || 'Sin Asignar'} // Cargo: ${role}`, currentDiscordUser?.username || 'Sistema');

  if (statusEl) {
    statusEl.textContent = `✅ ${agent.icName} asignado/a a ${divLabel} como ${role}`;
    statusEl.classList.remove('hidden');
    setTimeout(() => statusEl.classList.add('hidden'), 4000);
  }
  renderJefaturaSubdivisionsTab();
  renderMandoGrid();
  renderSubdivisionPrivatePanel();
  if (typeof renderMiPerfil === 'function') renderMiPerfil();
  updateDiscordAuthUI();
  showToast(`✅ ${agent.icName} → ${subdiv || 'Sin Asignar'} (${role})`);
};

window.removeSubdivisionFromAgent = async function() {
  document.getElementById('assign-subdiv-select').value = '';
  await window.assignSubdivisionToAgent();
};

// ============================================================
// SOLICITUDES (Subdivision Chief → Jefatura)
// ============================================================

function renderSolicitudesList() {
  const container = document.getElementById('solicitudes-list');
  if (!container) return;
  const all = dbGetSolicitudes().filter(s => s.status === 'pendiente');
  const badge = document.getElementById('solicitudes-badge');
  if (badge) {
    badge.textContent = all.length;
    badge.classList.toggle('hidden', all.length === 0);
  }
  if (!all.length) {
    container.innerHTML = '<p class="text-slate-500 py-4 text-center">No hay solicitudes pendientes.</p>';
    return;
  }
  container.innerHTML = all.map(s => `
    <div class="glass-panel p-4 rounded-xl border ${s.type === 'alta' ? 'border-emerald-500/30' : 'border-red-500/30'} space-y-2">
      <div class="flex items-center justify-between flex-wrap gap-2">
        <div class="flex items-center gap-2">
          <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${s.type === 'alta' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'} uppercase">${s.type === 'alta' ? '📥 Solicitud de Alta' : '📤 Solicitud de Baja'}</span>
          <span class="text-white font-bold">${s.agentName}</span>
        </div>
        <span class="text-[10px] text-slate-500">${new Date(s.created_at).toLocaleDateString('es-ES')}</span>
      </div>
      <p class="text-slate-400 text-[11px]">Jefe de <strong class="text-blue-300">${s.subdivision}</strong>: <span class="text-slate-300">${s.chiefName}</span></p>
      <p class="text-slate-400 text-[11px]">Motivo: <span class="text-white">${s.reason || '—'}</span></p>
      <div class="flex gap-2 pt-1">
        <button onclick="approveSolicitud('${s.id}')" class="px-3 py-1.5 rounded bg-emerald-600/20 hover:bg-emerald-600/40 border border-emerald-500/40 text-emerald-300 font-conthrax font-bold text-[10px] uppercase transition-all">✅ Aprobar</button>
        <button onclick="rejectSolicitud('${s.id}')" class="px-3 py-1.5 rounded bg-red-900/20 hover:bg-red-900/40 border border-red-500/40 text-red-300 font-conthrax font-bold text-[10px] uppercase transition-all">❌ Rechazar</button>
      </div>
    </div>
  `).join('');
}

window.approveSolicitud = async function(id) {
  if (!hasPermission('manage_roster')) return;
  const sol = dbGetSolicitudes().find(s => s.id === id);
  if (!sol) return;

  if (sol.type === 'alta' && sol.agentData) {
    const roster = getJefaturaRoster();
    if (!roster.find(a => a.discordId === sol.agentId)) {
      roster.push(sol.agentData);
      saveJefaturaRoster(roster);
      await dbUpsertAgent(sol.agentData);
      addAuditLog('ALTA APROBADA', sol.agentName, sol.agentId, `Subdivisión: ${sol.subdivision} — solicitado por ${sol.chiefName}`, currentDiscordUser?.username);
    }
  } else if (sol.type === 'baja') {
    const roster = getJefaturaRoster().filter(a => a.discordId !== sol.agentId);
    saveJefaturaRoster(roster);
    await dbDeleteAgent(sol.agentId);
    addAuditLog('BAJA APROBADA', sol.agentName, sol.agentId, `Subdivisión: ${sol.subdivision} — solicitado por ${sol.chiefName}`, currentDiscordUser?.username);
  }

  await dbUpdateSolicitudStatus(id, 'aprobada');
  showToast(`✅ Solicitud aprobada: ${sol.type.toUpperCase()} de ${sol.agentName}`);
  renderSolicitudesList();
  renderJefaturaRoster(getJefaturaRoster());
  renderJefaturaKPIs();
};

window.rejectSolicitud = async function(id) {
  const sol = dbGetSolicitudes().find(s => s.id === id);
  if (!sol) return;
  await dbUpdateSolicitudStatus(id, 'rechazada');
  showToast(`❌ Solicitud rechazada: ${sol.type.toUpperCase()} de ${sol.agentName}`);
  renderSolicitudesList();
};

// ============================================================
// JEFATURA MENSAJES
// ============================================================

let _jefReplyToId = null;
function renderJefaturaMensajes() {
  const container = document.getElementById('jefatura-mensajes-list');
  if (!container) return;
  const roster = getJefaturaRoster();

  // Group messages by agent thread
  const agentIds = [...new Set([
    ...Object.keys(CACHE.messages || {}).map(k => k.split('_').find(id => id !== 'jefatura'))
  ])].filter(Boolean);

  if (!agentIds.length) {
    container.innerHTML = '<p class="text-slate-500 py-4 text-center">No hay mensajes de agentes.</p>';
    return;
  }

  container.innerHTML = agentIds.map(agentId => {
    const agent = roster.find(a => a.discordId === agentId);
    const name = agent ? agent.icName : agentId;
    const threadKey = [agentId, 'jefatura'].sort().join('_');
    const msgs = (CACHE.messages[threadKey] || []);
    const unread = msgs.filter(m => m.to_id === 'jefatura' && !m.read).length;
    const last = msgs[msgs.length - 1];

    return `
      <div class="p-3 rounded-xl bg-slate-900/60 border ${unread ? 'border-emerald-500/50' : 'border-slate-800'} cursor-pointer hover:bg-slate-800/60 transition-colors"
           onclick="openJefaturaMessageThread('${agentId}', '${name.replace(/'/g,"\\'")}')">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <img src="${agent?.avatar || 'https://cdn.discordapp.com/embed/avatars/0.png'}" class="w-7 h-7 rounded-full object-cover">
            <span class="text-white font-bold text-xs">${name}</span>
            ${unread ? `<span class="px-1.5 py-0.5 rounded-full bg-emerald-500 text-white text-[9px] font-bold">${unread}</span>` : ''}
          </div>
          <span class="text-[10px] text-slate-500">${last ? new Date(last.created_at).toLocaleTimeString('es-ES', {hour:'2-digit',minute:'2-digit'}) : ''}</span>
        </div>
        ${last ? `<p class="text-[11px] text-slate-400 mt-1 truncate">${last.from_id === 'jefatura' ? '→ ' : '← '}${last.content}</p>` : ''}
      </div>
    `;
  }).join('');

  // Update badge
  const totalUnread = agentIds.reduce((acc, id) => {
    const tk = [id, 'jefatura'].sort().join('_');
    return acc + (CACHE.messages[tk]||[]).filter(m => m.to_id === 'jefatura' && !m.read).length;
  }, 0);
  const badge = document.getElementById('mensajes-badge-jef');
  if (badge) { badge.textContent = totalUnread; badge.classList.toggle('hidden', totalUnread === 0); }
}

window.openJefaturaMessageThread = function(agentId, agentName) {
  _jefReplyToId = agentId;
  const panel = document.getElementById('jef-reply-panel');
  const toEl = document.getElementById('jef-reply-to');
  if (panel) panel.classList.remove('hidden');
  if (toEl) toEl.textContent = agentName;

  // Show thread inline
  const container = document.getElementById('jefatura-mensajes-list');
  if (!container) return;
  const threadKey = [agentId, 'jefatura'].sort().join('_');
  const msgs = (CACHE.messages[threadKey] || []).sort((a,b) => new Date(a.created_at)-new Date(b.created_at));
  const threadHtml = msgs.map(m => `
    <div class="p-2.5 rounded-lg ${m.from_id === 'jefatura' ? 'bg-amber-900/20 border border-amber-500/20 self-end ml-8' : 'bg-slate-900 border border-slate-800 mr-8'}">
      <p class="text-[10px] text-slate-500 mb-0.5">${m.from_id === 'jefatura' ? '👑 Jefatura' : agentName} • ${new Date(m.created_at).toLocaleString('es-ES',{hour:'2-digit',minute:'2-digit'})}</p>
      <p class="text-white text-xs">${m.content}</p>
    </div>
  `).join('');

  container.innerHTML = `
    <button onclick="renderJefaturaMensajes()" class="text-[10px] text-slate-500 hover:text-white font-conthrax flex items-center gap-1 mb-2">← Volver a todos los mensajes</button>
    <div class="space-y-2 max-h-64 overflow-y-auto flex flex-col">${threadHtml || '<p class="text-slate-500 text-xs py-2">Sin mensajes aún.</p>'}</div>
  `;
  dbMarkMessagesRead(agentId, 'jefatura');
};

window.sendJefaturaReply = async function() {
  if (!_jefReplyToId) return;
  const inp = document.getElementById('jef-reply-input');
  const content = inp?.value.trim();
  if (!content) { showToast('⚠️ Escribe un mensaje primero.'); return; }
  await dbSendMessage('jefatura', _jefReplyToId, content);
  if (inp) inp.value = '';
  showToast('✉️ Mensaje enviado.');
  openJefaturaMessageThread(_jefReplyToId, document.getElementById('jef-reply-to')?.textContent || _jefReplyToId);
};

// ============================================================
// MI PERFIL — RENDER & TABS
// ============================================================

function switchPerfilTab(tab) {
  const tabs = ['info','faltas','informes','chat'];
  tabs.forEach(t => {
    const btn = document.getElementById(`tab-btn-perfil-${t}`);
    const content = document.getElementById(`tab-content-perfil-${t}`);
    if (btn) btn.classList.toggle('active', t === tab);
    if (content) content.classList.toggle('hidden', t !== tab);
  });
  if (tab === 'chat') { renderPerfilChat(); dbMarkMessagesRead('jefatura', currentDiscordUser?.id); }
  if (tab === 'faltas') renderPerfilFaltas();
  if (tab === 'informes') renderPerfilMisInformes();
}
window.switchPerfilTab = switchPerfilTab;

function renderMiPerfil() {
  const deniedView = document.getElementById('perfil-denied-view');
  const authView   = document.getElementById('perfil-authorized-view');
  const navBadge   = document.getElementById('nav-perfil-badge');

  if (!currentDiscordUser) {
    if (deniedView) deniedView.classList.remove('hidden');
    if (authView) authView.classList.add('hidden');
    if (navBadge) navBadge.classList.add('hidden');
    return;
  }

  if (deniedView) deniedView.classList.add('hidden');
  if (authView) authView.classList.remove('hidden');
  if (navBadge) navBadge.classList.remove('hidden');

  // Get live agent data from roster
  const roster = getJefaturaRoster();
  const agent = roster.find(a => a.discordId === currentDiscordUser.id);
  const rankMeta = RANK_META[currentDiscordUser.rankKey] || RANK_META['det1'];
  const isChief = agent?.subdivisionRole === 'jefe';

  // Header card
  const avatarEl = document.getElementById('perfil-avatar');
  if (avatarEl) avatarEl.src = currentDiscordUser.avatar || 'https://cdn.discordapp.com/embed/avatars/0.png';

  _setText('perfil-nombre-ic', agent?.icName || currentDiscordUser.username);
  _setText('perfil-placa', agent?.badge || currentDiscordUser.badge || '#---');
  _setText('perfil-rango-label', `${rankMeta.icon || '🛡️'} ${rankMeta.label || currentDiscordUser.role}`);
  _setText('perfil-discord-tag', `@${currentDiscordUser.username}`);
  _setText('perfil-nivel', `Nv. ${rankMeta.level || '?'}`);

  // Subdivision
  const subdivText = agent?.division || 'Sin Asignar';
  _setText('perfil-subdivision', subdivText);
  _setText('perfil-join-date', agent?.joinDate || '—');

  // Status badge
  const estadoBadge = document.getElementById('perfil-estado-badge');
  if (estadoBadge) {
    estadoBadge.textContent = agent?.status || 'Activo';
    estadoBadge.className = `px-2 py-0.5 rounded font-conthrax text-xs font-bold ${
      agent?.status === 'Suspendido' ? 'bg-red-500/20 text-red-300' :
      agent?.status === 'Expulsado'  ? 'bg-red-900/40 text-red-500' :
      'bg-emerald-500/20 text-emerald-300'
    }`;
  }

  // Chief badge
  const chiefBadge = document.getElementById('perfil-chief-badge');
  if (chiefBadge) chiefBadge.classList.toggle('hidden', !isChief);
  const chiefPanel = document.getElementById('perfil-chief-panel');
  if (chiefPanel) chiefPanel.classList.toggle('hidden', !isChief);

  // Stats
  const faltas = agent ? dbGetFaltas(agent.discordId) : [];
  _setText('perfil-faltas-count', faltas.length);

  const myReports = getConfidentialReports().filter(r => r.authorId === currentDiscordUser.id);
  _setText('perfil-mis-informes-count', myReports.length);

  // Unread messages
  const threadKey = [currentDiscordUser.id, 'jefatura'].sort().join('_');
  const unread = (CACHE.messages?.[threadKey] || []).filter(m => m.to_id === currentDiscordUser.id && !m.read).length;
  _setText('perfil-mensajes-count', unread);
  const chatUnread = document.getElementById('perfil-chat-unread');
  if (chatUnread) { chatUnread.textContent = unread; chatUnread.classList.toggle('hidden', unread === 0); }

  // Expediente info tab
  _setText('perfil-info-nombre', agent?.icName || '—');
  _setText('perfil-info-tag', agent?.discordTag || currentDiscordUser.username || '—');
  _setText('perfil-info-placa', agent?.badge || '—');
  _setText('perfil-info-rango', rankMeta.label || '—');
  _setText('perfil-info-subdivision', subdivText);
  _setText('perfil-info-estado', agent?.status || '—');
  _setText('perfil-info-notas', agent?.notes || 'Sin notas de Jefatura.');

  // Awards
  const awardsEl = document.getElementById('perfil-info-awards');
  if (awardsEl) {
    const awards = agent?.awards || [];
    awardsEl.innerHTML = awards.length
      ? awards.map(a => `<span class="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-conthrax text-[10px] font-bold border border-amber-500/30 uppercase">${a}</span>`).join('')
      : '<span class="text-slate-500 text-xs font-conthrax">Sin condecoraciones</span>';
  }

  // Chief subdivision members
  if (isChief && agent?.division) {
    const subdivKey = Object.keys(SUBDIVISION_META).find(k => agent.division.includes(k)) || '';
    const members = roster.filter(a => a.discordId !== currentDiscordUser.id && a.division && a.division.includes(subdivKey));
    const membersEl = document.getElementById('chief-subdivision-members');
    if (membersEl) {
      membersEl.innerHTML = members.map(m => `
        <div class="flex items-center gap-2 p-2 rounded-lg bg-slate-900/60 border border-slate-800">
          <img src="${m.avatar||'https://cdn.discordapp.com/embed/avatars/0.png'}" class="w-7 h-7 rounded-full">
          <div class="flex-1 min-w-0">
            <p class="text-white text-xs font-bold truncate">${m.icName}</p>
            <p class="text-slate-500 text-[10px]">${m.badge}</p>
          </div>
          <span class="text-[10px] font-conthrax ${m.subdivisionRole==='jefe'?'text-blue-300 font-bold':'text-slate-500'}">${m.subdivisionRole||'miembro'}</span>
        </div>
      `).join('') || '<p class="text-slate-500 text-xs font-conthrax col-span-2">Sin otros miembros.</p>';
    }
  }
}

function _setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

// ============================================================
// PERFIL — FALTAS (SOLO VER)
// ============================================================

function renderPerfilFaltas() {
  const container = document.getElementById('perfil-faltas-list');
  if (!container || !currentDiscordUser) return;
  const faltas = dbGetFaltas(currentDiscordUser.id);
  if (!faltas.length) {
    container.innerHTML = '<p class="text-slate-500 py-4 text-center">Sin faltas o sanciones registradas. ✅</p>';
    return;
  }
  const levelBadges = {
    'leve': '<span class="px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-300 font-bold border border-yellow-500/30 text-[10px]">LEVE</span>',
    'grave': '<span class="px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 font-bold border border-orange-500/30 text-[10px]">GRAVE</span>',
    'muy_grave': '<span class="px-2 py-0.5 rounded bg-red-500/20 text-red-300 font-bold border border-red-500/30 text-[10px]">MUY GRAVE</span>'
  };
  container.innerHTML = faltas.map(f => `
    <div class="p-3 rounded-xl bg-amber-900/20 border border-amber-500/30">
      <div class="flex items-center justify-between mb-1">
        <div class="flex items-center gap-2">
          ${levelBadges[f.level] || levelBadges['leve']}
          <span class="text-amber-300 font-bold text-xs uppercase">${f.type || 'Sanción'}</span>
        </div>
        <span class="text-[10px] text-slate-500">${f.date ? new Date(f.date).toLocaleDateString('es-ES') : '—'}</span>
      </div>
      <p class="text-white text-xs">${f.description || '—'}</p>
      <p class="text-slate-500 text-[10px] mt-1">Impuesta por: ${f.commander || 'Jefatura'}</p>
    </div>
  `).join('');
}

// ============================================================
// PERFIL — MIS INFORMES (propios, con edición)
// ============================================================

function renderPerfilMisInformes() {
  const container = document.getElementById('perfil-mis-informes-list');
  if (!container || !currentDiscordUser) return;
  const all = getConfidentialReports();
  const mine = all.filter(r => r.authorId === currentDiscordUser.id);
  if (!mine.length) {
    container.innerHTML = '<p class="text-slate-500 py-4 text-center">Aún no has redactado ningún informe.</p>';
    return;
  }
  container.innerHTML = mine.map(r => `
    <div class="glass-panel p-4 rounded-xl border border-slate-800 flex items-start justify-between gap-3">
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 mb-1 flex-wrap">
          <span class="text-[10px] font-conthrax text-red-400 font-bold">${r.code || 'INF'}</span>
          <span class="font-bold text-white text-xs truncate">${r.title}</span>
        </div>
        <p class="text-slate-400 text-[11px] line-clamp-2">${r.summary || ''}</p>
        <p class="text-slate-500 text-[10px] mt-1">${r.date || ''}</p>
      </div>
      <div class="flex gap-1 shrink-0">
        <button onclick="openEditOwnReport('${r.id}')" class="px-2 py-1.5 rounded bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/30 text-blue-300 font-conthrax text-[10px] uppercase transition-all flex items-center gap-1">
          <i data-lucide="pencil" class="w-3 h-3"></i>
        </button>
      </div>
    </div>
  `).join('');
  lucide?.createIcons();
}

window.openEditOwnReport = function(reportId) {
  // Check the report belongs to current user
  const report = getConfidentialReports().find(r => r.id === reportId);
  if (!report) return;
  if (report.authorId !== currentDiscordUser?.id && !hasPermission('edit_reports')) {
    showToast('⛔ Solo puedes editar tus propios informes.');
    return;
  }
  // Reuse existing edit modal
  openConfidentialReportModal(report);
};

// ============================================================
// PERFIL — CHAT CON JEFATURA
// ============================================================

function renderPerfilChat() {
  const container = document.getElementById('perfil-chat-messages');
  if (!container || !currentDiscordUser) return;
  const threadKey = [currentDiscordUser.id, 'jefatura'].sort().join('_');
  const msgs = (CACHE.messages?.[threadKey] || []).sort((a,b) => new Date(a.created_at)-new Date(b.created_at));

  if (!msgs.length) {
    container.innerHTML = '<p class="text-slate-500 text-xs py-4 text-center mx-auto">Sin mensajes con Jefatura aún. Escribe tu consulta aquí.</p>';
    return;
  }
  container.innerHTML = msgs.map(m => {
    const isMine = m.from_id === currentDiscordUser.id;
    return `
      <div class="p-2.5 rounded-xl max-w-[80%] ${isMine ? 'self-end bg-cyan-900/30 border border-cyan-500/20 ml-auto' : 'self-start bg-amber-900/20 border border-amber-500/20'}">
        <p class="text-[10px] text-slate-500 mb-0.5">${isMine ? 'Tú' : '👑 Jefatura'} • ${new Date(m.created_at).toLocaleString('es-ES',{hour:'2-digit',minute:'2-digit'})}</p>
        <p class="text-white text-xs">${m.content}</p>
      </div>
    `;
  }).join('');
  container.scrollTop = container.scrollHeight;
}

window.sendPerfilChatMessage = async function() {
  if (!currentDiscordUser) { openDiscordAuthModal(); return; }
  const inp = document.getElementById('perfil-chat-input');
  const content = inp?.value.trim();
  if (!content) return;

  await dbSendMessage(currentDiscordUser.id, 'jefatura', content);
  if (inp) inp.value = '';
  renderPerfilChat();
  showToast('✉️ Mensaje enviado a Jefatura.');
};

// ============================================================
// JEFATURA — APARTADO COMPLETO DE GESTIÓN DE FALTAS Y SANCIONES
// ============================================================

function renderJefaturaFaltasTab() {
  const container = document.getElementById('jef-faltas-list');
  if (!container) return;

  const roster = getJefaturaRoster();
  const search = (document.getElementById('jef-faltas-search')?.value || '').toLowerCase().trim();
  const levelFilter = document.getElementById('jef-faltas-level-filter')?.value || 'all';

  // Recopilar todas las faltas de todos los agentes
  const allFaltas = [];
  roster.forEach(agent => {
    const faltas = dbGetFaltas(agent.discordId);
    faltas.forEach(f => {
      allFaltas.push({
        ...f,
        agentDiscordId: agent.discordId,
        agentName: agent.icName,
        agentBadge: agent.badge,
        agentAvatar: agent.avatar
      });
    });
  });

  // Filtrado
  const filtered = allFaltas.filter(item => {
    const matchesSearch = !search ||
      item.agentName.toLowerCase().includes(search) ||
      (item.description || '').toLowerCase().includes(search) ||
      (item.type || '').toLowerCase().includes(search);
    const matchesLevel = levelFilter === 'all' || item.level === levelFilter;
    return matchesSearch && matchesLevel;
  });

  if (!filtered.length) {
    container.innerHTML = '<p class="text-slate-500 py-6 text-center text-xs">No hay faltas registradas con los filtros actuales. ✅</p>';
    return;
  }

  const levelBadges = {
    'leve': '<span class="px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-300 font-bold border border-yellow-500/30 text-[10px]">LEVE</span>',
    'grave': '<span class="px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 font-bold border border-orange-500/30 text-[10px]">GRAVE</span>',
    'muy_grave': '<span class="px-2 py-0.5 rounded bg-red-500/20 text-red-300 font-bold border border-red-500/30 text-[10px]">MUY GRAVE</span>'
  };

  container.innerHTML = filtered.map(item => `
    <div class="glass-panel p-4 rounded-xl border border-slate-800 hover:border-red-500/40 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <div class="flex items-start gap-3 flex-1 min-w-0">
        <img src="${item.agentAvatar || 'https://cdn.discordapp.com/embed/avatars/0.png'}" class="w-10 h-10 rounded-xl object-cover shrink-0 border border-slate-700">
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 flex-wrap mb-1">
            <span class="text-white font-bold text-xs">${item.agentName}</span>
            <span class="text-slate-500 text-[10px]">${item.agentBadge}</span>
            ${levelBadges[item.level] || levelBadges['leve']}
            <span class="text-red-400 font-bold text-[10px] uppercase">• ${item.type || 'Sanción'}</span>
          </div>
          <p class="text-slate-300 text-xs font-mono mb-1 leading-relaxed">${item.description || 'Sin descripción'}</p>
          <div class="flex items-center gap-3 text-[10px] text-slate-500">
            <span>Fecha: <strong class="text-slate-400">${item.date ? new Date(item.date).toLocaleDateString('es-ES') : '—'}</strong></span>
            <span>Impuesta por: <strong class="text-slate-400">${item.commander || 'Jefatura'}</strong></span>
          </div>
        </div>
      </div>
      <div class="flex items-center gap-2 shrink-0 self-end sm:self-center">
        <button onclick="openEditFaltaModal('${item.agentDiscordId}', '${item.id}')" class="px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/30 text-blue-300 font-bold uppercase text-[10px] transition-all flex items-center gap-1">
          <i data-lucide="edit-3" class="w-3.5 h-3.5"></i> Editar
        </button>
        <button onclick="confirmDeleteFalta('${item.agentDiscordId}', '${item.id}', '${item.agentName.replace(/'/g, "\\'")}')" class="px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900 border border-red-500/30 text-red-300 font-bold uppercase text-[10px] transition-all flex items-center gap-1">
          <i data-lucide="trash-2" class="w-3.5 h-3.5"></i> Quitar
        </button>
      </div>
    </div>
  `).join('');

  if (window.lucide) window.lucide.createIcons();
}

function _populateFaltaAgentSelect(selectedId) {
  const select = document.getElementById('falta-modal-agent-select');
  if (!select) return;
  const roster = getJefaturaRoster();
  select.innerHTML = roster.map(a => `
    <option value="${a.discordId}" ${a.discordId === selectedId ? 'selected' : ''}>
      ${a.icName} (${a.badge}) — ${a.discordId}
    </option>
  `).join('');
}

window.openNewFaltaModal = function(preselectedAgentId) {
  if (!hasPermission('manage_roster')) { showToast('⛔ No tienes permiso para imponer sanciones.'); return; }
  const modal = document.getElementById('falta-modal');
  if (!modal) return;

  _populateFaltaAgentSelect(preselectedAgentId || '');
  document.getElementById('falta-modal-title').textContent = 'Registrar Falta Disciplinaria';
  document.getElementById('falta-modal-subtitle').textContent = 'Régimen sancionador de la Detective Division';
  document.getElementById('falta-modal-falta-id').value = '';
  document.getElementById('falta-modal-type').value = '';
  document.getElementById('falta-modal-description').value = '';
  document.getElementById('falta-modal-level').value = 'leve';
  document.getElementById('falta-modal-agent-select').disabled = false;
  document.getElementById('falta-modal-delete-btn').classList.add('hidden');

  modal.classList.remove('hidden');
  if (window.lucide) window.lucide.createIcons();
};

window.openAddFaltaModal = function(agentDiscordId) {
  window.openNewFaltaModal(agentDiscordId);
};

window.openEditFaltaModal = function(agentDiscordId, faltaId) {
  if (!hasPermission('manage_roster')) { showToast('⛔ Sin permiso.'); return; }
  const modal = document.getElementById('falta-modal');
  if (!modal) return;

  const faltas = dbGetFaltas(agentDiscordId);
  const falta = faltas.find(f => f.id === faltaId);
  if (!falta) return;

  _populateFaltaAgentSelect(agentDiscordId);
  document.getElementById('falta-modal-title').textContent = 'Modificar Sanción / Falta';
  document.getElementById('falta-modal-subtitle').textContent = `Falta ID: ${faltaId}`;
  document.getElementById('falta-modal-agent-id').value = agentDiscordId;
  document.getElementById('falta-modal-falta-id').value = faltaId;
  document.getElementById('falta-modal-type').value = falta.type || '';
  document.getElementById('falta-modal-description').value = falta.description || '';
  document.getElementById('falta-modal-level').value = falta.level || 'leve';
  document.getElementById('falta-modal-agent-select').value = agentDiscordId;
  document.getElementById('falta-modal-agent-select').disabled = true;
  document.getElementById('falta-modal-delete-btn').classList.remove('hidden');

  modal.classList.remove('hidden');
  if (window.lucide) window.lucide.createIcons();
};

window.saveFaltaModal = async function(event) {
  if (event) event.preventDefault();
  if (!hasPermission('manage_roster')) { showToast('⛔ Sin permiso.'); return; }

  const faltaId = document.getElementById('falta-modal-falta-id').value.trim();
  const agentId = document.getElementById('falta-modal-agent-select').value;
  const level = document.getElementById('falta-modal-level').value;
  const type = document.getElementById('falta-modal-type').value.trim();
  const description = document.getElementById('falta-modal-description').value.trim();

  if (!agentId || !type || !description) {
    showToast('⚠️ Completa el tipo y motivo de la falta.');
    return;
  }

  const agent = getJefaturaRoster().find(a => a.discordId === agentId);
  const agentName = agent ? agent.icName : agentId;

  if (faltaId) {
    // Modo edición
    await dbUpdateFalta(agentId, faltaId, {
      level,
      type,
      description,
      commander: currentDiscordUser?.username || 'Jefatura'
    });
    addAuditLog('FALTA MODIFICADA', agentName, agentId, `Nivel: ${level.toUpperCase()} // ${type}: ${description}`, currentDiscordUser?.username);
    showToast(`✅ Falta de ${agentName} actualizada.`);
  } else {
    // Modo creación
    await dbAddFalta(agentId, {
      level,
      type,
      description,
      commander: currentDiscordUser?.username || 'Jefatura'
    });
    addAuditLog('FALTA IMPUESTA', agentName, agentId, `Nivel: ${level.toUpperCase()} // ${type}: ${description}`, currentDiscordUser?.username);
    showToast(`⚠️ Falta nivel ${level.toUpperCase()} registrada para ${agentName}.`);
  }

  closeModal('falta-modal');
  renderJefaturaFaltasTab();
  if (typeof renderPerfilFaltas === 'function') renderPerfilFaltas();
  if (typeof renderMiPerfil === 'function') renderMiPerfil();
};

window.deleteFaltaFromModal = async function() {
  const agentId = document.getElementById('falta-modal-agent-id').value;
  const faltaId = document.getElementById('falta-modal-falta-id').value;
  if (!agentId || !faltaId) return;

  if (!confirm('¿Estás seguro de retirar y anular esta sanción del expediente?')) return;

  await dbRemoveFalta(agentId, faltaId);
  addAuditLog('FALTA RETIRADA', agentId, '', `Falta ${faltaId} anulada`, currentDiscordUser?.username);
  closeModal('falta-modal');
  renderJefaturaFaltasTab();
  if (typeof renderPerfilFaltas === 'function') renderPerfilFaltas();
  if (typeof renderMiPerfil === 'function') renderMiPerfil();
  showToast('🗑️ Falta eliminada del expediente.');
};

window.confirmDeleteFalta = async function(agentId, faltaId, agentName) {
  if (!confirm(`¿Deseas retirar y anular la falta aplicada a ${agentName}?`)) return;
  await dbRemoveFalta(agentId, faltaId);
  addAuditLog('FALTA RETIRADA', agentName, agentId, `Falta ${faltaId} anulada`, currentDiscordUser?.username);
  renderJefaturaFaltasTab();
  if (typeof renderPerfilFaltas === 'function') renderPerfilFaltas();
  if (typeof renderMiPerfil === 'function') renderMiPerfil();
  showToast(`🗑️ Falta de ${agentName} retirada.`);
};

// ============================================================
// SUBDIVISION CHIEF — MODALES SOLICITUD
// ============================================================

window.openChiefAddAgentModal = function() {
  if (!currentDiscordUser) return;
  const agent = getJefaturaRoster().find(a => a.discordId === currentDiscordUser.id);
  if (!agent || agent.subdivisionRole !== 'jefe') { showToast('⛔ Solo jefes de subdivisión.'); return; }

  const discordId  = prompt('Discord ID del nuevo agente:');
  if (!discordId) return;
  const icName     = prompt('Nombre IC del agente:');
  if (!icName) return;
  const badge      = prompt('Número de Placa (#XXX):');
  const reason     = prompt('Motivo de la solicitud de alta:') || '';

  const subdivKey = Object.keys(SUBDIVISION_META).find(k => agent.division.includes(k)) || '';
  const newAgentData = {
    discordId, discordTag: '', icName, badge: badge || '#---',
    rank: 'det1', division: agent.division, subdivisionRole: 'miembro',
    status: 'Pendiente', awards: [], notes: 'Pendiente de aprobación por Jefatura.',
    avatar: `https://cdn.discordapp.com/embed/avatars/${Math.floor(Math.random()*6)}.png`,
    joinDate: new Date().toLocaleDateString('es-ES',{day:'2-digit',month:'short',year:'numeric'}).toUpperCase()
  };

  dbSubmitSolicitud({
    type: 'alta', chiefId: currentDiscordUser.id, chiefName: agent.icName,
    subdivision: subdivKey || agent.division,
    agentId: discordId, agentName: icName, agentData: newAgentData, reason
  }).then(() => showToast('📥 Solicitud de alta enviada a Jefatura para aprobación.'));
};

window.openChiefRemoveAgentModal = function() {
  if (!currentDiscordUser) return;
  const myAgent = getJefaturaRoster().find(a => a.discordId === currentDiscordUser.id);
  if (!myAgent || myAgent.subdivisionRole !== 'jefe') { showToast('⛔ Solo jefes de subdivisión.'); return; }

  const subdivKey = Object.keys(SUBDIVISION_META).find(k => myAgent.division.includes(k)) || '';
  const myMembers = getJefaturaRoster().filter(a =>
    a.discordId !== currentDiscordUser.id && a.division && a.division.includes(subdivKey)
  );
  if (!myMembers.length) { showToast('⚠️ No tienes miembros en tu subdivisión.'); return; }

  const names = myMembers.map((a,i) => `${i+1}. ${a.icName} (${a.badge})`).join('\n');
  const idx = parseInt(prompt(`Miembros de ${subdivKey}:\n${names}\n\nNúmero del agente a dar de baja:`));
  if (isNaN(idx) || idx < 1 || idx > myMembers.length) return;

  const target = myMembers[idx-1];
  const reason = prompt(`Motivo de baja de ${target.icName}:`) || '';

  dbSubmitSolicitud({
    type: 'baja', chiefId: currentDiscordUser.id, chiefName: myAgent.icName,
    subdivision: subdivKey, agentId: target.discordId, agentName: target.icName,
    agentData: null, reason
  }).then(() => showToast('📤 Solicitud de baja enviada a Jefatura para aprobación.'));
};

window.openAnnouncementModal = function() {
  if (!currentDiscordUser) return;
  const agent = getJefaturaRoster().find(a => a.discordId === currentDiscordUser.id);
  if (!agent || (agent.subdivisionRole !== 'jefe' && !hasPermission('manage_roster'))) {
    showToast('⛔ Solo jefes o Jefatura pueden crear anuncios.');
    return;
  }
  const title   = prompt('Título del anuncio:');
  if (!title) return;
  const content = prompt('Contenido del anuncio:');
  if (!content) return;

  // Store as a "pinned report" with type=anuncio
  const subdivKey = Object.keys(SUBDIVISION_META).find(k => (agent.division||'').includes(k)) || 'GENERAL';
  const announceReport = {
    id: 'ann_' + Date.now(),
    code: `ANU-${subdivKey}-${Date.now().toString().slice(-4)}`,
    title, summary: content,
    classification: 'ANUNCIO',
    subdivision: subdivKey,
    authorId: currentDiscordUser.id,
    author: agent.icName,
    date: new Date().toLocaleDateString('es-ES',{day:'2-digit',month:'short',year:'numeric'}).toUpperCase(),
    pinned: false,
    type: 'anuncio'
  };
  const reports = getConfidentialReports();
  reports.unshift(announceReport);
  saveConfidentialReports(reports);
  dbUpsertReport(announceReport);
  showToast(`📢 Anuncio publicado en ${subdivKey}`);
  renderPerfilMisInformes();
};

// ============================================================
// PERMISSIONS EXTENSION: allow owner of report to edit
// ============================================================
// Extend hasPermission: 'edit_own_report' always true if logged in
const _origHasPermission = hasPermission;
// We shadow it only for specific keys
function hasPermissionExtended(permKey, context) {
  if (permKey === 'edit_own_report') {
    return Boolean(currentDiscordUser); // any logged-in user can edit their own
  }
  return _origHasPermission(permKey);
}

// ============================================================
// JEFATURA TAB — Falta button in roster cards
// ============================================================
// Inject "Añadir Falta" button in agent cards when in jefatura
const _origRenderJefaturaRoster = window.renderJefaturaRoster;
window.renderJefaturaRoster = function(roster) {
  if (_origRenderJefaturaRoster) _origRenderJefaturaRoster(roster);
  // After rendering, inject falta buttons
  if (!hasPermission('manage_roster')) return;
  setTimeout(() => {
    const cards = document.querySelectorAll('#jefatura-roster-grid .agent-card-actions, #jefatura-roster-grid [data-agent-id]');
    // We'll add buttons via the existing openAgentEditor flow instead
  }, 100);
};

// ============================================================
// UPDATEUI INTEGRATION: render Mi Perfil on auth change
// ============================================================
const _origUpdateDiscordAuthUI = updateDiscordAuthUI;
// Monkey-patch to also refresh Mi Perfil and load messages
const __originalUpdateDiscordAuthUI = updateDiscordAuthUI;
// We add it at the bottom of updateDiscordAuthUI via DOMContentLoaded patch

// ============================================================
// INIT: Load messages on startup
// ============================================================
document.addEventListener('DOMContentLoaded', async () => {
  // Load messages from cache/db
  await dbLoadAllJefaturaMessages();
  // Render Mi Perfil
  renderMiPerfil();
  // Refresh solicitudes badge
  const sols = dbGetSolicitudes().filter(s => s.status === 'pendiente');
  const badge = document.getElementById('solicitudes-badge');
  if (badge) { badge.textContent = sols.length; badge.classList.toggle('hidden', sols.length === 0); }
}, { once: true });

// Hook into updateDiscordAuthUI to also refresh Mi Perfil
function _refreshPerfilAndMessages() {
  renderMiPerfil();
  renderSolicitudesList();
  // Refresh unread messages badge
  const threadKey = currentDiscordUser ? [currentDiscordUser.id, 'jefatura'].sort().join('_') : null;
  if (threadKey) {
    const unread = (CACHE.messages?.[threadKey] || []).filter(m => m.to_id === currentDiscordUser?.id && !m.read).length;
    const badge = document.getElementById('mensajes-badge-jef');
    if (badge) { badge.textContent = unread; badge.classList.toggle('hidden', unread === 0); }
  }
}

// Patch: append to updateDiscordAuthUI
const __patchedUpdate = updateDiscordAuthUI;
window.updateDiscordAuthUI = function() {
  __patchedUpdate();
  _refreshPerfilAndMessages();
};
