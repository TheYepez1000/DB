# 🕵️‍♂️ Detective Division // LSPD Investigation Bureau (Roleplay)

Plataforma web temática e interactiva diseñada específicamente para divisiones de investigación, bufetes de detectives y crimen organizado en comunidades de **Roleplay (FiveM, GTA V RP, SA-MP, RedM)**, inspirada en la arquitectura de portales policiales modernos como **SAPD Portal (La Nación RP)**.

---

## 🌟 Características y Arquitectura del Sistema

### 1. 📑 Menú Lateral Táctico (Sidebar Navigation - Estilo SAPD Portal)
- **Barra de navegación lateral acoplable/desacoplable:** Permite alternar entre vista completa (275px) y vista compacta de solo iconos (76px) mediante el botón de toggle o tecla de acceso rápido.
- **Identificador de Alerta Operativa:** Widget interactivo con indicador pulsante de nivel de alerta (*CÓDIGO 2 - ELEVADO*).
- **Categorías organizadas y numeradas:** Índices numéricos (`01`, `02`, `03`...) con distintivos tácticos (*14 Casos*, *TOP 4*, *MDC 404*, *Cifrado*).
- **Tooltips flotantes:** Al acoplar la barra lateral, cada icono despliega su información detallada al pasar el cursor.
- **Sidebar Footer Integrado:** Reloj de tiempo local del servidor RP y reloj militar **ZULU**, además del interruptor de audio de radio.
- **Topbar en Área de Contenido:** Barra superior con botón de menú para móviles, marquesina con alertas de radio y accesos rápidos a MDC y Denuncias.

### 2. 🛡️ Tablón de Casos & Expedientes de Investigación (Con Editor y Creación de Informes)
- **Filtros por especialidad:** Homicidios (RHD), Narcóticos y Pandillas (GND), Robos Bancarios, Desapariciones y Asuntos Internos (IAD).
- **Buscador en tiempo real** por palabra clave, detective a cargo o código de sumario.
- **Dossier Policial Completo (Modal Interactivo):**
  - Número de caso único (`#CASE-2026-089`).
  - Prioridad táctica (Código 3, Clasificado, etc.).
  - Registro fotográfico forense de la escena.
  - Cadena de custodia y evidencias balísticas / dactilares.
  - Personas de interés con estado judicial (Prófugo, Interrogatorio, etc.).
  - Botón para imprimir el informe oficial.
  - **Botón de Edición ("Modificar Informe"):** Disponible para detectives autenticados por Discord.
- **Sistema de Modificación y Creación de Informes en Vivo:**
  - Crea nuevos expedientes con el botón `+ Nuevo Expediente`.
  - Edita cualquier expediente existente (título, división, categoría, evidencias, sospechosos, fotos, sinopsis).
  - Elimina expedientes cerrados o archivados.
  - Los cambios persisten en `localStorage` (`dd_custom_cases`).

### 3. 🤖 Verificación Oficial mediante Bot de Discord (LSPD DetectiveBot v2.4)
- **Inicio de sesión automatizado por Bot:** El sistema simula la comprobación de roles en el servidor oficial de Discord de la comunidad policial.
- **Detección Automática de Roles y Rangos:**
  - `[Capitán // Mando]` -> Nivel 5 (Acceso Supremo)
  - `[Teniente Supervisor RHD]` -> Nivel 4 (Supervisión)
  - `[Detective III GND]` -> Nivel 3 (Alto Secreto)
  - `[Detective I]` -> Nivel 2 (Confidencial)
  - `[Ciudadano / Sin Rol]` -> Nivel 0 (**¡Acceso denegado a informes y normativa!**)
- **Selector Rápido de Perfiles:** Permite seleccionar con 1 solo clic cualquiera de los roles oficiales para probar la experiencia con diferentes jerarquías y demostrar cómo el bot deniega el acceso a civiles sin rol.
- **Credencial Policial Activa:** Muestra avatar, nombre, placa, rol verificado y nivel de clearance en la barra superior y en el panel de informes.

### 4. 🎯 Los Más Buscados (Most Wanted)
- Fichas criminales con foto de prontuario, alias, delitos imputados, recompensas monetarias y nivel de riesgo ("Disparar a la vista").
- Botón **"Aportar Información Anónima"** que redirige y autocompleta el formulario con los datos del fugitivo.

