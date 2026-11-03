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
  localStorage.setItem("dd_custom_cases", JSON.stringify(list));
}

// --- APP CONTROLLER ---
document.addEventListener("DOMContentLoaded", () => {
  initDiscordAuth();
  initClock();
  renderCases(getActiveCasesList());
  renderMostWanted(MOST_WANTED);
  setupCaseFilters();
  setupTipForm();
  setupInformesHub();
  setupAudioControls();
  setupInteractiveModals();
  setupSidebar();
  setupScrollSpy();
  setupReportEditor();
  setupJefaturaSearch();
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
  // Check if returning from Discord OAuth2 redirect
  const hasToken = await checkDiscordOAuthCallback();
  if (hasToken) return;

  const saved = localStorage.getItem("dd_discord_user");
  if (saved) {
    try {
      currentDiscordUser = JSON.parse(saved);
      isDetectiveAuth = Boolean(currentDiscordUser && currentDiscordUser.isAuthorizedDetective);
    } catch (e) {
      currentDiscordUser = null;
      isDetectiveAuth = false;
    }
  }
  updateDiscordAuthUI();
}

async function checkDiscordOAuthCallback() {
  let token = null;

  if (window.location.hash && window.location.hash.includes("access_token")) {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    token = hashParams.get("access_token");
  } else if (window.location.search && window.location.search.includes("access_token")) {
    const searchParams = new URLSearchParams(window.location.search);
    token = searchParams.get("access_token");
  }

  if (token) {
    localStorage.setItem("dd_discord_token", token);
    try {
      window.history.replaceState({}, document.title, window.location.pathname + "#informes");
    } catch (e) {}

    await fetchDiscordUserProfile(token);
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
        isAuthorizedDetective: rankMeta.level >= 1,
        isHighCommand: rankMeta.level >= 4,
        clearance: rankMeta.clearance,
        avatar: avatarUrl,
        oauthVerified: true,
        rosterAgent: existingAgent,
        authAt: new Date().toLocaleString('es-ES')
      };
      isDetectiveAuth = rankMeta.level >= 1;
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
      roster.push(newAgent);
      saveJefaturaRoster(roster);
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
    showToast(`✅ Verificado con Discord OAuth2: ¡Bienvenido ${displayName}!`);
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

  if (isDetectiveAuth && currentDiscordUser) {
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
  } else if (currentDiscordUser && !isDetectiveAuth && currentDiscordUser.rankKey === "aspirante") {
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

  // Update Jefatura section UI
  updateJefaturaUI();
}

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
    isHighCommand: profile.rankLevel >= 4,
    authAt: new Date().toLocaleString('es-ES')
  };
  isDetectiveAuth = profile.isAuthorizedDetective;
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
  if (!isDetectiveAuth) {
    showToast("🔒 Debes autenticarte con tu Discord de oficial para modificar informes.");
    openDiscordAuthModal();
    return;
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
    if (deleteBtn) deleteBtn.classList.remove("hidden");

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
  } else {
    cases.unshift(updatedCase);
    showToast(`✅ Nuevo expediente ${id} registrado en el archivo policial.`);
  }

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
  if (!currentEditingCaseId) return;
  if (!confirm(`¿Está seguro de eliminar permanentemente el expediente ${currentEditingCaseId}?`)) return;

  const cases = getActiveCasesList();
  const filtered = cases.filter(item => item.id !== currentEditingCaseId);
  saveCasesList(filtered);

  audioEngine.playRadioBeep();
  closeReportEditor();
  closeModal("case-modal");
  renderCases(getActiveCasesList());
  showToast(`🗑️ Expediente ${currentEditingCaseId} eliminado del archivo.`);
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
          ${isDetectiveAuth ? `
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
        ${isDetectiveAuth ? `
          <button onclick="openReportEditor('${c.id}')" class="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider font-conthrax rounded-lg transition-colors flex items-center gap-1.5 shadow">
            <i data-lucide="edit-3" class="w-3.5 h-3.5"></i> Modificar Informe
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

// --- RENDER MOST WANTED ---
function renderMostWanted(list) {
  const container = document.getElementById("most-wanted-grid");
  if (!container) return;

  container.innerHTML = "";

  list.forEach(w => {
    const card = document.createElement("div");
    card.className = "glass-panel-gold rounded-xl overflow-hidden border border-amber-500/30 flex flex-col justify-between group";

    card.innerHTML = `
      <div>
        <div class="relative h-60 w-full overflow-hidden bg-slate-950">
          <img src="${w.photo}" alt="${w.name}" class="w-full h-full object-cover filter grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500">
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
          
          <div class="absolute top-3 left-3">
            <span class="stamp-classified text-xs">BUSCADO // SE BUSCA</span>
          </div>

          <div class="absolute top-3 right-3 font-mono text-xs font-extrabold px-2.5 py-1 rounded border ${w.dangerColor}">
            ${w.dangerLevel}
          </div>

          <div class="absolute bottom-3 left-4 right-4">
            <p class="text-xs font-conthrax text-amber-400 tracking-wider">ALIAS: "${w.alias}"</p>
            <h3 class="text-2xl font-black text-white font-gobold tracking-wide">${w.name}</h3>
          </div>
        </div>

        <div class="p-5 space-y-3">
          <div class="bg-amber-500/10 border border-amber-500/30 rounded-lg p-2.5 flex items-center justify-between">
            <span class="text-xs font-conthrax text-slate-300">RECOMPENSA OFRECIDA:</span>
            <span class="text-lg font-conthrax font-black text-amber-400">${w.bounty}</span>
          </div>

          <div>
            <span class="text-xs font-mono text-slate-400 uppercase block mb-1">Cargos Imputados:</span>
            <p class="text-xs text-slate-200 font-mono bg-slate-950/60 p-2.5 rounded border border-slate-800 leading-relaxed">${w.charges}</p>
          </div>

          <div>
            <span class="text-xs font-mono text-slate-400 uppercase block mb-1">Última Ubicación Conocida:</span>
            <p class="text-xs text-red-300 font-mono flex items-center gap-1.5">
              <i data-lucide="crosshair" class="w-3.5 h-3.5 text-red-400"></i> ${w.lastSeen}
            </p>
          </div>

          <p class="text-slate-400 text-xs italic border-l-2 border-amber-500/40 pl-2 mt-2">${w.notes}</p>
        </div>
      </div>

      <div class="p-5 pt-0">
        <button onclick="reportWantedTarget('${w.name}', '${w.alias}')" class="w-full py-2.5 bg-red-600/90 hover:bg-red-500 text-white font-mono font-bold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-red-950/50">
          <i data-lucide="send" class="w-4 h-4"></i> Aportar Información Anónima
        </button>
      </div>
    `;

    container.appendChild(card);
  });

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

    // Store in localStorage
    const savedTips = JSON.parse(localStorage.getItem("lspd_rp_tips") || "[]");
    savedTips.unshift(tipData);
    localStorage.setItem("lspd_rp_tips", JSON.stringify(savedTips));

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
  localStorage.setItem("dd_confidential_reports", JSON.stringify(list));
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

window.openConfidentialReport = function(reportId) {
  audioEngine.playKeyClick();
  const all = getActiveConfidentialReports();
  const report = all.find(r => r.id === reportId);
  if (!report) return;

  const modal = document.getElementById("confidential-report-modal");
  if (!modal) return;

  document.getElementById("view-conf-code").textContent = report.id;
  document.getElementById("view-conf-title").textContent = report.title;
  document.getElementById("view-conf-status").textContent = report.status;
  document.getElementById("view-conf-clearance").textContent = report.clearance;
  document.getElementById("view-conf-author").textContent = report.leadDetective;
  document.getElementById("view-conf-date").textContent = report.date;
  document.getElementById("view-conf-summary").textContent = report.summary;

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
  if (!isDetectiveAuth) {
    showToast("🔒 Acceso exclusivo para detectives verificados por Discord.");
    openDiscordAuthModal();
    return;
  }
  audioEngine.playKeyClick();
  const modal = document.getElementById("new-confidential-report-modal");
  if (modal) {
    modal.classList.remove("hidden");
    lucide.createIcons();
  }
};

window.saveNewConfidentialReport = function(event) {
  if (event) event.preventDefault();
  const title = document.getElementById("new-conf-title")?.value.trim();
  const category = document.getElementById("new-conf-category")?.value || "vigilancia";
  const summary = document.getElementById("new-conf-summary")?.value.trim();
  const evidenceRaw = document.getElementById("new-conf-evidence")?.value.trim();

  if (!title || !summary) {
    showToast("⚠️ Ingrese al menos título y sumario de los hechos.");
    return;
  }

  const evidence = evidenceRaw ? evidenceRaw.split("\n").map(l => l.trim()).filter(Boolean) : [];
  const reports = getActiveConfidentialReports();
  const newId = "INF-CONF-2026-" + String(reports.length + 1).padStart(2, '0');

  const newReport = {
    id: newId,
    title,
    category,
    status: "REGISTRADO // EN REVISIÓN",
    statusType: "active",
    clearance: currentDiscordUser ? currentDiscordUser.clearance : "NIVEL 2 (CONFIDENCIAL)",
    leadDetective: currentDiscordUser ? `${currentDiscordUser.username} (${currentDiscordUser.badge})` : "Det. Asignado",
    date: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase(),
    summary,
    evidence
  };

  reports.unshift(newReport);
  saveConfidentialReports(reports);

  audioEngine.playAlertSound();
  closeModal("new-confidential-report-modal");
  renderConfidentialReports(getActiveConfidentialReports());
  showToast(`✅ Informe confidencial ${newId} archivado con éxito.`);
};

function renderAuthorizedTipsInbox() {
  const container = document.getElementById("authorized-tips-inbox");
  if (!container) return;

  const tips = JSON.parse(localStorage.getItem("lspd_rp_tips") || "[]");

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
        <span class="text-slate-400">${t.date}</span>
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
// --- JEFATURA DE DIVISIÓN // HIGH COMMAND MANAGEMENT ENGINE ---
// =============================================================================

// --- RANK METADATA TABLE ---
const RANK_META = {
  capitan:   { label: "Capitán de División",         level: 5, clearance: "NIVEL 5 // COMANDO SUPREMO",       cssClass: "rank-badge-capitan",   icon: "👑", color: "amber"  },
  teniente:  { label: "Teniente de División",         level: 4, clearance: "NIVEL 4 // SUPERVISIÓN OPERATIVA", cssClass: "rank-badge-teniente",  icon: "⭐", color: "blue"   },
  sgt:       { label: "Sargento de Detectives",       level: 3.5, clearance: "NIVEL 3.5 // MANDO DE TURNO",   cssClass: "rank-badge-sgt",       icon: "🔷", color: "cyan"   },
  det3:      { label: "Detective III",                level: 3, clearance: "NIVEL 3 // ALTO SECRETO",          cssClass: "rank-badge-det3",      icon: "🔵", color: "purple" },
  det2:      { label: "Detective II",                 level: 2, clearance: "NIVEL 2 // CONFIDENCIAL",          cssClass: "rank-badge-det2",      icon: "🟢", color: "emerald"},
  det1:      { label: "Detective I",                  level: 1, clearance: "NIVEL 1 // RESTRINGIDO",           cssClass: "rank-badge-det1",      icon: "⬜", color: "slate"  },
  aspirante: { label: "Aspirante / Sin Asignar",      level: 0, clearance: "NIVEL 0 // SIN ACCESO",            cssClass: "rank-badge-aspirante", icon: "🔴", color: "red"    }
};

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
    discordId:   "101928374650192831",
    discordTag:  "Cap.Vance#0101",
    icName:      "Cap. David Vance",
    badge:       "#101-DIV",
    rank:        "capitan",
    division:    "Mando Supremo // Bureau Executive",
    status:      "Activo",
    awards:      ["valor", "servicio", "merito"],
    notes:       "Comandante fundador de la Detective Division. 12 años de servicio activo.",
    avatar:      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80",
    joinDate:    "01/ENE/2024"
  },
  {
    discordId:   "201928374650192832",
    discordTag:  "J_Sterling#0201",
    icName:      "Tte. James Sterling",
    badge:       "#201-DIV",
    rank:        "teniente",
    division:    "RHD - Robos & Homicidios",
    status:      "Activo",
    awards:      ["servicio", "tirador"],
    notes:       "Supervisor de RHD e incursiones tácticas. Especialista en negociación de rehenes.",
    avatar:      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80",
    joinDate:    "15/MAR/2024"
  },
  {
    discordId:   "404928374650192833",
    discordTag:  "Marcus_Cole#0404",
    icName:      "Det. III Marcus Cole",
    badge:       "#404-DIV",
    rank:        "det3",
    division:    "GND - Narcóticos & Infiltración",
    status:      "Activo",
    awards:      ["valor"],
    notes:       "Líder de operaciones GND encubiertas. Especialización en infiltración de cárteles.",
    avatar:      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80",
    joinDate:    "20/ABR/2024"
  },
  {
    discordId:   "512928374650192834",
    discordTag:  "E_Rostova#0512",
    icName:      "Det. II Elena Rostova",
    badge:       "#512-DIV",
    rank:        "det2",
    division:    "RHD - Robos & Homicidios",
    status:      "Activo",
    awards:      ["merito"],
    notes:       "Especialista en homicidios calificados y peritaje balístico.",
    avatar:      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    joinDate:    "05/JUL/2024"
  },
  {
    discordId:   "522928374650192835",
    discordTag:  "S_Connor#0522",
    icName:      "Det. I Sarah Connor",
    badge:       "#522-DIV",
    rank:        "det1",
    division:    "CSI - Forense y Balística",
    status:      "Activo",
    awards:      [],
    notes:       "Detective de primera asignación. Excelentes resultados en las evaluaciones CSI.",
    avatar:      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80",
    joinDate:    "01/SEP/2024"
  }
];

function getJefaturaRoster() {
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
  localStorage.setItem("dd_jefatura_roster", JSON.stringify(list));
}

// --- AUDIT LOG STORAGE ---
function getAuditLogs() {
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
  const logs = getAuditLogs();
  logs.unshift({
    id: "LOG-" + Date.now(),
    action,
    agentName,
    discordTag,
    detail,
    commander: commander || (currentDiscordUser ? currentDiscordUser.username : "Sistema"),
    timestamp: new Date().toLocaleString('es-ES')
  });
  // Keep max 200 entries
  if (logs.length > 200) logs.splice(200);
  saveAuditLogs(logs);
}

// --- KPI & UI UPDATER ---
function updateJefaturaUI() {
  const isHighCmd = currentDiscordUser && currentDiscordUser.isHighCommand;
  const deniedView = document.getElementById("jefatura-denied-view");
  const authorizedView = document.getElementById("jefatura-authorized-view");

  if (!deniedView || !authorizedView) return;

  if (isHighCmd) {
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
  } else {
    deniedView.classList.remove("hidden");
    authorizedView.classList.add("hidden");

    // Show "Reclamar Mando" button only if user is logged in
    const claimBtn = document.getElementById("jefatura-claim-mando-btn");
    if (claimBtn) {
      claimBtn.style.display = currentDiscordUser ? "flex" : "none";
    }
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
  lucide.createIcons();
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
            <button 
              onclick="openAgentEditor('${agent.discordId}')" 
              class="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/30 text-amber-300 hover:text-amber-200 border border-amber-500/30 transition-all font-bold uppercase flex items-center gap-1"
              title="Editar Ficha del Agente"
            >
              <i data-lucide="edit-3" class="w-3 h-3"></i>
              Editar
            </button>
            <button 
              onclick="quickKickAgent('${agent.discordId}', '${agent.icName.replace(/'/g, "\\'")}')" 
              class="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-800/40 transition-all"
              title="Expulsar del Cuerpo"
            >
              <i data-lucide="user-x" class="w-3.5 h-3.5"></i>
            </button>
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
  if (!currentDiscordUser || !currentDiscordUser.isHighCommand) {
    showToast("⛔ Solo el Mando puede editar fichas de agentes.");
    return;
  }
  audioEngine.playKeyClick();

  const roster = getJefaturaRoster();
  const agent = roster.find(a => a.discordId === discordId);
  if (!agent) return;

  currentEditingAgentId = discordId;

  const modal = document.getElementById("agent-editor-modal");
  if (!modal) return;

  // Populate form fields
  document.getElementById("edit-agent-user-id").value        = agent.discordId;
  document.getElementById("edit-agent-icname").value         = agent.icName || "";
  document.getElementById("edit-agent-badge").value          = agent.badge || "";
  document.getElementById("edit-agent-rank").value           = agent.rank || "aspirante";
  document.getElementById("edit-agent-division").value       = agent.division || "Sin Asignar // En Evaluación";
  document.getElementById("edit-agent-status").value         = agent.status || "Pendiente";
  document.getElementById("edit-agent-discord-tag").value    = agent.discordTag || "";
  document.getElementById("edit-agent-notes").value          = agent.notes || "";
  document.getElementById("edit-agent-discord-sub").textContent = `Discord ID: ${agent.discordId}`;

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

  modal.classList.remove("hidden");
  lucide.createIcons();
};

window.saveAgentEditor = function(event) {
  if (event) event.preventDefault();
  if (!currentDiscordUser || !currentDiscordUser.isHighCommand) return;

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
    awards
  };

  saveJefaturaRoster(roster);

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
      isAuthorizedDetective: rankData.level >= 1,
      isHighCommand:       rankData.level >= 4,
      clearance:           rankData.clearance
    };
    isDetectiveAuth = rankData.level >= 1;
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
  if (!currentDiscordUser || !currentDiscordUser.isHighCommand) {
    showToast("⛔ Solo el Mando puede expulsar agentes.");
    return;
  }
  audioEngine.playAlertSound();

  const roster = getJefaturaRoster();
  const idx = roster.findIndex(a => a.discordId === discordId);
  if (idx === -1) return;

  roster[idx].status = "Expulsado";
  roster[idx].rank   = "aspirante"; // Revoke all access

  saveJefaturaRoster(roster);
  addAuditLog("EXPULSIÓN DEL CUERPO", icName, roster[idx].discordTag, "Baja definitiva. Acceso revocado.", currentDiscordUser.username);

  showToast(`🚨 ${icName} ha sido expulsado/a de la Detective Division.`);
  renderJefaturaKPIs();
  renderJefaturaRoster(getJefaturaRoster());
};

