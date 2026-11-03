# 🕵️‍♂️ Detective Division // LSPD Investigation Bureau (Roleplay)

Plataforma web temática e interactiva diseñada específicamente para divisiones de investigación, bufetes de detectives y crimen organizado en comunidades de **Roleplay (FiveM, GTA V RP, SA-MP, RedM)**.

---

## 🌟 Características Principales

### 1. 🛡️ Tablón de Casos & Expedientes de Investigación
- **Filtros por especialidad:** Homicidios (RHD), Narcóticos y Pandillas (GND), Robos Bancarios, Desapariciones y Asuntos Internos (IAD).
- **Buscador en tiempo real** por palabra clave, detective a cargo o código de sumario.
- **Dossier Policial Completo (Modal Interactivo):**
  - Número de caso único (`#CASE-2026-089`).
  - Prioridad táctica (Código 3, Clasificado, etc.).
  - Registro fotográfico forense de la escena.
  - Cadena de custodia y evidencias balísticas / dactilares.
  - Personas de interés con estado judicial (Prófugo, Interrogatorio, etc.).
  - Botón para imprimir el informe oficial.

### 2. 🎯 Los Más Buscados (Most Wanted)
- Fichas criminales con foto de prontuario, alias, delitos imputados, recompensas monetarias y nivel de riesgo ("Disparar a la vista").
- Botón **"Aportar Información Anónima"** que redirige y autocompleta el formulario con los datos del fugitivo.

### 3. 💻 Simulador de Terminal Policial MDC (Mobile Data Computer)
- **Acceso Restringido para Detectives:**
  - Login rápido con credenciales de prueba: Placa `#404`, Clave PIN `104`.
- **Base de Datos de Antecedentes:**
  - Búsqueda en vivo de ciudadanos y sospechosos por Nombre, Alias, DNI o Patente del vehículo.
  - Historial penal, órdenes vigentes y licencias de conducir.
- **Control de Órdenes Judiciales:**
  - Seguimiento de órdenes de captura y allanamiento autorizadas por jueces de rol.
- **Bitácora Rápida de Campo:**
  - Los detectives pueden escribir notas de investigación que se guardan en el navegador (`localStorage`).
- **Bandeja de Entrada de Pistas Ciudadanas:**
  - Visualización en tiempo real de las denuncias anónimas recibidas.

### 4. 🔒 Canal Seguro de Denuncias Anónimas
- Formulario para que ciudadanos y confidentes reporten delitos sin exponer su identidad IC.
- Generador de recibo con código cifrado único (`#TIP-XXXXXX`) y estado de la investigación.

### 5. 🔊 Motor de Efectos de Sonido Inmersivo (Web Audio API)
- Beeps de radio policial, tonos de terminal MDC y chimes de alerta generados por sintetizador nativo (no requiere archivos de audio externos ni descargas).
- Botón en la barra superior para activar o silenciar el sonido.

### 6. 📜 Estructura de la División & Convocatorias
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

