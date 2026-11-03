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

### 2. 🛡️ Tablón de Casos & Expedientes de Investigación
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

### 5. 🔤 Tipografías de Alto Impacto
- **GoBold (`font-gobold`):** Fuente bold/condensada de máxima presencia, aplicada en títulos principales, cabeceras de secciones, nombres de oficiales, fichas de sospechosos e insignias.
- **Conthrax (`font-conthrax`):** Tipografía táctica, futurista y tecnológica, aplicada en la terminal MDC policial, códigos de casos (`#CASE-2026-089`), sellos judiciales, números de placa, transmisiones de radio y reloj ZULU.

### 6. 🔊 Motor de Efectos de Sonido Inmersivo (Web Audio API)
- Beeps de radio policial, tonos de terminal MDC y chimes de alerta generados por sintetizador nativo (no requiere archivos de audio externos ni descargas).
- Botón en la barra superior para activar o silenciar el sonido.

### 7. 📜 Estructura de la División & Convocatorias
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