// --- ADD AGENT MODAL ---
window.openAddAgentModal = function() {
  if (!currentDiscordUser || !currentDiscordUser.isHighCommand) {
    showToast("⛔ Solo el Mando puede incorporar nuevos agentes.");
    return;
  }
  audioEngine.playKeyClick();
  const modal = document.getElementById("add-agent-modal");
  if (modal) {
    // Reset form
    const form = document.getElementById("add-agent-form");
    if (form) form.reset();
    modal.classList.remove("hidden");
    lucide.createIcons();
  }
};

window.saveNewAgent = function(event) {
  if (event) event.preventDefault();
  if (!currentDiscordUser || !currentDiscordUser.isHighCommand) return;

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
  addAuditLog("INCORPORACIÓN AL CENSO", icName, discordTag, `Rango: ${rankData.label} // División: ${division}`, currentDiscordUser.username);

  closeModal("add-agent-modal");
  audioEngine.playAlertSound();
  showToast(`✅ ${icName} (${badge}) incorporado/a al censo de la División.`);
  renderJefaturaKPIs();
  renderJefaturaRoster(getJefaturaRoster());
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
  } else {
    // Add as Capitán
    roster.unshift({
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
    });
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
    "REGISTRO AUTOMÁTICO":     "text-slate-400 border-slate-600/30 bg-slate-800/30"
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
  if (!currentDiscordUser || !currentDiscordUser.isHighCommand) {
    showToast("⛔ Solo el Mando puede limpiar el historial de auditoría.");
    return;
  }
  saveAuditLogs([]);
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

  const order = ["capitan", "teniente", "sgt", "det3", "det2", "det1", "aspirante"];
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
  if (!currentDiscordUser || !currentDiscordUser.isHighCommand) {
    showToast("⛔ Solo el Mando puede restablecer el censo.");
    return;
  }
  saveJefaturaRoster(JSON.parse(JSON.stringify(DEFAULT_ROSTER)));
  addAuditLog("RESTABLECIMIENTO DEL CENSO", "Sistema", "Sistema", "Censo restablecido a valores predeterminados de ejemplo", currentDiscordUser.username);
  audioEngine.playAlertSound();
  showToast("🔄 Censo restablecido a los datos de ejemplo.");
  renderJefaturaKPIs();
  renderJefaturaRoster(getJefaturaRoster());
};