### 5. 🔒 Apartado de Informes Policiales Confidenciales & Normativa RP (Acceso Exclusivo con Rango)
- **Protección Biométrica y Bloqueo a Civiles:**
  - Si el usuario no ha iniciado sesión o no tiene rango de detective en Discord, se muestra una pantalla de seguridad bloqueada con aviso de clearance restringido.
  - Si un usuario se autentica como ciudadano, el Bot rechaza el acceso explícitamente notificando la falta de rol policial.
- **Pestaña 1: Informes Confidenciales:**
  - Minutas de escuchas telefónicas con transcripción de llamadas e interceptaciones radiales.
  - Actas de inspección ocular técnico-pericial y cotejos balísticos.
  - Solicitudes judiciales de allanamiento táctico ("No-Knock").
  - Informes de compra controlada e infiltración encubierta de GND.
  - Botón para **Redactar Nuevo Informe Confidencial** e imprimir atestados.
  - Buscador en vivo y filtros por tipo de diligencia.
- **Pestaña 2: Normativa Interna & Código de Procedimiento Policial (RP):**
  - **Capítulo I:** Deber de reserva absoluta y secreto profesional (sanción por revelación de secretos).
  - **Capítulo II:** Cadena de custodia y preservación de evidencias forenses (CSI).
  - **Capítulo III:** Operaciones encubiertas e infiltración GND (prohibición de instigación / Entrapment).
  - **Capítulo IV:** Órdenes judiciales de allanamiento (Warrants) y causa probable.
  - **Capítulo V:** Uso proporcional de fuerza e incursiones tácticas armadas.
  - **Capítulo VI:** Tabla completa de rangos y atribuciones del Bureau.
- **Pestaña 3: Bandeja de Inteligencia Cifrada:**
  - Visualización en tiempo real de las pistas y denuncias anónimas remitidas por ciudadanos.

### 6. 🔒 Canal Seguro de Denuncias Anónimas
- Formulario para que ciudadanos y confidentes reporten delitos sin exponer su identidad IC.
- Generador de recibo con código cifrado único (`#TIP-XXXXXX`) y estado de la investigación.

### 7. 🔤 Tipografías de Alto Impacto
- **GoBold (`font-gobold`):** Fuente bold/condensada de máxima presencia, aplicada en títulos principales, cabeceras de secciones, nombres de oficiales, fichas de sospechosos e insignias.
- **Conthrax (`font-conthrax`):** Tipografía táctica, futurista y tecnológica, aplicada en estados tácticos, expedientes, sellos judiciales, números de placa, transmisiones de radio y reloj ZULU.

### 8. 🔊 Motor de Efectos de Sonido Inmersivo (Web Audio API)
- Beeps de radio policial y chimes de alerta generados por sintetizador nativo (no requiere archivos de audio externos ni descargas).
- Botón en la barra superior y pie del menú para activar o silenciar el sonido.

### 9. 📜 Estructura de la División & Convocatorias
- Organigrama con las 6 ramas especializadas:
  - **RHD** (Robos y Homicidios)
  - **GND** (Narcóticos y Armas)
  - **CSI** (Forense & Balística)
  - **CID** (Ciberdelincuencia & Fraude)
  - **IAD** (Asuntos Internos)
  - **CCD** (Casos Fríos & Desapariciones)
- Cadena de mando con oficiales y detectives activos.
- Sección de requisitos para postular desde patrulla ordinaria.

---

## 🚀 Cómo Abrir y Usar la Web

1. **Abrir directamente:**
   - Haz doble clic sobre el archivo `index.html` para abrirlo en cualquier navegador (Chrome, Edge, Firefox, Opera, etc.).

2. **Personalización rápida:**
   - Los datos de los casos y los antecedentes criminales se configuran en [`js/app.js`](file:///c:/Users/yusse/Documents/DB/js/app.js).
   - Para cambiar el nombre del departamento (ej: de *LSPD* a *BCSO* o *Policía Nacional*), busca y reemplaza en [`index.html`](file:///c:/Users/yusse/Documents/DB/index.html).
   - Puedes colocar el enlace de invitación al Discord de tu comunidad en el botón de la sección de reclutamiento.

